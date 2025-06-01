import { DecimalMoneyTransformer } from './decimal.money.transformer';

describe('DecimalMoneyTransformer', () => {
  let transformer: DecimalMoneyTransformer;

  beforeEach(() => {
    transformer = new DecimalMoneyTransformer();
  });

  describe('toCents', () => {
    it('should convert 1.00 BRL to 100 cents', () => {
      expect(transformer.toCents(1.0)).toBe(100);
    });

    it('should convert 0.99 BRL to 99 cents', () => {
      expect(transformer.toCents(0.99)).toBe(99);
    });

    it('should convert 0.1 + 0.2 BRL to 30 cents (avoiding float precision issues)', () => {
      const result = transformer.toCents(0.1 + 0.2);
      expect(result).toBe(30);
    });

    it('should round 1.0051 BRL to 101 cents (half-even rounding)', () => {
      expect(transformer.toCents(1.0051)).toBe(101);
    });
  });

  describe('fromCents', () => {
    it('should convert 100 cents to 1.00 BRL', () => {
      expect(transformer.fromCents(100)).toBe(1.0);
    });

    it('should convert 99 cents to 0.99 BRL', () => {
      expect(transformer.fromCents(99)).toBe(0.99);
    });

    it('should convert 305 cents to 3.05 BRL', () => {
      expect(transformer.fromCents(305)).toBe(3.05);
    });

    it('should keep two decimal places after division', () => {
      const result = transformer.fromCents(101);
      expect(result).toBe(1.01);
    });
  });
});
