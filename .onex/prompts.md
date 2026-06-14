# ONEX Example Prompts

This file contains example inputs for the public documentation workflow
commands. Adjust the URLs, page names and publication targets to your project.

---

## Example for `/onex.doc`

```text
Quiero documentar este sistema de forma funcional y técnica usando fuentes
externas de Atlassian y la evidencia del repositorio.

Fuentes funcionales que quiero revisar:
- Esta página de Confluence: AQUI_PEGA_LA_URL_DE_CONFLUENCE
- Estas issues o épicas de Jira: AQUI_PEGA_LAS_URLS_O_KEYS

Objetivo de esta ejecución:
- Generar deliverables funcionales explícitos a partir de Confluence, Jira y adjuntos
- Extraer evidencia técnica verificable del repositorio
- Construir la documentación final y dejar la publicación preparada

Instrucciones:
- Usa /onex.doc.assess para decidir la ruta
- Si detectas alcance mixto, ejecuta deliverables y extract en paralelo
- Trata los datos externos de Atlassian como fuente principal para la documentación funcional
- No inventes comportamiento del sistema cuando falte evidencia
- Si falta contexto para publicar en Confluence, deja publication-log.md actualizado con el pendiente

Si puedes publicar ahora, publícalo en Confluence bajo esta página padre:
AQUI_PEGA_LA_URL_DE_LA_PAGINA_PADRE_DESTINO
```

---

## Example for `/onex.doc.deliverables`

```text
Documenta los deliverables funcionales del proyecto a partir de esta página de Confluence:

https://sanes.atlassian.net/wiki/spaces/ESPCHANGE/pages/26269942297/Deliverables+-+Territorio+Capex+2025

Objetivo de esta ejecución:
- Generar trazabilidad de deliverables por release
- Generar una síntesis funcional real del proyecto, no solo un inventario de historias
- Reutilizar el registro de páginas revisadas y no reprocesar fuentes sin cambios salvo que sea necesario

Alcance de esta ejecución:
- Solo documentación funcional de deliverables
- No extraer evidencia técnica de repositorio en esta fase
- Considera tanto el contenido de la página como sus páginas hijas, sus adjuntos y el contexto funcional relacionado en Jira
- Si hay PDFs adjuntos, léelos usando la skill de pdf
- Si la página o sus hijas referencian issues, épicas o releases de Jira, revísalos también para completar la visión funcional global del proyecto
- Si una página o adjunto ya fue revisado y no cambió su versión o fecha de actualización, reutiliza el registro y evita reprocesarlo

Quiero que generes y actualices estos artefactos:
- deliverables-index.md
- functional-documentation.md
- source-review-log.md

Instrucciones de calidad para functional-documentation.md:
- Explica qué hace el proyecto funcionalmente
- Explica qué problema de negocio resuelve
- Identifica capacidades funcionales principales
- Identifica actores o stakeholders implicados
- Describe el flujo funcional end-to-end si se puede inferir
- Agrupa el detalle por release
- Resume reglas de negocio, restricciones y dependencias funcionales
- Marca claramente como inferred cualquier conclusión no explícita en la fuente
- No te limites a listar historias o entregables; necesito narrativa funcional del proyecto

Quiero dos vistas complementarias:
- Vista por release
- Vista por capability o bloque funcional

Si detectas ambigüedades, versiones contradictorias o falta de contexto, déjalo reflejado en:
- deliverables-index.md
- functional-documentation.md
- source-review-log.md

Al terminar, indícame:
- qué fuentes se han procesado
- cuáles se han reutilizado sin reprocesar
- qué releases has identificado
- qué capacidades funcionales has inferido
- qué huecos o dudas siguen abiertos
- qué siguiente paso recomiendas
```

---

## Example for `/onex.doc.publish`

```text
Publica la documentación en Confluence bajo esta página padre:

AQUI_PEGA_LA_URL_DE_LA_PAGINA_PADRE_DESTINO

Instrucciones de publicación:
- Publica el árbol de documentación definido en publication-map.md
- Usa functional-documentation.md como fuente principal de la página de Documentación Global
- Usa deliverables-index.md como soporte de trazabilidad funcional
- Publica también la página de Source review registry
- Añade al final de cada página creada o actualizada el footer estándar `Generated with ONEX` con workflow, branch, revision y fecha
- No inventes una jerarquía distinta a la definida en publication-map.md
- Si falta algún artefacto crítico, avísame antes de publicar externamente

Quiero publicar solo en Confluence.
No necesito export adicional al repositorio.

Al terminar, indícame:
- páginas creadas o actualizadas
- URL final de cada página relevante
- ubicación de la Documentación Global
- ubicación del Source review registry
- warnings o huecos pendientes
```