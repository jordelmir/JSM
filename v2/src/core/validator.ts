
/**
 * @module core/validator
 * @description A utility for data validation.
 */

/**
 * Validates if a string is a valid email address.
 * @param {string} email The email to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^(([^<>()[\\]\\.,;:\\s@\"]+(\\.[^<>()[\\]\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\. [0-9]{1,3}\\. [0-9]{1,3}\\. [0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$ /;
  return emailRegex.test(email);
}

/**
 * Validates if a password meets the minimum security requirements.
 * @param {string} password The password to validate.
 * @returns {boolean} True if the password is valid, false otherwise.
 */
export function isValidPassword(password: string): boolean {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Validates if a value is a non-empty string.
 * @param {string} value The value to validate.
 * @returns {boolean} True if the value is a non-empty string, false otherwise.
 */
export function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}
