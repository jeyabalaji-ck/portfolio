import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { escapeHtml, renderNotification } from '../src/templates.js';
import { validateContact } from '../src/validation.js';

describe('validateContact', () => {
  it('trims fields, strips header-injection characters and defaults the topic', () => {
    const result = validateContact({
      name: '  Grace\r\nBcc: victim@example.com ',
      email: ' GRACE@EXAMPLE.COM ',
      message: 'Hello there,\r\n\r\n\r\n\r\nI have a project in mind for you.',
    });
    assert.equal(result.ok, true);
    assert.equal(result.data.name, 'Grace Bcc: victim@example.com');
    assert.equal(result.data.email, 'grace@example.com');
    assert.equal(result.data.topic, 'General enquiry');
    assert.equal(result.data.message, 'Hello there,\n\nI have a project in mind for you.');
    assert.equal(result.isSpam, false);
  });

  it('rejects non-object bodies', () => {
    const result = validateContact(null);
    assert.equal(result.ok, false);
    assert.ok(result.errors.name && result.errors.email && result.errors.message);
  });

  it('enforces the message length limits', () => {
    const base = { name: 'Grace', email: 'grace@example.com' };
    assert.equal(validateContact({ ...base, message: 'x'.repeat(19) }).ok, false);
    assert.equal(validateContact({ ...base, message: 'x'.repeat(5001) }).ok, false);
    assert.equal(validateContact({ ...base, message: 'x'.repeat(20) }).ok, true);
  });
});

describe('templates', () => {
  it('escapes visitor input in the HTML email', () => {
    const { html, subject } = renderNotification({
      name: '<script>alert(1)</script>',
      email: 'x@example.com',
      company: '',
      topic: 'Job opportunity',
      message: '<img src=x onerror=alert(1)>',
    });
    assert.ok(!html.includes('<script>alert(1)</script>'));
    assert.ok(!html.includes('<img src=x'));
    assert.ok(html.includes(escapeHtml('<img src=x onerror=alert(1)>')));
    assert.match(subject, /^New enquiry: Job opportunity/);
  });
});
