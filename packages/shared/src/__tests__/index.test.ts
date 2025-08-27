import { formatDate, CouponStatus, StationStatus } from '../index';

describe('Shared Utilities', () => {
  it('formatDate should format a Date object correctly', () => {
    const date = new Date('2025-01-01T10:00:00Z');
    expect(formatDate(date)).toBe('2025-01-01');
  });

  it('formatDate should format a timestamp correctly', () => {
    const timestamp = new Date('2024-12-31T23:59:59Z').getTime();
    expect(formatDate(timestamp)).toBe('2024-12-31');
  });
});

describe('Enums', () => {
  it('CouponStatus enum should have correct values', () => {
    expect(CouponStatus.GENERATED).toBe('GENERATED');
    expect(CouponStatus.SCANNED).toBe('SCANNED');
    expect(CouponStatus.ACTIVATED).toBe('ACTIVATED');
    expect(CouponStatus.COMPLETED).toBe('COMPLETED');
    expect(CouponStatus.EXPIRED).toBe('EXPIRED');
    expect(CouponStatus.USED_IN_RAFFLE).toBe('USED_IN_RAFFLE');
  });

  it('StationStatus enum should have correct values', () => {
    expect(StationStatus.ACTIVA).toBe('ACTIVA');
    expect(StationStatus.INACTIVA).toBe('INACTIVA');
    expect(StationStatus.MANTENIMIENTO).toBe('MANTENIMIENTO');
  });
});
