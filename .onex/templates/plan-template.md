# Implementation Plan: [FEATURE]

**Feature**: [###-feature-name]  
**Created**: [DATE]  
**Status**: [Planning/In Progress/Complete]

---

## 📋 Technical Context

### Technology Stack

**Language/Version**: [e.g., Java 17, Python 3.11]

**Primary Dependencies**:
- Framework: [e.g., Santander Spring Boot 3.2, Gluon 2.x]
- Libraries: [List key libraries]

**Storage**: [e.g., PostgreSQL 14, MongoDB 6.0, Redis]

**Project Type**: [e.g., Microservice, Batch Job, Gateway Configuration]

---

## ✅ Constitution Check

Reviewing feature against project constitution principles:

### Principle 1: [PRINCIPLE NAME]
- ✅ **Complies**: [Explanation]
- ⚠️ **Deviation**: [If any, with justification]

### Principle 2: [PRINCIPLE NAME]
- ✅ **Complies**: [Explanation]

---

## 🎯 Constitution Quality Gates

- [ ] **Code Quality**: Unit test coverage >= [X]%, SonarQube quality gate passes
- [ ] **Security**: No critical vulnerabilities, Fortify scan passes
- [ ] **Documentation**: API docs, README, architecture diagrams complete
- [ ] **Santander Standards**: Follows logging, monitoring, error handling guidelines

---

## 📁 Project Structure

### Documentation (this feature)

```text
.onex/specs/[###-feature]/
├── plan.md              # This file (/onex.plan command output)
├── research.md          # Phase 0 output (/onex.plan command)
├── data-model.md        # Phase 1 output (/onex.plan command)
├── quickstart.md        # Phase 1 output (/onex.plan command)
├── contracts/           # Phase 1 output (/onex.plan command)
└── tasks.md             # Phase 2 output (/onex.tasks command)
```

### Application Structure

```text
src/
├── main/
│   ├── java/
│   │   └── com/santander/[domain]/
│   │       ├── controller/
│   │       ├── service/
│   │       ├── repository/
│   │       ├── model/
│   │       ├── dto/
│   │       ├── config/
│   │       └── exception/
│   └── resources/
│       ├── application.yml
│       └── logback-spring.xml
└── test/
    └── java/
        └── com/santander/[domain]/
```

---

## 🔬 Phase 0: Research & Decision Making

### Objective
Resolve all "NEEDS CLARIFICATION" items from spec and make key technical decisions.

### Research Topics

1. **[Topic 1]**
   - Question: [What needs to be researched]
   - Options: [List alternatives]
   - Recommendation: [Decision with rationale]

2. **[Topic 2]**
   - Question: [What needs to be researched]
   - Options: [List alternatives]
   - Recommendation: [Decision with rationale]

### Darwin/Gluon Specific Decisions

- **Connector Selection**: [Which Gluon connectors to use]
- **Gateway Configuration**: [How to configure Darwin Gateway]
- **Circuit Breaker**: [Resilience4j/Hystrix configuration]

### Output
Create `research.md` with all decisions documented.

---

## 🎨 Phase 1: Design & Contracts

**Prerequisites**: `research.md` complete

### 1. Data Model (`data-model.md`)

Extract entities from feature spec:

#### Entity: [EntityName]
- **Fields**:
  - `id`: Long (Primary Key)
  - `name`: String (Required, max 255)
  - `status`: Enum [ACTIVE, INACTIVE]
  - `createdAt`: LocalDateTime
  - `updatedAt`: LocalDateTime

- **Relationships**:
  - ManyToOne with [OtherEntity]

- **Validation Rules**:
  - Name must be unique
  - Status cannot be null

### 2. API Contracts (`contracts/`)

Generate API contracts from functional requirements:

#### POST /api/v1/[resource]
```yaml
openapi: 3.0.0
paths:
  /api/v1/[resource]:
    post:
      summary: [Description]
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateRequest'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Response'
```

### 3. Quickstart Guide (`quickstart.md`)

```bash
# Build
mvn clean install

# Run locally
mvn spring-boot:run

# Test
curl -X POST http://localhost:8080/api/v1/[resource] \
  -H "Content-Type: application/json" \
  -d '{"field": "value"}'
```

### Output
- `data-model.md`
- `contracts/*.yaml`
- `quickstart.md`

---

## 📝 Phase 2: Task Breakdown

**Prerequisites**: Phase 1 complete

Use `/onex.tasks` command to generate `tasks.md` with:
- Infrastructure setup tasks
- Entity implementation tasks
- Service layer tasks
- Controller/API tasks
- Testing tasks

---

## 🚀 Phase 3: Implementation

**Prerequisites**: `tasks.md` complete

Use `/onex.implement` command to execute tasks in order.

### Implementation Order

1. **Database Schema** (if applicable)
   - Create migration scripts
   - Define entities with JPA annotations

2. **Repository Layer**
   - Implement repositories
   - Add custom queries if needed

3. **Service Layer**
   - Business logic implementation
   - Transaction management
   - Error handling

4. **Controller Layer**
   - REST endpoints
   - Request/Response DTOs
   - Validation

5. **Testing**
   - Unit tests (Service layer)
   - Integration tests (Repository + Service)
   - API tests (Controller)

6. **Documentation**
   - Swagger/OpenAPI annotations
   - README updates
   - Architecture diagrams

---

## 🧪 Testing Strategy

### Unit Tests
- **Target Coverage**: 80%
- **Focus**: Service layer business logic
- **Tools**: JUnit 5, Mockito, AssertJ

### Integration Tests
- **Scope**: Repository + Service + External dependencies
- **Tools**: Spring Boot Test, Testcontainers
- **Database**: H2 in-memory or Testcontainers PostgreSQL

### API Tests
- **Scope**: End-to-end API testing
- **Tools**: RestAssured, MockMvc
- **Coverage**: All endpoints, error scenarios

### Performance Tests
- **Load**: [Expected TPS]
- **Tools**: JMeter, Gatling
- **Metrics**: Response time p95, p99

---

## 🔍 Code Quality

### Static Analysis
- **SonarQube**: Quality gate must pass
- **SpotBugs**: No high/critical issues
- **Checkstyle**: Follow Santander conventions
- **PMD**: No violations

### Security
- **Fortify**: Security scan must pass
- **Dependency Check**: No critical vulnerabilities
- **OWASP**: Follow security guidelines

---

## 📊 Monitoring & Observability

### Metrics
- Request count, latency, error rate
- JVM metrics (heap, GC, threads)
- Custom business metrics

### Logging
- Structured logging (JSON)
- Correlation ID in all logs
- Log levels: TRACE < DEBUG < INFO < WARN < ERROR

### Tracing
- Distributed tracing with Sleuth/Zipkin
- Span propagation across services

---

## 🚢 Deployment

### Build & Package
```bash
mvn clean package
docker build -t [image-name]:[version] .
```

### Environment Variables
- `SPRING_PROFILES_ACTIVE`: [environment]
- `DB_HOST`: [database host]
- `KAFKA_BROKERS`: [broker list]

### Helm Charts (if applicable)
- values.yaml for each environment
- ConfigMaps and Secrets

---

## 📚 References

- [Darwin Gateway Documentation](#)
- [Gluon Java Documentation](#)
- [Santander Spring Boot Standards](#)
- [Architecture Decision Records](#)

---

<!-- METADATA -->
**Last Updated**: [DATE]  
**Implementation Status**: [Not Started/In Progress/Complete]
