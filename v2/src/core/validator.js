// v2/src/core/validator.js

export const isValidEmail = (email) => {
  // Basic email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const isPositiveNumber = (num) => {
  return typeof num === 'number' && num > 0;
};

export const isRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
};