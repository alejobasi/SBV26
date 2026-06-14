# Technology Stack

**Project**: [Project Name]  
**Last Updated**: [Date]

---

## Overview

This document defines the complete technology stack for the project. It serves as a single source of truth for all technical choices.

---

## Language & Runtime

**Language**: [e.g., Java 17]  
**Build Tool**: [e.g., Maven 3.8, Gradle 8.0]  
**JVM**: [e.g., OpenJDK 17, GraalVM]

---

## Framework

**Primary Framework**: [e.g., Santander Spring Boot 3.2]

**Key Modules**:
- `santander-spring-boot-starter-web` - Web API development
- `santander-spring-boot-starter-data-jpa` - Data persistence
- `santander-spring-boot-starter-security` - Security & authentication
- `santander-spring-boot-starter-actuator` - Health checks & monitoring

**Alternative**: [e.g., Gluon/Darwin 2.x - for legacy service integration]

---

## Data Storage

### Primary Database
**Type**: [e.g., PostgreSQL 14]  
**Purpose**: Transactional data, user data, business entities  
**Connection Pool**: HikariCP  
**Migration Tool**: Flyway

### Cache
**Type**: [e.g., Redis 7.0]  
**Purpose**: Session storage, frequently accessed data  
**Client**: Lettuce

### Alternative Storage
**Type**: [e.g., MongoDB 6.0]  
**Purpose**: [Specific use case if applicable]

---

## Integration & Messaging

### API Gateway
**Type**: Darwin Gateway  
**Purpose**: External API exposure, authentication, rate limiting  
**Authentication**: OAuth2 with JWT tokens

### Message Broker
**Type**: [e.g., Apache Kafka 3.4]  
**Purpose**: Event streaming, async communication  
**Topics**: 
- `user-events` - User lifecycle events
- `transaction-events` - Transaction processing
- `audit-logs` - Audit trail

**Alternative**: [e.g., RabbitMQ for request/reply patterns]

### Service Discovery
**Type**: [e.g., Consul, Eureka]  
**Purpose**: Service registration and discovery

---

## Security

**Authentication**: OAuth2 / JWT  
**Authorization**: Role-Based Access Control (RBAC)  
**Secret Management**: [e.g., HashiCorp Vault, AWS Secrets Manager]  
**TLS/SSL**: Minimum TLS 1.2

**Security Scanning**:
- Fortify Static Analysis
- OWASP Dependency Check
- Snyk

---

## Testing

### Unit Testing
**Framework**: JUnit 5  
**Mocking**: Mockito  
**Assertions**: AssertJ

### Integration Testing
**Framework**: Spring Boot Test  
**Test Containers**: PostgreSQL, Redis containers

### API Testing
**Tool**: REST Assured  
**Contract Testing**: Spring Cloud Contract

### Load Testing
**Tool**: [e.g., JMeter, Gatling]

---

## Code Quality

### Static Analysis
**SonarQube**: Quality gates, code smells, security vulnerabilities  
**Checkstyle**: Code style enforcement  
**PMD**: Code analysis, best practices  
**SpotBugs**: Bug detection

### Code Coverage
**Tool**: JaCoCo  
**Target**: >= 80% line coverage, >= 70% branch coverage

**Configuration**: `backend/toolsets/jacoco-coverage.toolsets.jsonc`

---

## Logging & Monitoring

### Logging
**Framework**: SLF4J + Logback  
**Format**: JSON structured logging  
**Correlation**: MDC with correlation IDs  
**Aggregation**: [e.g., ELK Stack, Splunk]

### Metrics
**Library**: Micrometer  
**Backend**: [e.g., Prometheus, DataDog]  
**Dashboards**: Grafana

### Tracing
**Tool**: [e.g., Jaeger, Zipkin]  
**Sampling**: 10% of requests

### APM
**Tool**: [e.g., New Relic, AppDynamics, Dynatrace]

---

## CI/CD

### Version Control
**System**: Git  
**Platform**: GitHub Enterprise  
**Branching Strategy**: GitFlow

### CI Platform
**Tool**: [e.g., Jenkins, GitHub Actions, GitLab CI]  
**Pipeline Stages**:
1. Build & Compile
2. Unit Tests
3. Static Analysis (SonarQube, Checkstyle, PMD)
4. Security Scan (Fortify)
5. Build Docker Image
6. Deploy to Dev

### CD Platform
**Tool**: [e.g., ArgoCD, Spinnaker]  
**Deployment Strategy**: Blue-Green / Canary

---

## Containerization & Orchestration

**Container Runtime**: Docker  
**Base Image**: [e.g., eclipse-temurin:17-jre-alpine]  
**Orchestration**: Kubernetes  
**Package Manager**: Helm  
**Service Mesh**: [e.g., Istio, Linkerd - if applicable]

---

## Development Tools

### IDE
**Primary**: IntelliJ IDEA  
**Plugins**: 
- SonarLint
- CheckStyle-IDEA
- Lombok

### Local Development
**Docker Compose**: Local PostgreSQL, Redis, Kafka  
**Hot Reload**: Spring Boot DevTools

### API Documentation
**Tool**: Swagger / OpenAPI 3.0  
**UI**: Swagger UI at `/swagger-ui.html`

---

## Dependencies

### Core Dependencies

```xml
<!-- Framework -->
<dependency>
    <groupId>com.santander</groupId>
    <artifactId>santander-spring-boot-starter-web</artifactId>
    <version>3.2.0</version>
</dependency>

<!-- Database -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.6.0</version>
</dependency>

<dependency>
    <groupId>com.zaxxer</groupId>
    <artifactId>HikariCP</artifactId>
    <version>5.0.1</version>
</dependency>

<!-- Cache -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

<!-- Messaging -->
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>

<!-- Testing -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <scope>test</scope>
</dependency>
```

### Utility Libraries

- **Lombok**: Boilerplate reduction
- **MapStruct**: Bean mapping
- **Apache Commons Lang**: Utility functions
- **Guava**: Collections and utilities

---

## Santander Resources

### Expert Agents
- **Santander Spring Boot**: `backend/agents/santander-springboot-expert/`
- **Darwin Gateway**: `backend/agents/darwin-gateway/`
- **Gluon/Darwin**: `backend/agents/darwin-java-expert/`
- **Security**: `backend/agents/java-security-expert/`

### Skills
- **API Design**: `backend/skills/api-design.skill/`
- **Backend Java Microservices**: `backend/skills/backend-java-microservices.skill/`
- **Database Optimization**: `backend/skills/database-optimization.skill/`
- **Performance Tuning**: `backend/skills/performance-tuning.skill/`
- **Troubleshooting**: `backend/skills/troubleshooting.skill/`

### Toolsets
- **SonarQube**: `backend/toolsets/sonarqube-java.toolsets.jsonc`
- **Checkstyle**: `backend/toolsets/checkstyle-code-style.toolsets.jsonc`
- **JaCoCo**: `backend/toolsets/jacoco-coverage.toolsets.jsonc`
- **PMD**: `backend/toolsets/pmd-code-analysis.toolsets.jsonc`
- **SpotBugs**: `backend/toolsets/spotbugs-bug-detection.toolsets.jsonc`

---

## Version Matrix

| Component | Version | Support Until | Notes |
|-----------|---------|---------------|-------|
| Java | 17 LTS | 2029-09 | Primary language |
| Spring Boot | 3.2.x | 2025-11 | Santander distribution |
| PostgreSQL | 14.x | 2026-11 | Primary database |
| Redis | 7.0.x | - | Cache layer |
| Kafka | 3.4.x | - | Event streaming |
| Kubernetes | 1.27.x | 2024-10 | Container orchestration |

---

## Architecture Patterns

### Microservices Patterns
- **API Gateway**: Darwin Gateway for external access
- **Service Discovery**: [Consul/Eureka]
- **Circuit Breaker**: Resilience4j
- **Config Management**: Spring Cloud Config
- **Distributed Tracing**: Sleuth + Zipkin

### Data Patterns
- **Database per Service**: Each microservice owns its database
- **Event Sourcing**: For audit trail (optional)
- **CQRS**: Separate read/write models for complex domains (optional)
- **Saga**: Distributed transaction management

### Security Patterns
- **OAuth2 / JWT**: Token-based authentication
- **RBAC**: Role-based authorization
- **mTLS**: Service-to-service communication
- **Secret Rotation**: Automated secret refresh

---

## Environment Configuration

### Development
- **Database**: Docker container (PostgreSQL 14)
- **Cache**: Docker container (Redis 7)
- **Messaging**: Docker container (Kafka 3.4)
- **Gateway**: Mock or local Darwin Gateway

### Testing (QA)
- **Database**: Dedicated PostgreSQL instance
- **Cache**: Redis cluster
- **Messaging**: Kafka cluster (3 brokers)
- **Gateway**: QA Darwin Gateway

### Staging (Pre-Production)
- **Database**: PostgreSQL cluster (primary + replica)
- **Cache**: Redis cluster (HA)
- **Messaging**: Kafka cluster (3 brokers, replication factor 3)
- **Gateway**: Staging Darwin Gateway

### Production
- **Database**: PostgreSQL cluster (primary + 2 replicas)
- **Cache**: Redis cluster (HA with sentinel)
- **Messaging**: Kafka cluster (5 brokers, replication factor 3)
- **Gateway**: Production Darwin Gateway
- **Monitoring**: Full APM stack

---

## Update History

| Date | Change | Reason | Updated By |
|------|--------|--------|------------|
| [Date] | Initial version | Project kickoff | [Name] |
| [Date] | Added Redis cache | Performance requirements | [Name] |
| [Date] | Upgraded to Spring Boot 3.2 | Security patches | [Name] |

---

## Notes

- Keep this document updated when technology choices change
- Document the rationale for major changes in `decisions.md`
- Consult Santander expert agents when evaluating new technologies
- Review quarterly to ensure versions are current and supported
- All technology choices must align with project constitution
