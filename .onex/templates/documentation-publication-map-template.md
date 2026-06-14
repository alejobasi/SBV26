# Publication Map: {{DOC_ID}}

---

## Root Page

- Title:
- Description:
- Navigation summary:

## Publication Priority Under Root

1. Global functional documentation page
2. Backend page when applicable
3. Frontend page when applicable
4. Other technologies page when applicable
5. Source review registry page when applicable

## Domain Pages

| Page | Create? | Parent | Primary Source | Priority | Notes |
|------|---------|--------|----------------|----------|-------|
| Global functional documentation | pending | Project root | functional-documentation.md | 1 | First-class functional page under root. Do not nest under technical domains. |
| Project backend | pending | Project root | technical-documentation.md | 2 | Only when backend scope exists. |
| Project frontend | pending | Project root | technical-documentation.md | 3 | Only when frontend scope exists. |
| Project other technologies | pending | Project root | technical-documentation.md | 4 | Host, batch, AS400, .NET, or other non-target domains. |
| Source review registry | yes | Project root | source-review-log.md | 5 | Shared operational page for reviewed Confluence and Jira sources. |

## Publication Rules

- Backend page is created only when backend scope exists.
- Frontend page is created only when frontend scope exists.
- Other technologies page is created for host, AS400, .NET, batch or other non-target domains.
- Global functional documentation page is driven by `functional-documentation.md` and supported by deliverables traceability.
- Global functional documentation page must remain separate from technical domain pages.
- Root page should provide navigation and summary, not duplicate the full body of the functional page.
- Source review registry page records reviewed Confluence pages, Jira items, attachment versions and refresh decisions.

## Export Paths

- Confluence parent page:
- Repository export root: