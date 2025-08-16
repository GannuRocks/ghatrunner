import { describe, it, expect } from 'vitest';
import { TREKS } from '../lib/data.js';

describe('TREKS dataset', () => {
  it('has at least 6 treks', () => {
    expect(Array.isArray(TREKS)).toBe(true);
    expect(TREKS.length).toBeGreaterThanOrEqual(6);
  });

  it('each trek has required fields and valid price', () => {
    const required = ["slug","name","location","difficulty","duration","heightM","pricePerPerson","images","upcomingDates"];
    for (const t of TREKS) {
      for (const k of required) {
        expect(t).toHaveProperty(k);
      }
      expect(typeof t.pricePerPerson).toBe('number');
      expect(t.pricePerPerson).toBeGreaterThan(0);
      expect(Array.isArray(t.images) && t.images.length > 0).toBe(true);
    }
  });
});
