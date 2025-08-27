
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          "Gasolinera JSM": "JSM Gas Station",
          "Fuel Selector": "Fuel Selector",
          "Fuel Type": "Fuel Type",
          "Liters": "Liters",
          "Select Fuel": "Select Fuel",
          "Select Payment Method": "Select Payment Method",
          "Pay with Cash": "Pay with Cash",
          "Pay with Card": "Pay with Card",
          "Cancel": "Cancel",
          "Payment successful!": "Payment successful!",
          "Payment failed!": "Payment failed!",
          "Light Mode": "Light Mode",
          "Dark Mode": "Dark Mode",
          "Security - XSS Prevention (DOMPurify):": "Security - XSS Prevention (DOMPurify):",
          "Sanitized Output:": "Sanitized Output:",
          "Purchase History": "Purchase History",
          "No purchases yet.": "No purchases yet.",
          "Amount": "Amount",
          "Date": "Date",
          "API Facade Example:": "API Facade Example:",
          "Get Fuel Prices": "Get Fuel Prices",
          "Fuel prices fetched!": "Fuel prices fetched!",
          "Submit Order": "Submit Order",
          "Order submitted!": "Order submitted!",
        }
      },
      es: {
        translation: {
          "Gasolinera JSM": "Gasolinera JSM",
          "Fuel Selector": "Selector de Combustible",
          "Fuel Type": "Tipo de Combustible",
          "Liters": "Litros",
          "Select Fuel": "Seleccionar Combustible",
          "Select Payment Method": "Seleccionar Método de Pago",
          "Pay with Cash": "Pagar en Efectivo",
          "Pay with Card": "Pagar con Tarjeta",
          "Cancel": "Cancelar",
          "Payment successful!": "¡Pago realizado con éxito!",
          "Payment failed!": "¡El pago falló!",
          "Light Mode": "Modo Claro",
          "Dark Mode": "Modo Oscuro",
          "Security - XSS Prevention (DOMPurify):": "Seguridad - Prevención de XSS (DOMPurify):",
          "Sanitized Output:": "Salida Sanitizada:",
          "Purchase History": "Historial de Compras",
          "No purchases yet.": "Aún no hay compras.",
          "Amount": "Cantidad",
          "Date": "Fecha",
          "API Facade Example:": "Ejemplo de Fachada de API:",
          "Get Fuel Prices": "Obtener Precios de Combustible",
          "Fuel prices fetched!": "¡Precios de combustible obtenidos!",
          "Submit Order": "Enviar Pedido",
          "Order submitted!": "¡Pedido enviado!",
        }
      }
    }
  });

export default i18n;
