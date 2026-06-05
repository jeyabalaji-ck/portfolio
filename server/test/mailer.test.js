import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import nodemailer from 'nodemailer';
import { createMailer } from '../src/mailer.js';

const data = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: '',
  topic: 'Freelance project',
  message: 'I have a dashboard that needs a React rebuild.',
};

function setup({ autoReply }) {
  const transport = nodemailer.createTransport({ jsonTransport: true });
  const sent = [];
  const sendMail = transport.sendMail.bind(transport);
  transport.sendMail = async (options) => {
    const info = await sendMail(options);
    sent.push(JSON.parse(info.message));
    return info;
  };
  const config = {
    mail: { to: 'owner@example.com', from: { name: 'Portfolio Contact', address: 'bot@example.com' }, autoReply },
    owner: { name: 'Jeya Balaji C K', siteUrl: 'https://portfolio.test' },
  };
  return { mailer: createMailer(config, { transport }), sent };
}

describe('createMailer', () => {
  it('sends the owner a notification that replies to the visitor', async () => {
    const { mailer, sent } = setup({ autoReply: false });
    const confirmationSent = await mailer.sendContact(data, { receivedAt: new Date(), origin: 'https://portfolio.test' });

    assert.equal(confirmationSent, false);
    assert.equal(sent.length, 1);
    assert.deepEqual(sent[0].to, [{ address: 'owner@example.com', name: '' }]);
    assert.deepEqual(sent[0].replyTo, [{ address: 'ada@example.com', name: 'Ada Lovelace' }]);
    assert.match(sent[0].subject, /Freelance project/);
  });

  it('also sends the visitor a confirmation when auto-reply is on', async () => {
    const { mailer, sent } = setup({ autoReply: true });
    const confirmationSent = await mailer.sendContact(data, {});

    assert.equal(confirmationSent, true);
    assert.equal(sent.length, 2);
    assert.deepEqual(sent[1].to, [{ address: 'ada@example.com', name: 'Ada Lovelace' }]);
    assert.equal(sent[1].subject, 'Thanks for getting in touch, Ada');
    assert.ok(!sent[1].text.includes(data.message), 'auto-reply must not echo the message');
  });
});

describe('createMailer confirmation failures', () => {
  it('still succeeds, reporting no confirmation, when only the visitor email fails', async () => {
    let calls = 0;
    const transport = {
      async sendMail() {
        calls += 1;
        if (calls === 2) throw new Error('mailbox unavailable');
      },
    };
    const config = {
      mail: { to: 'owner@example.com', from: { name: 'P', address: 'bot@example.com' }, autoReply: true },
      owner: { name: 'Owner', siteUrl: '' },
    };
    const mailer = createMailer(config, { transport, logger: { warn() {} } });

    assert.equal(await mailer.sendContact(data, {}), false);
    assert.equal(calls, 2);
  });
});
