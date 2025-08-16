import { describe, it, expect } from 'vitest';
import { upiUri, makeRefId } from '../lib/utils.js';

describe('upiUri', () => {
  it('builds a valid upi://pay link', () => {
    const uri = upiUri({ pa: 'test@upi', pn: 'Name', amount: 1234, note: 'Booking' });
    expect(uri.startsWith('upi://pay?')).toBe(true);
    expect(uri).toContain('pa=test%40upi');
    expect(uri).toContain('pn=Name');
    expect(uri).toContain('am=1234');
    expect(uri).toContain('tn=Booking');
    expect(uri).toContain('cu=INR');
  });

  it('handles missing amount/note', () => {
    const uri = upiUri({ pa: 'x@y', pn: 'N' });
    expect(uri).toContain('am=0');
    expect(uri).toContain('tn=Booking');
  });
});

describe('makeRefId', () => {
  it('produces format GR-YYYYMMDD-SLUG-XXXXX', () => {
    const ref = makeRefId('kalsubai', '22 Aug 2025');
    expect(/^GR-20250822-KALSUBAI-[A-Z0-9]{6,}$/.test(ref)).toBe(true);
  });
});
