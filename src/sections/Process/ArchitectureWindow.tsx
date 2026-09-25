import { buildStages } from '../../data/approach';
import { cx } from '../../utils/cx';
import styles from './ArchitectureWindow.module.scss';

interface Entry {
  name: string;
  depth: 1 | 2;
  folder?: boolean;
  /** Index of the build stage at which this entry appears. */
  stage: number;
}

/**
 * An illustrative frontend project structure - not a real codebase. Entries
 * appear as the reader reaches the stage that introduces them.
 */
const entries: Entry[] = [
  { name: 'components', depth: 1, folder: true, stage: 1 },
  { name: 'Button.tsx', depth: 2, stage: 1 },
  { name: 'DataTable.tsx', depth: 2, stage: 2 },
  { name: 'DataTable.test.tsx', depth: 2, stage: 3 },
  { name: 'hooks', depth: 1, folder: true, stage: 1 },
  { name: 'useDebounce.ts', depth: 2, stage: 3 },
  { name: 'services', depth: 1, folder: true, stage: 0 },
  { name: 'api.ts', depth: 2, stage: 0 },
  { name: 'endpoints.ts', depth: 2, stage: 0 },
  { name: 'store', depth: 1, folder: true, stage: 1 },
  { name: 'store.ts', depth: 2, stage: 1 },
  { name: 'apiSlice.ts', depth: 2, stage: 1 },
  { name: 'pages', depth: 1, folder: true, stage: 2 },
  { name: 'Dashboard.tsx', depth: 2, stage: 2 },
  { name: 'Settings.tsx', depth: 2, stage: 2 },
  { name: 'utils', depth: 1, folder: true, stage: 3 },
  { name: 'format.ts', depth: 2, stage: 2 },
  { name: 'lazyLoad.ts', depth: 2, stage: 3 },
];

/** Box-drawing prefixes (├── └── │) for each entry, like the output of `tree`. */
const prefixes = entries.map((entry, index) => {
  const isLastSibling = (at: number, depth: number) => {
    for (let next = at + 1; next < entries.length; next += 1) {
      const other = entries[next];
      if (!other || other.depth < depth) return true;
      if (other.depth === depth) return false;
    }
    return true;
  };

  const branch = isLastSibling(index, entry.depth) ? '└── ' : '├── ';
  if (entry.depth === 1) return branch;

  let parent = index - 1;
  while (parent >= 0 && entries[parent]?.depth !== 1) parent -= 1;
  return `${isLastSibling(parent, 1) ? '    ' : '│   '}${branch}`;
});

const pad = (value: number) => String(value).padStart(2, '0');

export function ArchitectureWindow({ active }: { active: number }) {
  const stage = buildStages[active] ?? buildStages[0];
  const folders = entries.filter((entry) => entry.folder && entry.stage === active).map((entry) => `${entry.name}/`);

  const notes = stage
    ? [
        { kind: 'comment', text: `// ${pad(active + 1)} / ${stage.title.toUpperCase()}` },
        { kind: 'comment', text: '// Illustrative notes - not production code.' },
        { kind: 'blank', text: '' },
        ...stage.concepts.map((concept) => ({ kind: 'item', text: concept })),
        { kind: 'blank', text: '' },
        { kind: 'path', text: folders.length ? folders.join('  ') : 'src/' },
      ]
    : [];

  return (
    <figure className={styles.window} aria-hidden="true">
      <div className={styles.titlebar}>
        <span className={styles.dots}>
          <span />
          <span />
          <span />
        </span>
        <span className={styles.filename}>frontend-architecture</span>
        <span className={styles.badge}>Illustrative</span>
      </div>

      <div className={styles.body}>
        <div className={styles.explorer}>
          <p className={styles.explorerTitle}>Explorer</p>
          <ul className={styles.tree}>
            <li className={cx(styles.entry, styles.folder, styles.visible)}>src/</li>
            {entries.map((entry, index) => (
              <li
                key={entry.name}
                className={cx(
                  styles.entry,
                  entry.folder && styles.folder,
                  entry.stage <= active && styles.visible,
                  entry.stage === active && styles.current,
                )}
              >
                <span className={styles.prefix}>{prefixes[index]}</span>
                {entry.folder ? `${entry.name}/` : entry.name}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.editor}>
          <p className={styles.tab}>{stage ? `${stage.id}.md` : 'notes.md'}</p>
          <ol key={active} className={styles.code}>
            {notes.map((line, index) => (
              <li key={index} className={cx(styles.line, styles[line.kind])}>
                <span className={styles.gutter}>{index + 1}</span>
                <span className={styles.text}>{line.kind === 'item' ? `- ${line.text}` : line.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className={styles.status}>
        <span>
          <span className={styles.statusDot} /> stage {pad(active + 1)}/{pad(buildStages.length)} · {stage?.title.toLowerCase()}
        </span>
        <span>TypeScript · React</span>
      </div>
    </figure>
  );
}
