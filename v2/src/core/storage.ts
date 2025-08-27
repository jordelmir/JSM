
/**
 * @module core/storage
 * @description A utility for safely interacting with localStorage.
 */

/**
 * Retrieves an item from localStorage.
 * @param {string} key The key of the item to retrieve.
 * @returns {T | null} The retrieved item, or null if not found or on error.
 */
export function get<T>(key: string): T | null {
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.error(`Error getting item from localStorage: ${key}`, error);
    return null;
  }
}

/**
 * Sets an item in localStorage.
 * @param {string} key The key of the item to set.
 * @param {T} value The value to set.
 */
export function set<T>(key:string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item in localStorage: ${key}`, error);
  }
}

/**
 * Removes an item from localStorage.
 * @param {string} key The key of the item to remove.
 */
export function remove(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item from localStorage: ${key}`, error);
  }
}

/**
 * Clears all items from localStorage.
 */
export function clear(): void {
  try {
    window.localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage', error);
  }
}
