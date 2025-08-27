
import { describe, it, expect } from 'vitest';
import * as validator from '../../src/core/validator';

describe('validator', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validator.isValidEmail('test@example.com')).toBe(true);
      expect(validator.isValidEmail('test.name@example.co.uk')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(validator.isValidEmail('test')).toBe(false);
      expect(validator.isValidEmail('test@')).toBe(false);
      expect(validator.isValidEmail('test@example')).toBe(false);
      expect(validator.isValidEmail('test@.com')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should return true for valid passwords', () => {
      expect(validator.isValidPassword('Password123')).toBe(true);
    });

    it('should return false for invalid passwords', () => {
      expect(validator.isValidPassword('password')).toBe(false);
      expect(validator.isValidPassword('PASSWORD')).toBe(false);
      expect(validator.isValidPassword('12345678')).toBe(false);
      expect(validator.isValidPassword('Pass')).toBe(false);
    });
  });

  describe('isNonEmptyString', () => {
    it('should return true for non-empty strings', () => {
      expect(validator.isNonEmptyString('test')).toBe(true);
      expect(validator.isNonEmptyString('  test  ')).toBe(true);
    });

    it('should return false for empty or non-string values', () => {
      expect(validator.isNonEmptyString('')).toBe(false);
      expect(validator.isNonEmptyString('  ')).toBe(false);
      expect(validator.isNonEmptyString(null)).toBe(false);
      expect(validator.isNonEmptyString(undefined)).toBe(false);
      expect(validator.isNonEmptyString(123)).toBe(false);
    });
  });
});
