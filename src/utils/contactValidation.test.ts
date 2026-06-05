import { describe, expect, it } from 'vitest';
import { validateContact } from './contactValidation';

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: '',
  topic: '',
  message: 'I would like to talk about a frontend role.',
};

describe('validateContact', () => {
  it('accepts a complete enquiry', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('ignores surrounding whitespace when checking lengths', () => {
    expect(validateContact({ ...valid, name: '  A  ' }).name).toBeDefined();
    expect(validateContact({ ...valid, message: `   ${'x'.repeat(19)}   ` }).message).toBeDefined();
  });

  it.each(['plainaddress', 'a@b', 'a b@example.com', 'a@example.c'])('rejects the email %s', (email) => {
    expect(validateContact({ ...valid, email }).email).toMatch(/valid email/);
  });

  it('caps the message length', () => {
    expect(validateContact({ ...valid, message: 'x'.repeat(5001) }).message).toMatch(/5000/);
  });
});
