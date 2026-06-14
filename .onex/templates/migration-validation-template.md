# Validation Report: {{project-name}}

**Migration ID**: {{migration-id}}
**Validated on**: {{datetime}}
**Phases validated**: {{phases}}

---

## Build Status

- Compilation: ✅ OK / ❌ FAILED
- Tests: {{passed}} passed / {{failed}} failed

---

## Migration Debt

- Remaining legacy imports: {{count}} (must be 0 for full completion)
- TODO migration items: {{count}}

---

## Equivalence Checks

| Check | Status | Notes |
|-------|--------|-------|
| Build / compilation | | |
| Health endpoint responds | | |
| No legacy imports remaining | | |
| API functional equivalence | | |
| Security model active | | |
| No hardcoded credentials | | |

---

## Failed Tests

<!-- List with names and errors if any -->

---

## Open Issues

<!-- Items requiring manual resolution before PR -->

---

## Migration Completion Status

| Phase | Validation Status |
|-------|-----------------|
| Phase 1 | ⏳ |

---

## Recommendation

<!-- PASS: ready for /onex.migrate.pr  -->
<!-- PARTIAL: fix specific issues first -->
<!-- FAIL: block PR until resolved -->

---

## Next Step

- If all checks pass: run `/onex.migrate.pr`
- If checks fail: run `/onex.migrate.execute` to fix the identified issues
