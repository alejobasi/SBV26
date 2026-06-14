# Migration Assessment: {{project-name}}

**Migration ID**: {{migration-id}}
**Date**: {{date}}
**Type**: {{migration-type}} — {{migration-type-description}}
**Complexity**: {{complexity}} (score: {{score}}/18)

---

## Detected Fingerprints

<!-- List the triggers/signals found during scan -->
- `{{fingerprint-1}}`
- `{{fingerprint-2}}`

---

## Inventory

<!-- Targeted inventory based on migration type -->

### Files affected
| Category | Count | Examples |
|----------|-------|---------|
| Configuration | | |
| Security | | |
| REST clients | | |
| Repositories / Data access | | |
| Messaging | | |
| Tests | | |

### Dependencies (legacy)
<!-- list from pom.xml / package.json -->

---

## Complexity Scorecard

| Category | Score (1-3) | Notes |
|----------|------------|-------|
| Volume (files / LoC) | | |
| Security model change | | |
| Database changes required | | |
| Messaging/async patterns | | |
| External dependencies | | |
| Existing test coverage | | |
| **Total** | /18 | |

> **1-6**: Simple · **7-12**: Moderate · **13-18**: Complex

---

## Risks

1. {{risk-1}}
2. {{risk-2}}
3. {{risk-3}}

---

## Recommended Approach

{{approach-justification}}

---

## Next Step

Run `/onex.migrate.map` to generate the equivalence map and migration roadmap.
