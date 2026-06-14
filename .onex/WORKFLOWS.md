# ONEX — Workflows Reference

> Quick guide to choose and run the right workflow for your situation.

---

## ¿Qué workflow necesito?

```
¿Tienes un incidente en producción?
    ├─ SÍ → Hotfix workflow        →  /onex-fix.hotfix
    └─ NO ┬ ¿Necesitas documentar un sistema legacy, target o híbrido?
           │   └─ SÍ → Documentation workflow → /onex.doc
           └─ NO ┬ ¿Es una migración? → Migration workflow    → /onex.migrate.assess
                  └─ Feature workflow  →  11 agentes + helper interno Shell/NWE
```

---

## Feature Workflow — Desarrollo estándar

Ideal for new features, user stories, technical improvements, and refactors.

### Full sequence

```
@workspace /onex.constitution
       │
       ▼
@workspace /onex.specify   <url-jira | descripción natural>
       │
       ▼
@workspace /onex.clarify
       │
       ▼
@workspace /onex.plan
       │
       ▼
@workspace /onex.tasks
       │
       ▼
@workspace /onex.analyze
       │
       ▼
@workspace /onex.checklist
       │
       ▼
@workspace /onex.implement
       │
       ▼
@workspace /onex.taskstoissues   (optional — creates Jira issues)
       │
       ▼
@workspace /onex.review          (optional — standalone review without PR)
       │
       ▼
@workspace /onex.pr              (review gate + PR creation)
```

### Step-by-step

| # | Agent | What it does | Artefact produced |
|---|-------|-------------|-------------------|
| 1 | `/onex.constitution` | Defines project quality principles, coding standards and framework constraints | `.onex/constitution.md` |
| 2 | `/onex.specify` | Creates a BDD-style spec from natural language or Jira/Confluence URLs | `.onex/spec.md` |
| 3 | `/onex.clarify` | Identifies and resolves ambiguities before committing to a plan | Annotated spec with decisions |
| 4 | `/onex.plan` | Generates technical plan: stack, data model, API contracts, component diagram | `.onex/plan.md` |
| 5 | `/onex.tasks` | Breaks the plan into ordered, estimated tasks | `.onex/tasks.md` |
| 6 | `/onex.analyze` | Cross-artifact consistency analysis: spec ↔ plan ↔ tasks | Analysis report in chat |
| 7 | `/onex.checklist` | Readiness gate before implementation: validates quality, security and delivery expectations from constitution + framework | `.onex/checklist.md` |
| 8 | `/onex.implement` | TDD implementation, task by task, only after spec/plan/tasks are aligned. If the feature is an Angular Shell/NWE integration, it invokes the internal helper `onex.agent_shell-integration_assistant.agent.md` automatically | Source code + tests |
| 9 | `/onex.taskstoissues` | Converts `tasks.md` entries into Jira issues via MCP Atlassian | Jira issues created |
| 10 | `/onex.review` | Standalone code review against Santander/GAIA standards — SonarQube + Sysdig checks, no PR created | Review report in chat |
| 11 | `/onex.pr` | Review gate (calls `onex.review` internally) + PR creation if no blockers | PR opened |

### When to skip steps

- **Skip `constitution`** if already created for the project (check `.onex/constitution.md`)
- **Skip `clarify`** only for very small changes where requirement, design and acceptance criteria are already explicit and the team is aligned
- **Skip `taskstoissues`** if your team doesn't use MCP Atlassian integration
- **Skip `analyze`** for trivial tasks with no new components
- **Skip `review`** if going straight to `onex.pr` (it runs the same review internally)

### Canonical rule before implementation

For non-trivial features, the canonical path is:

`specify → clarify → plan → tasks → analyze → checklist → implement → review → pr`

`implement` should start only when:

- `clarify` has closed the relevant ambiguities,
- `analyze` has no unresolved FAIL items, and
- `checklist` does not expose critical gaps that would force immediate rework.

### Reflow guide — where to resume

When something changes, do **not** restart the whole workflow. Resume from the first invalidated artefact:

| Situation | Resume from | Then continue with |
|---|---|---|
| The expected behavior or acceptance criteria changed | `/onex.clarify` | `plan → tasks → analyze → checklist → implement` |
| The technical design no longer fits | `/onex.plan` | `tasks → analyze → checklist → implement` |
| The task breakdown, sequencing or dependencies are wrong | `/onex.tasks` | `analyze → checklist → implement` |
| The issue is only local code/tests and does not change scope or design | `/onex.implement` | continue implementation |

### Internal helper for Angular Shell/NWE integrations

The feature workflow now installs an additional internal helper agent:

- `onex.agent_shell-integration_assistant.agent.md`

Usage model:

- It is **installed with the `feature` workflow**.
- It is **not a public workflow step**.
- `onex.plan` uses it to capture required integration inputs and produce `shell-integration.md` when the spec indicates a Shell/NWE integration.
- `onex.tasks` generates explicit Shell integration tasks when those signals are detected.
- `onex.implement` reads it and executes the integration checklist internally.

### ONEX Traceability Policy

Apply the same traceability model across workflows:

- Commits created by ONEX must keep the `ONEX_` prefix.
- Non-code artefacts generated or updated by ONEX must end with the standard footer `Generated with ONEX` plus workflow, branch, revision and date.
- This footer is mandatory for PR bodies, Jira issue descriptions/comments created by ONEX, Confluence pages and repository documentation exports.
- Code comments are not the primary traceability mechanism.
- Add a code provenance marker only for brand-new files created almost entirely from scratch by `onex.implement` or for migration targets created as new files by `onex.migrate.execute`.
- Never add the code marker to existing files modified in place.

---

## Documentation Workflow — Documentación técnica transversal

Dedicated workflow for generating precise technical documentation from evidence.
It is designed for legacy systems, target systems, and hybrid states where the
documentation must distinguish verified facts from inferred statements.

### Full sequence

```
@workspace /onex.doc
       │  Coordinator entrypoint
       ▼
@workspace /onex.doc.assess
       │  Artefact: .onex/docs/<id>/assessment.md
       ▼
@workspace /onex.doc.deliverables   ||   @workspace /onex.doc.extract
       │  Artefact: .onex/docs/<id>/deliverables-index.md   ||   .onex/docs/<id>/evidence-index.md
       ▼
@workspace /onex.doc.enrich
       │  Artefact: .onex/docs/<id>/santander-context.md
       ▼
@workspace /onex.doc.gapcheck
       │  Artefact: .onex/docs/<id>/coverage-matrix.md
       ▼
@workspace /onex.doc.generate
       │  Artefacts: .onex/docs/<id>/technical-documentation.md + publication-map.md
       ▼
@workspace /onex.doc.publish
          Artefact: .onex/docs/<id>/publication-log.md (+ Confluence/export)
```

`onex.doc` is the recommended entrypoint. `assess` remains the routing step,
and not every documentation effort must execute every expert command manually.

### Routed variants

Use the path that matches the contributor scope:

- Technical/domain documentation only, for example backend, frontend, host or a specific repository:

```
@workspace /onex.doc.assess
       ▼
@workspace /onex.doc.extract
       ▼
@workspace /onex.doc.enrich
       ▼
@workspace /onex.doc.gapcheck
       ▼
@workspace /onex.doc.generate
       ▼
@workspace /onex.doc.publish
```

- Functional deliverables only, for example release stories from Confluence and PDF attachments:

```
@workspace /onex.doc.assess
       ▼
@workspace /onex.doc.deliverables
       ▼
@workspace /onex.doc.enrich
       ▼
@workspace /onex.doc.gapcheck
       ▼
@workspace /onex.doc.generate
       ▼
@workspace /onex.doc.publish
```

- Mixed documentation, when the same person handles both technical evidence and functional deliverables:

```
@workspace /onex.doc.assess
       ▼
@workspace /onex.doc.deliverables   ||   @workspace /onex.doc.extract
       ▼
@workspace /onex.doc.enrich
       ▼
@workspace /onex.doc.gapcheck
       ▼
@workspace /onex.doc.generate
       ▼
@workspace /onex.doc.publish
```

### Routing rules

- `deliverables` is required only when the contributor is responsible for functional scope from Confluence, Jira, child pages, or attached documents.
- `extract` is required only when the contributor is responsible for repository, runtime or domain-specific technical evidence.
- `deliverables` is the explicit functional deliverable phase for external Atlassian sources such as Confluence, Jira, child pages, and attachments accessible through MCP.
- `enrich`, `gapcheck`, `generate` and `publish` remain the consolidation stages for the scope that was actually documented.
- Multiple contributors may run different routed variants against the same Confluence destination, provided the parent page and page ownership are defined in `assessment.md` and `publication-map.md`.
- The worker agents are hidden as internal subagents for the coordinated path. `/onex.doc` is the preferred entrypoint, while phase commands remain an expert fallback when explicitly used.

### Step-by-step

| # | Agent | What it does | Artefact |
|---|-------|-------------|---------|
| 0 | `/onex.doc` | Coordinator. Runs assess, selects the routed variant, parallelizes `deliverables` and `extract` when needed, and continues until generate or publish | `assessment.md` → `publication-log.md` |
| 1 | `/onex.doc.assess` | Creates the documentation branch/workspace, classifies the system and inventories evidence sources | `assessment.md` |
| 2 | `/onex.doc.deliverables` | Optional functional step. Reads Confluence root pages, required child pages, Jira context and attached deliverables, including PDFs, normalizes stories by release and generates functional project documentation | `deliverables-index.md`, `functional-documentation.md` |
| 3 | `/onex.doc.extract` | Optional technical step. Extracts technical evidence from code, config, contracts, pipelines, data and operations artefacts | `evidence-index.md` |
| 4 | `/onex.doc.enrich` | Consolidation step. Adds Santander architecture, security and operational context for the routed scope, including deliverables-only routes | `santander-context.md` |
| 5 | `/onex.doc.gapcheck` | Consolidation step. Builds a coverage matrix across the executed steps, including `out-of-scope` areas for the selected route | `coverage-matrix.md` |
| 6 | `/onex.doc.generate` | Consolidation step. Generates the final documentation pack plus a publication map for project, domain and global pages | `technical-documentation.md`, `publication-map.md` |
| 7 | `/onex.doc.publish` | Consolidation step. Publishes to Confluence or exports the package in-repo with traceability metadata and page-tree structure | `publication-log.md` |

### Key constraints

- Branch naming: `docs/<id>` or `docs/<ticket>-<id>`
- Source of truth: `.onex/docs/<id>/`
- Publication target: Confluence preferred, repository export acceptable fallback
- Every section must be marked as `verified`, `inferred`, or `missing` through the coverage matrix
- Deliverables from Confluence and PDF attachments are normalized before technical extraction to avoid duplicates and conflicts
- `publication-map.md` is the source of truth for the published page tree
- `source-review-log.md` records reviewed Confluence pages and attachment versions so later runs can skip unchanged sources
- `functional-documentation.md` is generated inside `deliverables` as an internal synthesis artefact and drives the Global documentation page
- Gaia enriches context, but real system behavior must come from repository evidence or explicit external documentation

---

## Migration Workflow — Migraciones Santander

Dedicated workflow for migrating existing systems. Covers 5 migration types:

| Type | Scenario |
|------|---------|
| **A — Backend** | Darwin/Gluon → Santander Spring Boot |
| **B — Frontend** | Darwin Classic Angular → Darwin Gluon (SPA / Shell / Microfront) |
| **C — Architecture** | Monolith → Microservices (Strangler Fig) |
| **D — Legacy** | ASP/COBOL/AS400 → Spring Boot |
| **E — API** | API contract migration + versioning |

### Full sequence

```
@workspace /onex.migrate.assess
       │  Artefact: .onex/migrations/<id>/assessment.md
       ▼
@workspace /onex.migrate.map
       │  Artefact: .onex/migrations/<id>/migration-map.md
       ▼
@workspace /onex.migrate.execute   [repeat per phase]
       │  Artefact: code changes + .onex/migrations/<id>/progress.md
       ▼
@workspace /onex.migrate.validate
       │  Artefact: .onex/migrations/<id>/validation-report.md
       ▼
@workspace /onex.migrate.pr
```

### Step-by-step

| # | Agent | What it does | Artefact |
|---|-------|-------------|---------|
| 1 | `/onex.migrate.assess` | Detects migration type, inventories legacy code, scores complexity (1-18), lists risks | `assessment.md` |
| 2 | `/onex.migrate.map` | Builds legacy→target equivalence table, defines phases with effort/risk/rollback plans | `migration-map.md` |
| 3 | `/onex.migrate.execute` | Applies incremental transformations phase by phase, tags rollback checkpoints, verifies compilation | Source code + `progress.md` |
| 4 | `/onex.migrate.validate` | Runs build + tests + migration debt scan + security checks, produces PASS/PARTIAL/FAIL verdict | `validation-report.md` |
| 5 | `/onex.migrate.pr` | Creates PR with migration context, transformation table, rollback plan, monitoring checklist, optional Jira link | Pull Request |

### Key differences vs Feature Workflow

| Dimension | Feature Workflow | Migration Workflow | Documentation Workflow |
|-----------|-----------------|-------------------|------------------------|
| Starting point | Natural language description | Existing legacy codebase | Existing system and available evidence |
| First artefact | `spec.md` (what to build) | `assessment.md` (what exists) | `assessment.md` (what will be documented) |
| Core step | `implement` from scratch | `execute` incremental transformation | `extract` + `gapcheck` before write-up |
| Validation style | Tests and review | Regression + functional equivalence | Coverage matrix + evidence confidence |
| Storage | `.onex/specs/<id>/` | `.onex/migrations/<id>/` | `.onex/docs/<id>/` |
| Branch naming | `feat/<id>-<desc>` | `migrate/<id>-<desc>` | `docs/<id>` |

---

## Hotfix Workflow — Production Incidents

Single-agent orchestration designed for urgency. One invocation, seven internal steps.

### Invoke

```
@workspace /onex-fix.hotfix
```

Then describe the incident:

```
CRITICAL: NullPointerException in PaymentService.processCharge()
on prod since 14:23 UTC. Affects 100% of payment transactions.
Incident: INC-4472
```

### Internal steps (orchestrated automatically)

| # | Step | What happens | Artefact |
|---|------|-------------|----------|
| 0 | **Triage** | Reads `.onex/constitution.md` (if exists) to extract framework/testing/naming conventions; classifies severity; creates fix branch | Initial `.onex/hotfixes/INC-XXX.md` |
| 1 | **Diagnose** | Root-cause analysis: stack traces, recent commits, diff since last deploy | Report updated with root cause |
| 2 | **Fix** | Minimal targeted change — no refactors, no cleanups, no scope creep | Report updated with changed files + rollback plan |
| 3 | **Test** | Regression test (following constitution test conventions) + module test run | Report updated with test results |
| 4 | **Checklist express** | Abbreviated quality checklist focused on safety and regression risk | Report updated with checklist result |
| 5 | **PR** | Delegates to `onex.pr` logic — review gate + PR creation with incident context | Report updated + committed with PR link |
| 6 | **Jira** | Links PR to incident via MCP Atlassian, updates ticket status and adds resolution comment | Report finalized |

### Key constraints

- Branch naming: `fix/<TASK>-<desc>` (Santander standard)
- Commit message: `ONEX_fix(scope): desc — fixes INC-XXX`
- **No refactors during hotfix** — only the minimal surgical change needed
- **Constitution is read first** — fix and tests follow the project's established conventions
- PR description auto-includes: root cause, fix summary, test evidence, rollback plan
- **Hotfix report** generated in `.onex/hotfixes/` — audit trail committed alongside the fix

---

## Comparison (all workflows)

| Dimension | Feature workflow | Documentation workflow | Migration workflow | Hotfix workflow |
|-----------|----------------|------------------------|--------------------|-----------------|
| **Trigger** | Planned feature / story | Legacy/target documentation need | Legacy system migration | Production incident |
| **Agents invoked** | 11 agents | 6 agents | 5 agents | 1 agent (7 internal steps) |
| **Duration** | Minutes to hours | Minutes to days | Hours to sprints | Minutes |
| **Primary artefact** | `spec.md` + `plan.md` | `technical-documentation.md` + `coverage-matrix.md` | `assessment.md` + `migration-map.md` | Inline triage report |
| **Validation** | Checklist + review | Coverage matrix + publish readiness | Validation report PASS/FAIL | Express checklist |
| **Branch naming** | `feat/<TASK>-<desc>` | `docs/<id>` | `migrate/<id>-<desc>` | `fix/<TASK>-<desc>` |
| **Atlassian usage** | `taskstoissues` → new issues | Confluence publish + existing docs lookup | `migrate.pr` → link existing ticket | Link to incident |
| **Scope control** | Encouraged to expand | Evidence first, no silent assumptions | Strictly no functional changes | Strictly minimal |

---

## Quick Reference

```bash
# Feature — step by step
@workspace /onex.constitution
@workspace /onex.specify   PROJ-123
@workspace /onex.clarify
@workspace /onex.plan
@workspace /onex.tasks
@workspace /onex.analyze
@workspace /onex.checklist
@workspace /onex.implement
@workspace /onex.taskstoissues
@workspace /onex.review          # optional — standalone review
@workspace /onex.pr

# Documentation — step by step
@workspace /onex.doc

# Migration — step by step
@workspace /onex.migrate.assess
@workspace /onex.migrate.map
@workspace /onex.migrate.execute  # repeat per phase
@workspace /onex.migrate.validate
@workspace /onex.migrate.pr

# Hotfix — single command
@workspace /onex-fix.hotfix
```

---

## Related documentation

- Operational note: after upgrading ONEX to `1.4.2` or later, `onex update` refreshes both the workspace `.onex/` assets and the ONEX prompts installed in the VS Code user profile. When executed from the `san-acele1-onexcli` checkout, it prefers the templates from the active branch.
- [README.md](README.md) — project overview and installation
- [INTEGRATION-GUIDE.md](INTEGRATION-GUIDE.md) — AI-PROMPTING-FILES integration details
- [JIRA-CONFLUENCE-INTEGRATION.md](JIRA-CONFLUENCE-INTEGRATION.md) — Jira/Confluence import flow in `onex.specify`
- `.onex/docs/<id>/` — documentation workflow artefacts generated in the target project
- [DEV-SETUP.md](DEV-SETUP.md) — local setup for contributors
- [CHANGELOG.md](CHANGELOG.md) — version history and notable changes
