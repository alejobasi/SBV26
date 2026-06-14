# Feature Specification: [FEATURE NAME]

**Created**: [DATE]  
**Author**: [AUTHOR]  
**Feature ID**: [###-feature-name]

---

## 📚 Source References

> External documentation sources used to create this specification

**Jira Issues**:
- [PROJ-XXX](https://santander.atlassian.net/browse/PROJ-XXX) - [Brief summary]

**Confluence Pages**:
- [Design Document](https://santander.atlassian.net/wiki/spaces/SPACE/pages/XXXXX/Title) - [Brief description]

**Related Documentation**:
- [Link to additional resources]

> ⚠️ If no external sources were used, remove this section.

---

## 🎯 Overview

[Brief description of what this feature does and why it's needed]

---

## 🧑‍💼 User Stories

### Priority 1 (P1) - Critical

#### US-001: [User Story Title]

**As a** [type of user]  
**I want** [to perform some action]  
**So that** [I can achieve some goal]

**Acceptance Criteria**:
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

**Technical Notes**:
- [Any technical considerations]

---

### Priority 2 (P2) - High

#### US-002: [User Story Title]

**As a** [type of user]  
**I want** [to perform some action]  
**So that** [I can achieve some goal]

**Acceptance Criteria**:
- [ ] [Criterion 1]
- [ ] [Criterion 2]

---

## 🏗️ Architecture Context

### Santander Ecosystem Integration

**Frameworks**:
- [ ] Darwin Gateway (API Gateway)
- [ ] Gluon/Darwin (Microservices Framework)
- [ ] Santander Spring Boot Framework
- [ ] Partenón Batch Architecture

**Infrastructure**:
- Environment: [Development/Preproduction/Production]
- Kafka Brokers: [Broker names if applicable]
- Databases: [Database systems used]

---

## 🔒 Security & Compliance

**Authentication**:
- [ ] OAuth2
- [ ] JWT
- [ ] BKS (Banco Key Store)

**Compliance Requirements**:
- [ ] GDPR compliance
- [ ] Santander security policies
- [ ] Audit logging

---

## 📊 Non-Functional Requirements

### Performance
- Response time: [Target response time]
- Throughput: [Expected TPS]
- Concurrent users: [Expected load]

### Availability
- Uptime requirement: [Target %]
- Recovery Time Objective (RTO): [Time]
- Recovery Point Objective (RPO): [Time]

### Scalability
- Expected growth: [Details]
- Scaling strategy: [Horizontal/Vertical]

---

## 🧪 Testing Strategy

### Unit Tests
- Coverage target: [%]
- Key components to test: [List]

### Integration Tests
- External systems: [List systems to integrate with]
- Mock services: [What needs mocking]

### End-to-End Tests
- Critical paths: [List critical user journeys]

---

## 📝 Dependencies

### Related Jira Issues
> Auto-populated from Jira if source issue provided

- **Blocks**: [PROJ-XXX](url) - [Brief summary]
- **Blocked by**: [PROJ-YYY](url) - [Brief summary]
- **Related**: [PROJ-ZZZ](url) - [Brief summary]

### Internal Dependencies
- [ ] [Team/Service dependency 1]
- [ ] [Team/Service dependency 2]

### External Dependencies
- [ ] [External system 1]
- [ ] [External system 2]

---

## 🚀 Deployment Strategy

**Deployment Type**: [Blue-Green/Canary/Rolling]

**Rollback Plan**: [Brief description]

**Monitoring**: [Key metrics to monitor]

---

## 📅 Timeline

- **Estimation**: [Story points or time estimate]
- **Target completion**: [Date]

---

## 🔍 Open Questions / Clarifications Needed

1. [Question 1]
2. [Question 2]

---

## 📚 References

- [Link to architecture diagrams]
- [Link to API documentation]
- [Link to related features]

---

<!-- METADATA -->
**Last Updated**: [DATE]  
**Status**: [Draft/In Review/Approved/In Development/Completed]
