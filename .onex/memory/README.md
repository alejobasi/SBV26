# ONEX Memory System

Este directorio contiene la "memoria" persistente del proyecto ONEX, manteniendo contexto e historia de decisiones a lo largo del ciclo de vida del desarrollo.

---

## 📋 Propósito

El sistema de memoria sirve para:

1. **Mantener contexto**: Preserve decisiones y rationale a lo largo del tiempo
2. **Trazabilidad**: Track evolución de tecnologías y arquitectura
3. **Onboarding**: Ayuda a nuevos miembros a entender el proyecto
4. **Auditoría**: Documenta compliance con estándares Santander
5. **Retrospectivas**: Base para análisis post-mortem y mejoras

---

## 📁 Archivos del Sistema

### INDEX.md ⚡ (Lazy Loading Manifest)
**Qué es**: Manifiesto ultra-ligero (~500 bytes) que los agentes leen PRIMERO antes de cargar cualquier otro archivo de memoria  
**Creado por**: `onex init` / `onex add-workflow`  
**Actualizado por**: Todos los agentes que escriben en memoria

**Contenido**:
- **Memory Manifest**: Tabla resumen de todos los archivos (nombre, tamaño, última actualización, resumen de una línea)
- **Active Context**: Feature actual, punto de reanudación, rama, último agente, blockers
- **Recent Journal Keywords**: Keywords extraídas de `journal.md` para búsqueda rápida sin leer el archivo completo

**Cuándo actualizar**:
- Después de cada escritura a cualquier archivo de memoria
- Al iniciar/finalizar una feature
- Al añadir una entrada a `journal.md` (extraer keywords al INDEX)

**Cómo se usa**:
- Los agentes leen INDEX.md al inicio en lugar de cargar todos los archivos de memoria
- Basándose en la información del INDEX, deciden qué archivos cargar completos:
  - Si necesitan convenciones de código → cargan `constitution.md`
  - Si necesitan punto de reanudación y el INDEX lo tiene → **no** cargan `progress.md`
  - Si entran en un bucle de debug → verifican keywords del journal en el INDEX primero
  - Si no hay keyword coincidente → **no** cargan `journal.md`

**Ahorro estimado**: ~84% de tokens en una feature típica de 12 tareas

---

### constitution.md
**Qué es**: Principios inmutables del proyecto  
**Creado por**: `/onex.constitution`  
**Actualizado por**: Manual (debe ser deliberado)

**Contenido**:
- Principles & Values
- Quality Gates (test coverage, SonarQube, Fortify)
- Development Practices (TDD, pair programming)
- Technology Constraints (frameworks, databases permitidos)
- Team Values (code review, documentation)

**Cuándo actualizar**:
- Al inicio del proyecto
- Cuando el equipo acuerda un nuevo principio
- Raramente (debe ser estable)

**Ejemplo**:
```markdown
### Principle 1: Test-Driven Development
All production code must have tests written first.

**Quality Gate**: Minimum 80% test coverage
**Rationale**: Ensures code quality and prevents regressions
**Enforced by**: JaCoCo + SonarQube quality gate
```

---

### decisions.md
**Qué es**: Log de decisiones técnicas importantes  
**Creado por**: `/onex.constitution` (inicial)  
**Actualizado por**: `/onex.clarify`, `/onex.plan`, manual

**Contenido**:
- Architecture Decision Records (ADRs)
- Framework choices (Santander Spring Boot vs Gluon)
- Database selections
- Integration patterns (Darwin Gateway config)
- Trade-offs y rationale

**Formato**: Lightweight ADR
```markdown
### Decision [ID]: [Title]
**Date**: [YYYY-MM-DD]
**Status**: [Accepted/Deprecated]
**Deciders**: [Who made the decision]

#### Context
[What problem we're solving]

#### Options Considered
1. Option A (pros/cons)
2. Option B (pros/cons)

#### Decision
[What we chose and why]

#### Consequences
- Positive: [benefits]
- Negative: [trade-offs]

#### References
- backend/agents/santander-springboot-expert/
- backend/skills/database-optimization.skill/
```

**Cuándo actualizar**:
- Después de `/onex.clarify` (decisiones técnicas)
- Durante `/onex.plan` (research phase)
- Cuando se toma decisión arquitectónica importante
- Cuando se depreca una tecnología

---

### tech-stack.md
**Qué es**: Stack tecnológico completo del proyecto  
**Creado por**: `/onex.constitution` (inicial)  
**Actualizado por**: `/onex.plan`, `update-agent-context.ps1` / `update-agent-context.sh`

**Contenido**:
- Language & Runtime (Java 17, Python 3.11)
- Framework (Santander Spring Boot, Gluon)
- Data Storage (PostgreSQL, Redis, MongoDB)
- Integration (Darwin Gateway, Kafka)
- Security tools (Fortify, OWASP)
- Testing frameworks (JUnit, Mockito)
- CI/CD tools (Jenkins, ArgoCD)
- Quality toolsets (SonarQube, Checkstyle)
- Monitoring (Prometheus, Grafana)

**Incluye**:
- Version matrix (qué versiones soportamos)
- Dependencies (Maven/Gradle dependencies)
- Environment configs (dev, test, staging, prod)
- Referencias a Santander resources:
  - Expert agents (`backend/agents/`)
  - Skills (`backend/skills/`)
  - Toolsets (`backend/toolsets/`)

**Cuándo actualizar**:
- Al finalizar `/onex.plan` (tech stack definido)
- Cuando se upgrade una dependencia major
- Cuando se añade nueva tecnología
- Quarterly review de versiones

---

### progress.md
**Qué es**: Estado actual del proyecto y features  
**Creado por**: `/onex.constitution` (inicial)  
**Actualizado por**: Todos los comandos ONEX

**Contenido**:
- Summary (total features, tasks, test coverage)
- Feature tracking por ID
- Current sprint/iteration
- Quality metrics (SonarQube, security scans)
- ONEX command usage stats
- Milestones y timelines
- Team velocity
- Blockers & risks
- Constitution compliance tracking
- Technical debt log
- Integration status (agents, skills, toolsets used)
- Deployment history

**Cuándo actualizar**:
- Después de cada comando ONEX
- Al completar una feature
- Daily/weekly según cadencia del equipo
- Antes de retrospectives

**Actualización automática**:
```markdown
Comando → Actualización en progress.md

/onex.specify → Añade feature, marca "Planning"
/onex.plan → Marca "Plan created", añade timeline
/onex.tasks → Marca "Tasks defined", añade task count
/onex.analyze → Añade issues encontrados
/onex.implement → Actualiza metrics (coverage, SonarQube)
/onex.checklist → Documenta checklist results
/onex.taskstoissues → Añade Jira issues link
```

---

### journal.md
**Qué es**: Base de conocimiento persistente de errores no triviales ya resueltos  
**Creado por**: `onex init` / `onex add-workflow` (si no existe)  
**Actualizado por**: `/onex.implement`, `/onex-fix.hotfix`, `/onex.migrate.execute`

**Contenido**:
- Síntoma o error exacto
- Causa raíz validada
- Solución aplicada
- Evidencia de validación
- Keywords reutilizables
- Contexto técnico (SO, lenguaje, framework, comando)

**Cuándo actualizar**:
- Cuando un error requiera varios intentos antes de resolverse
- Cuando la causa raíz no sea obvia
- Cuando la solución sea reutilizable en futuras sesiones
- Cuando un hotfix o migración encuentre un workaround importante

**Cómo se usa**:
- Antes de entrar en un bucle largo de depuración, los agentes consultan `journal.md`
- Si encuentran una coincidencia fuerte, prueban primero esa solución
- Si resuelven un caso nuevo y costoso, añaden una nueva entrada

**Diferencia con `progress.md`**:
- `progress.md` = estado del trabajo y punto de reanudación
- `journal.md` = memoria de soluciones técnicas reutilizables

**Formato**:
```markdown
### JRN-YYYYMMDD-001 — Título corto
- Status: Validated
- Date: YYYY-MM-DD
- Workflow: feature | hotfix | migration
- Agent: /onex.implement | /onex-fix.hotfix | /onex.migrate.execute

#### Symptom
- Exact error:
- Failing command/test:

#### Root Cause
- Explicación breve

#### Solution
1. Paso 1
2. Paso 2

#### Validation
- Command run:
- Result:

#### Reuse Signals
- Keywords:
- Similar situations:
```

---

## 🔄 Workflow de Actualización

### Durante el Ciclo de Vida de una Feature

```
1. /onex.constitution
   ├─> Crea constitution.md (si no existe)
   ├─> Crea decisions.md (template inicial)
   ├─> Crea tech-stack.md (template inicial)
   ├─> Crea progress.md (tracking inicial)
   └─> Actualiza INDEX.md (manifest de cada archivo creado)

2. /onex.specify
   └─> Actualiza progress.md (nueva feature, status: Planning)

3. /onex.clarify
   └─> Actualiza decisions.md (decisiones técnicas)

4. /onex.plan
   ├─> Actualiza tech-stack.md (stack definido)
   ├─> Actualiza decisions.md (research decisions)
   └─> Actualiza progress.md (plan created, timeline)

5. /onex.tasks
   └─> Actualiza progress.md (tasks defined, task count)

6. /onex.analyze
   └─> Actualiza progress.md (issues found)

7. /onex.implement
   ├─> Lee INDEX.md primero (lazy loading)
   ├─> Carga progress.md solo si INDEX no tiene resume point
   ├─> Carga journal.md solo si INDEX keywords coinciden con error
   ├─> Actualiza progress.md (implementation progress, metrics)
   ├─> Consulta journal.md antes de iterar mucho sobre un error
   ├─> Añade entrada a journal.md si resuelve un bloqueo reutilizable
   ├─> Actualiza INDEX.md (Active Context, Journal Keywords, Manifest)
   └─> Actualiza tech-stack.md (si se añaden deps)

8. /onex.checklist
   └─> Actualiza progress.md (quality checks)

9. /onex.taskstoissues
   └─> Actualiza progress.md (Jira issues created)

Hotfix / Migration:
- `/onex-fix.hotfix` lee INDEX.md primero, consulta keywords antes de cargar `journal.md`
- `/onex.migrate.execute` lee INDEX.md primero, consulta keywords antes de cargar `journal.md`
- Ambos actualizan INDEX.md al añadir soluciones a `journal.md`
```

### Actualizaciones Periódicas

**Weekly**:
- Revisar progress.md
- Actualizar blockers y risks
- Verificar quality metrics

**Monthly**:
- Revisar tech-stack.md (versiones)
- Añadir nuevas decisiones a decisions.md
- Retrospective entries en progress.md

**Quarterly**:
- Revisar constitution.md (¿sigue vigente?)
- Version matrix en tech-stack.md
- Archive completed features en progress.md

---

## 🎯 Integración con Santander Resources

El sistema de memoria referencia constantemente:

### Expert Agents
```markdown
decisions.md → "Consulted backend/agents/darwin-gateway/ for routing"
tech-stack.md → "Santander resources: backend/agents/santander-springboot-expert/"
```

### Skills
```markdown
decisions.md → "Applied patterns from backend/skills/api-design.skill/"
progress.md → "Skills used: database-optimization, performance-tuning"
```

### Toolsets
```markdown
tech-stack.md → "Quality toolsets: backend/toolsets/sonarqube-java.toolsets.jsonc"
progress.md → "Configured: SonarQube, JaCoCo, Checkstyle"
```

---

## 📊 Métricas Tracked

### Código
- Test coverage (target vs actual)
- SonarQube quality gate status
- Code smells, bugs, vulnerabilities
- Technical debt ratio
- Code duplication

### Features
- Total features planned/completed
- Average cycle time
- Velocity (story points/sprint)
- Blockers count

### Quality
- Security scan results (Fortify, OWASP)
- Performance metrics (response times)
- Constitution compliance

### Team
- ONEX command usage
- Agents/skills consulted
- Retrospective action items

---

## 🔒 Best Practices

### DO
- ✅ Update progress.md after cada comando ONEX
- ✅ Document rationale en decisions.md
- ✅ Keep tech-stack.md current con versiones
- ✅ Reference Santander resources (agents/skills/toolsets)
- ✅ Use ADR format para decisiones importantes
- ✅ Review memory files en retrospectives

### DON'T
- ❌ Cambiar constitution.md frecuentemente (debe ser estable)
- ❌ Borrar decisiones deprecated (mark as deprecated)
- ❌ Dejar progress.md desactualizado
- ❌ Olvidar documentar trade-offs
- ❌ Ignorar el sistema de memoria (pierde valor)

---

## 🔗 Links Útiles

- **ONEX Main README**: `../README.md`
- **Constitution Template**: `../templates/constitution-template.md`
- **Santander Agents**: `../../../backend/agents/`
- **Santander Skills**: `../../../backend/skills/`
- **Santander Toolsets**: `../../../backend/toolsets/`

---

## 📝 Notas

- Este directorio es `.onex/memory/` en la raíz del proyecto
- Archivos aquí son human-readable Markdown
- Versionados en Git para trazabilidad histórica
- Consultados por comandos ONEX para contexto
- Actualizados automáticamente cuando es posible
- Revisados manualmente en retrospectives

**Mantén la memoria actualizada para maximizar el valor de ONEX!** 🧠
