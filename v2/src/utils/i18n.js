const translations = {
  es: { total: "Total", pay: "Pagar", liters: "Litros" },
  en: { total: "Total", pay: "Pay", liters: "Liters" },
};

export const t = (key) => {
  return translations[navigator.language.split("-")[0]]?.[key] || key;
};