project: "JSM"
mode: "review-and-improve"
scope: "all-code"
compile: false
install: false
agents:
  - id: 1
    role: "Arquitecto de Software"
    task: >
      Revisar toda la arquitectura, dependencias y organización del repo JSM.
      Identificar problemas de escalabilidad, modularidad, patrones de diseño,
      y proponer una estructura más sólida y limpia.

  - id: 2
    role: "Experto en Seguridad y Buenas Prácticas"
    task: >
      Analizar el código en busca de vulnerabilidades de seguridad, 
      malas prácticas de autenticación/autorización, manejo de datos sensibles,
      inyección de dependencias y posibles exploits. 
      Proponer mejoras de seguridad y cumplimiento (OWASP, Clean Code, etc).

  - id: 3
    role: "Optimizador de Código y Performance"
    task: >
      Detectar código duplicado, lento o innecesario. Revisar consultas a DB,
      uso de memoria, tiempos de respuesta y loops ineficientes. 
      Proponer refactors y optimizaciones que reduzcan la complejidad y aumenten el rendimiento.

  - id: 4
    role: "Especialista en Experiencia de Desarrollo y Mantenibilidad"
    task: >
      Analizar la claridad del código, consistencia de estilo, uso de tipado (TS/Kotlin/etc),
      documentación, tests unitarios y e2e. 
      Proponer cómo mejorar la mantenibilidad, escalabilidad y experiencia de equipo en el repo.

  - id: 5
    role: "Coordinador de Estrategia"
    task: >
      Recibir los análisis de los agentes 1-4, resumirlos, 
      priorizar las mejoras más críticas y valiosas para el proyecto JSM, 
      y convertirlas en un plan de acción ordenado y ejecutable.

  - id: 6
    role: "Ejecutor Profesional"
    task: >
      Tomar el plan del agente 5 y aplicarlo en el código de manera clara, 
      segura y progresiva. Hacer commits bien documentados, 
      refactors elegantes y cambios consistentes en todo el repo.
      No instalar ni compilar nada, solo revisar, modificar y dejar el código listo.

process:
  - step: "Escanear todo el código fuente"
  - step: "Dividir el análisis en módulos para no colgarse"
  - step: "Pasar cada módulo por agentes 1-4 en paralelo"
  - step: "Consolidar hallazgos con el agente 5"
  - step: "Aplicar mejoras con el agente 6"
  - step: "Revisar consistencia final"
rules:
  - "No instalar dependencias"
  - "No compilar código"
  - "No borrar funcionalidades sin justificación"
  - "Todas las mejoras deben estar justificadas y documentadas"
  - "El proceso debe continuar automáticamente hasta terminar el repo completo"