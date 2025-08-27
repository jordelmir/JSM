// v2/src/core/storage.js

export const set = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error setting item to localStorage", e);
  }
};

export const get = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error("Error getting item from localStorage", e);
    return null;
  }
};

export const remove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error("Error removing item from localStorage", e);
  }
};