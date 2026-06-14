# AI Agent Instructions - ONEX Project

<!-- SPECIFY:START:TECH_STACK -->
**Language**: [Language and version will be auto-filled]
**Framework**: [Framework will be auto-filled]
**Database**: [Database will be auto-filled]
**Project Type**: [Project type will be auto-filled]
<!-- SPECIFY:END:TECH_STACK -->

---

## Project Overview

This is a Santander project managed with ONEX, a structured development framework that ensures:
- ✅ Compliance with Santander standards
- ✅ Quality gates and testing requirements
- ✅ Integration with Darwin Gateway and Gluon/Santander Spring Boot
- ✅ Proper documentation and contracts

<!-- SPECIFY:START:PROJECT_STRUCTURE -->
```
.onex/
  ├── specs/
  │   └── [feature-id]-[feature-name]/
  │       ├── spec.md           # Feature specification
  │       ├── plan.md           # Implementation plan
  │       ├── research.md       # Technical decisions
  │       ├── data-model.md     # Data models
  │       ├── quickstart.md     # Setup guide
  │       ├── contracts/        # API contracts
  │       └── tasks.md          # Implementation tasks
```
<!-- SPECIFY:END:PROJECT_STRUCTURE -->

---

<!-- SPECIFY:START:COMMANDS -->
## ONEX Commands

- `/onex.constitution` - Define project principles and quality gates
- `/onex.specify` - Create feature specification with user stories
- `/onex.clarify` - Clarify underspecified areas before planning
- `/onex.plan` - Generate implementation plan with research
- `/onex.tasks` - Break down into executable tasks
- `/onex.analyze` - Analyze consistency across artifacts
- `/onex.implement` - Execute implementation with TDD
- `/onex.checklist` - Generate quality checklist
- `/onex.taskstoissues` - Convert tasks to Jira issues

## Available Skills

Consult these skills for specific development needs:
- **API Design** (`backend/skills/api-design.skill/`)
- **Backend Java Microservices** (`backend/skills/backend-java-microservices.skill/`)
- **Database Optimization** (`backend/skills/database-optimization.skill/`)
- **Performance Tuning** (`backend/skills/performance-tuning.skill/`)
- **Troubleshooting** (`backend/skills/troubleshooting.skill/`)

## Quality Toolsets

Use these toolsets for code quality:
- SonarQube (`backend/toolsets/sonarqube-java.toolsets.jsonc`)
- Checkstyle (`backend/toolsets/checkstyle-code-style.toolsets.jsonc`)
- JaCoCo (`backend/toolsets/jacoco-coverage.toolsets.jsonc`)
- PMD (`backend/toolsets/pmd-code-analysis.toolsets.jsonc`)
- SpotBugs (`backend/toolsets/spotbugs-bug-detection.toolsets.jsonc`)

## Santander Expert Agents

Invoke these agents for specialized help:
- **Darwin Gateway** (`backend/agents/darwin-gateway/`) - Gateway configuration, routing, authentication
- **Java Security** (`backend/agents/java-security-expert/`) - Security best practices, Fortify compliance
- **Santander Spring Boot** (`backend/agents/santander-springboot-expert/`) - Framework-specific guidance
- **Darwin/Gluon Java** (`backend/agents/darwin-java-expert/`) - Gluon connectors, Darwin framework
<!-- SPECIFY:END:COMMANDS -->

---

## Development Guidelines

### Code Quality Standards

1. **Test Coverage**: Minimum coverage defined in constitution (typically 80%+)
2. **SonarQube**: All quality gates must pass
3. **Security**: No critical vulnerabilities in Fortify scans
4. **Documentation**: All public APIs must be documented

### Santander Specifics

#### Darwin Gateway Integration
- All external-facing APIs must be registered in Gateway
- Use proper authentication mechanisms (OAuth2, JWT)
- Follow Gateway routing conventions
- Consult `backend/agents/darwin-gateway/` for guidance

#### Gluon/Darwin Framework
- Use appropriate connectors for integrations
- Follow Gluon dependency injection patterns
- Implement proper error handling
- Consult `backend/agents/darwin-java-expert/` for guidance

#### Santander Spring Boot Framework
- Use Santander starters and autoconfiguration
- Follow Santander logging conventions
- Implement health checks and actuators
- Consult `backend/agents/santander-springboot-expert/` for guidance

### Logging Standards
```java
// Use SLF4J with structured logging
log.info("Processing transaction: transactionId={}, amount={}", txId, amount);

// Include correlation IDs for tracing
MDC.put("correlationId", correlationId);
```

### Error Handling
- Use proper HTTP status codes
- Return structured error responses
- Log errors with sufficient context
- Don't expose internal details to clients

### Database
- Use connection pooling (HikariCP)
- Implement proper transaction management
- Use migrations (Flyway/Liquibase)
- Index appropriately for performance

---

## Workflow Integration

When implementing features, follow this sequence:

1. **Understand** - Read the specification in `.onex/specs/[feature]/spec.md`
2. **Plan** - Review the implementation plan in `.onex/specs/[feature]/plan.md`
3. **Research** - Check decisions made in `.onex/specs/[feature]/research.md`
4. **Data Model** - Understand entities in `.onex/specs/[feature]/data-model.md`
5. **Contracts** - Review API contracts in `.onex/specs/[feature]/contracts/`
6. **Tasks** - Follow task order in `.onex/specs/[feature]/tasks.md`
7. **Analyze** - Validate cross-artifact consistency before coding
8. **Checklist** - Confirm readiness gate before starting implementation
9. **Test-First** - Write tests before implementation (TDD)
10. **Implement** - Code the feature following the task list
11. **Quality Check** - Run all quality tools (SonarQube, tests, etc.)
12. **Document** - Update README and API documentation

---

## Remember

- Always check the constitution (`.onex/memory/constitution.md`) for project-specific principles
- Consult the memory system (`.onex/memory/`) for past decisions
- Use `/onex.clarify` when specifications are unclear
- Use `/onex.analyze` to check consistency before committing
- If expectations change, resume from `/onex.clarify`, `/onex.plan` or `/onex.tasks` instead of restarting the whole workflow
- Leverage Santander expert agents in `backend/agents/` for specialized guidance
- Apply relevant skills from `backend/skills/` for best practices
- Configure quality toolsets from `backend/toolsets/` in CI/CD pipeline
