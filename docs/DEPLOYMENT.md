
# Guía de Despliegue - Gasolinera JSM v2 Frontend

Esta guía describe el proceso de despliegue de la aplicación frontend v2 de Gasolinera JSM.

## 1. Visión General del Despliegue

La aplicación frontend v2 es una Single Page Application (SPA) construida con Vite, React y TypeScript. Se despliega como un conjunto de archivos estáticos (HTML, CSS, JavaScript, imágenes) que pueden ser servidos por cualquier servidor web estático o plataforma de hosting de SPAs. El proceso de CI/CD está automatizado mediante GitHub Actions para el despliegue continuo a GitHub Pages.

## 2. Proceso de CI/CD (GitHub Actions)

El despliegue de la aplicación v2 está automatizado a través de un workflow de GitHub Actions configurado en `.github/workflows/ci.yml` dentro del directorio `v2`.

### Disparadores del Workflow

El workflow se ejecuta automáticamente en los siguientes eventos:
- **Push a la rama `main`**: Cada vez que se realiza un push a la rama `main`.
- **Pull Request a la rama `main`**: Cada vez que se abre o se actualiza un Pull Request dirigido a la rama `main`.

### Pasos del Workflow

El workflow `ci.yml` realiza los siguientes pasos:

1.  **Checkout del Código**: Clona el repositorio.
2.  **Configuración de Node.js**: Configura el entorno de Node.js (versión 18).
3.  **Instalación de Dependencias**: Ejecuta `npm install` en el directorio `v2` para instalar todas las dependencias del proyecto.
4.  **Linting**: Ejecuta `npm run lint` para asegurar que el código cumple con los estándares de estilo y calidad.
5.  **Testing**: Ejecuta `npm test` para correr los tests unitarios y de integración. Si los tests fallan, el workflow se detiene.
6.  **Build**: Ejecuta `npm run build` para compilar la aplicación. Esto genera los archivos estáticos optimizados en el directorio `dist/` dentro de `v2`.
7.  **Despliegue a GitHub Pages**: Utiliza la acción `peaceiris/actions-gh-pages@v3` para desplegar el contenido del directorio `v2/dist` a la rama `gh-pages` del repositorio. Esta rama es servida automáticamente por GitHub Pages.

## 3. Despliegue Manual (Opcional)

Si se requiere un despliegue manual a un servidor estático diferente a GitHub Pages, sigue estos pasos:

1.  **Clonar el Repositorio**:
    ```bash
    git clone https://github.com/jordelmir/gasolinera-jsm-ultimate.git
    cd gasolinera-jsm-ultimate/v2
    ```

2.  **Instalar Dependencias**:
    ```bash
    npm install
    ```

3.  **Compilar la Aplicación**:
    ```bash
    npm run build
    ```
    Esto generará los archivos de producción en el directorio `v2/dist`.

4.  **Servir los Archivos Estáticos**: Copia el contenido del directorio `v2/dist` a tu servidor web estático (ej. Nginx, Apache, S3, Netlify, Vercel). Asegúrate de que el servidor esté configurado para servir `index.html` para todas las rutas (fallback para SPAs).

## 4. Configuración de Variables de Entorno

Para la aplicación frontend, las variables de entorno se manejan en tiempo de construcción a través de Vite. Puedes definir variables de entorno en un archivo `.env` en la raíz del directorio `v2` (ej. `VITE_API_URL=http://localhost:8080`). Estas variables se inyectan en el bundle final.

## 5. Consideraciones de Seguridad

- **CSP (Content Security Policy)**: La aplicación está configurada con una CSP estricta para mitigar ataques XSS y de inyección de datos. Asegúrate de que tu servidor web también envíe los encabezados CSP adecuados si no estás usando un hosting que lo maneje automáticamente.
- **Sanitización de HTML**: Se utiliza `dompurify` para sanitizar cualquier HTML generado a partir de entradas de usuario, previniendo ataques de inyección de HTML/XSS.

## 6. Solución de Problemas Comunes

- **Fallo en el Build de GitHub Actions**: Revisa los logs del workflow en GitHub Actions. Los errores comunes incluyen fallos en la instalación de dependencias, errores de linting o fallos en los tests.
- **Aplicación en Blanco después del Despliegue**: Verifica la ruta base de tu aplicación en `vite.config.js` si estás desplegando en un subdirectorio (ej. `base: '/my-repo/'`). Asegúrate de que todos los archivos estáticos se estén sirviendo correctamente.
- **Problemas de PWA**: Asegúrate de que tu servidor web sirva el `manifest.webmanifest` y el service worker (`sw.js`) con los encabezados `Content-Type` correctos.
