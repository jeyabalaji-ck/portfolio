import styles from './CodeWindow.module.scss';

type TokenKind = 'keyword' | 'name' | 'property' | 'string' | 'punct' | 'comment' | 'type';
type Token = readonly [TokenKind, string];
type Line = readonly Token[];

const str = (value: string): Token => ['string', `'${value}'`];
const list = (values: string[]): Token[] =>
  values.flatMap((value, index) =>
    index === 0 ? [str(value)] : [['punct', ', '] as const, str(value)],
  );

const lines: Line[] = [
  [
    ['keyword', 'export const '],
    ['name', 'engineer'],
    ['punct', ' = {'],
  ],
  [['property', '  name'], ['punct', ': '], str('Jeya Balaji C K'), ['punct', ',']],
  [['property', '  role'], ['punct', ': '], str('Software Engineer - UI'), ['punct', ',']],
  [['property', '  company'], ['punct', ': '], str('CodeMagen Technologies'), ['punct', ',']],
  [
    ['property', '  stack'],
    ['punct', ': ['],
    ...list(['React', 'TypeScript', 'Redux Toolkit']),
    ['punct', '],'],
  ],
  [
    ['property', '  data'],
    ['punct', ': ['],
    ...list(['RTK Query', 'REST APIs']),
    ['punct', '],'],
  ],
  [
    ['property', '  focus'],
    ['punct', ': ['],
    ...list(['Microfrontends', 'Performance']),
    ['punct', '],'],
  ],
  [['property', '  testing'], ['punct', ': '], str('Jest'), ['punct', ',']],
  [
    ['punct', '} '],
    ['keyword', 'satisfies '],
    ['type', 'Engineer'],
    ['punct', ';'],
  ],
];

/** Decorative editor window; the same facts are presented in the hero copy. */
export function CodeWindow() {
  return (
    <figure className={styles.window} aria-hidden="true">
      <div className={styles.titlebar}>
        <span className={styles.dots}>
          <span />
          <span />
          <span />
        </span>
        <span className={styles.filename}>engineer.ts</span>
      </div>
      <pre className={styles.code}>
        <code>
          {lines.map((line, lineIndex) => (
            <span className={styles.line} key={lineIndex}>
              <span className={styles.gutter}>{lineIndex + 1}</span>
              <span>
                {line.map(([kind, text], tokenIndex) => (
                  <span key={tokenIndex} className={styles[kind]}>
                    {text}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
