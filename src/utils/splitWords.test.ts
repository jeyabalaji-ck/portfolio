import { describe, expect, it } from 'vitest';
import { splitWords, stripAccents } from './splitWords';

describe('splitWords', () => {
  it('splits plain text into single-part words', () => {
    expect(splitWords('Selected  work.')).toEqual([
      [{ text: 'Selected', accent: false }],
      [{ text: 'work.', accent: false }],
    ]);
  });

  it('keeps punctuation attached to accented words', () => {
    expect(splitWords('on *performance*, and')).toEqual([
      [{ text: 'on', accent: false }],
      [
        { text: 'performance', accent: true },
        { text: ',', accent: false },
      ],
      [{ text: 'and', accent: false }],
    ]);
  });

  it('strips accent markers for accessible text', () => {
    expect(stripAccents('Frontend engineer, *production* mindset.')).toBe(
      'Frontend engineer, production mindset.',
    );
  });
});
