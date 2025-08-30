# `ui-components`

Este paquete contiene componentes de interfaz de usuario (UI) reutilizables y estilizados con Tailwind CSS, diseñados para ser compartidos entre las diferentes aplicaciones frontend del monorepo JSM.

## Propósito

El objetivo principal de este paquete es:
- **Promover la consistencia visual:** Asegurar que todos los elementos de UI tengan la misma apariencia y comportamiento en todas las aplicaciones.
- **Reducir la duplicación de código:** Evitar que cada aplicación reimplemente los mismos componentes básicos.
- **Mejorar la mantenibilidad:** Centralizar la lógica y el estilo de los componentes en un único lugar.
- **Facilitar el desarrollo:** Proporcionar un conjunto de componentes listos para usar que aceleren la creación de nuevas funcionalidades.

## Uso

Para utilizar los componentes de este paquete en una aplicación frontend (ej. `owner-dashboard`, `admin`):

1.  Asegúrate de que tu `tsconfig.json` extienda `../../tsconfig.base.json` y tenga el `paths` configurado para `@ui-components`.
2.  Importa los componentes directamente desde el paquete:

    ```typescript
    import { Button, Input, Card } from '@ui-components';
    // O si necesitas un componente específico de un archivo:
    // import { Button } from '@ui-components/button'; 
    ```

3.  Utiliza los componentes en tu JSX/TSX:

    ```typescript jsx
    <Button>Haz clic aquí</Button>
    <Input placeholder="Escribe algo..." />
    <Card>
      <p>Contenido de la tarjeta</p>
    </Card>
    ```

## Contribución

Para añadir o modificar componentes en este paquete:

1.  Crea o edita los archivos `.tsx` dentro de `src/components/`.
2.  Exporta los nuevos componentes desde `src/components/index.ts` para que sean accesibles a través del alias `@ui-components`.
3.  Asegúrate de que los componentes sigan las convenciones de estilo y diseño del proyecto.

## Estructura del Paquete

```
packages/ui-components/
├── src/
│   ├── components/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── ...
│   │   └── index.ts  // Archivo de exportación principal
├── project.json      // Configuración de Nx para el paquete
├── package.json
├── tsconfig.json
└── README.md
```
