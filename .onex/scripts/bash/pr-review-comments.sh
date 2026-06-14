#!/usr/bin/env bash

# Scan and reply to GitHub pull request review comments for ONEX.

set -euo pipefail

PYTHON_BIN=""
if command -v python3 >/dev/null 2>&1; then
    PYTHON_BIN="python3"
elif command -v python >/dev/null 2>&1; then
    PYTHON_BIN="python"
else
    echo "ERROR: Python is required to process GitHub review comment payloads." >&2
    exit 1
fi

"$PYTHON_BIN" - "$@" <<'PY'
import argparse
import json
import os
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from typing import Any

DEFAULT_AUTHORS = [
    "copilot-pull-request-reviewer[bot]",
    "github-copilot[bot]",
    "copilot[bot]",
]
DEFAULT_SIGNATURE = "<!-- ONEX:auto-replied -->"


def run_gh_json(args: list[str]) -> Any:
    result = subprocess.run(
        ["gh", *args],
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        stderr = result.stderr.strip()
        raise RuntimeError(f"gh command failed: gh {' '.join(args)} :: {stderr}")

    output = result.stdout.strip()
    if not output:
        return None
    return json.loads(output)


def assert_gh_ready() -> None:
    version = subprocess.run(["gh", "--version"], capture_output=True, text=True, check=False)
    if version.returncode != 0:
        raise RuntimeError("GitHub CLI (gh) is required.")

    auth = subprocess.run(["gh", "auth", "status"], capture_output=True, text=True, check=False)
    if auth.returncode != 0:
        raise RuntimeError("GitHub CLI is not authenticated. Run gh auth login first.")


def get_repo_context(pr_number: int | None) -> dict[str, Any]:
    repo = run_gh_json(["repo", "view", "--json", "owner,name"])
    pr_args = ["pr", "view"]
    if pr_number is not None:
        pr_args.append(str(pr_number))
    pr_args.extend(["--json", "number,url,headRefName,baseRefName"])
    pull_request = run_gh_json(pr_args)

    return {
        "owner": repo["owner"]["login"],
        "name": repo["name"],
        "pullRequest": pull_request,
    }


def get_all_review_comments(owner: str, repo: str, pr_number: int) -> list[dict[str, Any]]:
    comments: list[dict[str, Any]] = []
    page = 1

    while True:
        endpoint = f"repos/{owner}/{repo}/pulls/{pr_number}/comments?per_page=100&page={page}"
        page_comments = run_gh_json(["api", endpoint]) or []
        if not page_comments:
            break

        comments.extend(page_comments)
        if len(page_comments) < 100:
            break
        page += 1

    return comments


def replies_by_parent(comments: list[dict[str, Any]]) -> dict[int, list[dict[str, Any]]]:
    grouped: dict[int, list[dict[str, Any]]] = {}
    for comment in comments:
        parent_id = comment.get("in_reply_to_id")
        if parent_id is None:
            continue
        grouped.setdefault(int(parent_id), []).append(comment)
    return grouped


def has_signed_reply(replies: list[dict[str, Any]], signature: str) -> bool:
    return any(signature in (reply.get("body") or "") for reply in replies)


def build_scan_result(
    context: dict[str, Any],
    comments: list[dict[str, Any]],
    authors: list[str],
    signature: str,
) -> dict[str, Any]:
    reply_map = replies_by_parent(comments)
    candidates: list[dict[str, Any]] = []

    for comment in comments:
        if comment.get("in_reply_to_id") is not None:
            continue

        author = ((comment.get("user") or {}).get("login"))
        if author not in authors:
            continue

        existing_replies = reply_map.get(int(comment["id"]), [])
        if has_signed_reply(existing_replies, signature):
            continue

        candidates.append(
            {
                "commentId": comment["id"],
                "author": author,
                "path": comment.get("path"),
                "line": comment.get("line"),
                "side": comment.get("side"),
                "commitId": comment.get("commit_id"),
                "createdAt": comment.get("created_at"),
                "url": comment.get("html_url"),
                "diffHunk": comment.get("diff_hunk"),
                "body": comment.get("body"),
                "replyCount": len(existing_replies),
            }
        )

    return {
        "repository": {
            "owner": context["owner"],
            "name": context["name"],
        },
        "pullRequest": {
            "number": context["pullRequest"]["number"],
            "url": context["pullRequest"]["url"],
            "headRefName": context["pullRequest"].get("headRefName"),
            "baseRefName": context["pullRequest"].get("baseRefName"),
        },
        "signature": signature,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "candidateCount": len(candidates),
        "candidates": candidates,
    }


def write_json(data: dict[str, Any], output_path: str | None) -> None:
    payload = json.dumps(data, indent=2, ensure_ascii=False)
    if output_path:
        os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as handle:
            handle.write(payload)
    print(payload)


def load_responses(input_path: str) -> list[dict[str, Any]]:
    with open(input_path, "r", encoding="utf-8") as handle:
        data = json.load(handle)
    responses = data.get("responses")
    if not isinstance(responses, list):
        raise RuntimeError("Input JSON must contain a responses array.")
    return responses


def create_reply(owner: str, repo: str, pr_number: int, comment_id: int, body: str) -> dict[str, Any]:
    payload = {"body": body, "in_reply_to": comment_id}
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", delete=False) as handle:
        json.dump(payload, handle)
        payload_path = handle.name

    try:
        result = subprocess.run(
            [
                "gh",
                "api",
                "--method",
                "POST",
                f"repos/{owner}/{repo}/pulls/{pr_number}/comments",
                "--input",
                payload_path,
            ],
            capture_output=True,
            text=True,
            check=False,
        )
        if result.returncode != 0:
            stderr = result.stderr.strip()
            raise RuntimeError(
                f"gh api failed while replying to comment {comment_id}: {stderr}"
            )
        return json.loads(result.stdout)
    finally:
        try:
            os.remove(payload_path)
        except OSError:
            pass


def apply_replies(
    context: dict[str, Any],
    comments: list[dict[str, Any]],
    responses: list[dict[str, Any]],
    signature: str,
) -> dict[str, Any]:
    reply_map = replies_by_parent(comments)
    posted: list[dict[str, Any]] = []
    skipped: list[dict[str, Any]] = []

    for response in responses:
        comment_id = int(response.get("commentId"))
        body = (response.get("body") or "").strip()

        if not body:
            skipped.append({"commentId": comment_id, "reason": "empty-body"})
            continue

        if signature not in body:
            body = f"{body}\n\n{signature}"

        existing_replies = reply_map.get(comment_id, [])
        if has_signed_reply(existing_replies, signature):
            skipped.append({"commentId": comment_id, "reason": "already-replied"})
            continue

        created = create_reply(
            context["owner"],
            context["name"],
            int(context["pullRequest"]["number"]),
            comment_id,
            body,
        )
        posted.append({"commentId": comment_id, "replyUrl": created.get("html_url")})

    return {
        "repository": {
            "owner": context["owner"],
            "name": context["name"],
        },
        "pullRequest": {
            "number": context["pullRequest"]["number"],
            "url": context["pullRequest"]["url"],
        },
        "appliedAt": datetime.now(timezone.utc).isoformat(),
        "postedCount": len(posted),
        "skippedCount": len(skipped),
        "posted": posted,
        "skipped": skipped,
    }


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Scan and reply to GitHub pull request review comments for ONEX."
    )
    parser.add_argument("--action", required=True, choices=["scan", "apply"])
    parser.add_argument("--pr-number", type=int)
    parser.add_argument("--output")
    parser.add_argument("--input")
    parser.add_argument("--signature", default=DEFAULT_SIGNATURE)
    parser.add_argument(
        "--authors",
        default=",".join(DEFAULT_AUTHORS),
        help="Comma-separated author logins to consider for auto-reply scanning.",
    )
    return parser.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    authors = [item.strip() for item in args.authors.split(",") if item.strip()]

    assert_gh_ready()
    context = get_repo_context(args.pr_number)
    comments = get_all_review_comments(
        context["owner"],
        context["name"],
        int(context["pullRequest"]["number"]),
    )

    if args.action == "scan":
        result = build_scan_result(context, comments, authors, args.signature)
        write_json(result, args.output)
        return 0

    if not args.input:
        raise RuntimeError("--input is required when --action=apply.")

    responses = load_responses(args.input)
    result = apply_replies(context, comments, responses, args.signature)
    write_json(result, args.output)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except Exception as exc:  # pragma: no cover - shell script runtime path
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
PY
