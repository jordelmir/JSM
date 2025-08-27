
# Documentación de la API - Gasolinera JSM v2 Frontend

Esta documentación describe los endpoints de la API utilizados por la aplicación frontend v2 de Gasolinera JSM a través del patrón Facade (`src/services/apiFacade.ts`). La aplicación interactúa con los microservicios backend para obtener datos y realizar operaciones.

## Endpoints Principales

### 1. Obtener Precios de Combustible

- **Descripción**: Recupera los precios actuales de los diferentes tipos de combustible.
- **Endpoint Facade**: `apiFacade.getFuelPrices()`
- **Método HTTP (Backend)**: `GET`
- **Ruta (Backend)**: `/api/fuel/prices` (ejemplo, la ruta real puede variar según la configuración del API Gateway)
- **Parámetros de Solicitud**: Ninguno
- **Respuesta Exitosa (200 OK)**:
  ```json
  [
    { "type": "95", "price": 1.50 },
    { "type": "98", "price": 1.65 },
    { "type": "diesel", "price": 1.40 }
  ]
  ```
- **Posibles Errores**: Errores de red, errores del servidor (ej. 500 Internal Server Error).

### 2. Enviar Pedido de Combustible

- **Descripción**: Envía una solicitud para un pedido de combustible, especificando el tipo de combustible y la cantidad en litros.
- **Endpoint Facade**: `apiFacade.submitOrder(fuelType: string, liters: number)`
- **Método HTTP (Backend)**: `POST`
- **Ruta (Backend)**: `/api/fuel/order` (ejemplo, la ruta real puede variar según la configuración del API Gateway)
- **Parámetros de Solicitud (Body)**:
  ```json
  {
    "fuelType": "95",
    "liters": 20
  }
  ```
- **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Order submitted successfully!"
  }
  ```
- **Posibles Errores**: Errores de validación (ej. 400 Bad Request), errores de negocio (ej. 400 Insufficient Stock), errores del servidor.

## Consideraciones

- **API Gateway**: Todas las solicitudes del frontend pasan a través de un API Gateway que maneja la autenticación, autorización, enrutamiento y otras políticas de seguridad.
- **Manejo de Errores**: La `apiFacade` encapsula el manejo básico de errores, pero los componentes deben estar preparados para manejar los estados de carga y error de las llamadas a la API.
- **Seguridad**: Las credenciales de usuario y tokens de sesión son manejados por el API Gateway y el servicio de autenticación backend, no directamente por el frontend en estas llamadas.
