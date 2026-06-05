import type { CSSProperties, ReactNode } from 'react';
import styles from './ProjectVisual.module.scss';

interface ProjectVisualProps {
  projectId: string;
}

const depth = (value: number) => ({ 'data-depth': value });
const bars = (heights: number[], accentIndex: number) =>
  heights.map((height, index) => (
    <span
      key={index}
      className={index === accentIndex ? styles.barAccent : styles.bar}
      style={{ '--h': `${height}%` } as CSSProperties}
    />
  ));

/** Browser-style frame shared by the dashboard compositions. */
function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`${styles.frame} ${className ?? ''}`}>
      <div className={styles.frameBar}>
        <span className={styles.frameDots}>
          <span />
          <span />
          <span />
        </span>
        <span className={styles.frameUrl} />
      </div>
      <div className={styles.frameBody}>{children}</div>
    </div>
  );
}

function Inventory() {
  return (
    <>
      <Frame className={styles.main}>
        <div className={styles.dashboard}>
          <div className={styles.sidebar}>
            <span className={styles.logo} />
            {[70, 55, 62, 48, 58].map((width, index) => (
              <span key={index} className={index === 1 ? styles.navActive : styles.navItem} style={{ width: `${width}%` }} />
            ))}
          </div>
          <div className={styles.panel}>
            <div className={styles.tiles}>
              {[0, 1, 2].map((tile) => (
                <span key={tile} className={styles.tile}>
                  <span className={styles.lineShort} />
                  <span className={tile === 0 ? styles.figureAccent : styles.figure} />
                </span>
              ))}
            </div>
            <div className={styles.chart}>{bars([42, 58, 50, 72, 64, 88, 70, 80], 5)}</div>
            <div className={styles.rows}>
              {[82, 46, 64, 28].map((level, index) => (
                <span key={index} className={styles.row}>
                  <span className={styles.cell} />
                  <span className={styles.meter}>
                    <span style={{ width: `${level}%` }} className={level < 30 ? styles.meterLow : undefined} />
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Frame>
      <div className={`${styles.float} ${styles.floatRight}`} {...depth(2)}>
        <span className={styles.lineShort} />
        <div className={styles.miniChart}>{bars([30, 55, 40, 75, 60], 3)}</div>
      </div>
    </>
  );
}

function Employee() {
  return (
    <>
      <Frame className={styles.main}>
        <div className={styles.toolbar}>
          <span className={styles.search} />
          <span className={styles.chipActive} />
          <span className={styles.chip} />
          <span className={styles.chip} />
        </div>
        <div className={styles.table}>
          {[0, 1, 2, 3, 4].map((row) => (
            <span key={row} className={styles.tableRow}>
              <span className={styles.avatar} />
              <span className={styles.nameBlock}>
                <span className={styles.lineMedium} />
                <span className={styles.lineTiny} />
              </span>
              <span className={row % 2 ? styles.role : styles.roleAccent} />
              <span className={row === 3 ? styles.statusOff : styles.status} />
            </span>
          ))}
        </div>
        <div className={styles.pager}>
          {[0, 1, 2, 3].map((page) => (
            <span key={page} className={page === 0 ? styles.pageActive : styles.page} />
          ))}
        </div>
      </Frame>
      <div className={`${styles.float} ${styles.floatLeft} ${styles.lock}`} {...depth(2)}>
        <span className={styles.lockIcon} />
        <span className={styles.lineMedium} />
        <span className={styles.lineTiny} />
      </div>
    </>
  );
}

function Commerce() {
  return (
    <>
      <Frame className={styles.main}>
        <div className={styles.shop}>
          <div className={styles.products}>
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <span key={item} className={styles.product}>
                <span className={styles.productImage} style={{ '--tone': item } as CSSProperties} />
                <span className={styles.lineMedium} />
                <span className={item === 1 ? styles.priceAccent : styles.price} />
              </span>
            ))}
          </div>
          <div className={styles.cart}>
            <span className={styles.lineShort} />
            {[0, 1, 2].map((line) => (
              <span key={line} className={styles.cartLine}>
                <span className={styles.thumb} />
                <span className={styles.lineMedium} />
              </span>
            ))}
            <span className={styles.total} />
            <span className={styles.checkout} />
          </div>
        </div>
      </Frame>
      <div className={`${styles.float} ${styles.floatRight} ${styles.steps}`} {...depth(2)}>
        {[0, 1, 2, 3].map((step) => (
          <span key={step} className={step < 2 ? styles.stepDone : styles.step} />
        ))}
      </div>
    </>
  );
}

function Saffron() {
  const petals = [0, 60, 120, 180, 240, 300];
  const sensors = [
    { label: 'Mist', x: 16, y: 22 },
    { label: 'Nutrients', x: 80, y: 18 },
    { label: 'Climate', x: 84, y: 76 },
  ];

  return (
    <div className={styles.field}>
      <svg className={styles.fieldLines} viewBox="0 0 100 100" preserveAspectRatio="none" {...depth(1)}>
        {sensors.map((sensor) => (
          <line key={sensor.label} x1="50" y1="50" x2={sensor.x} y2={sensor.y} />
        ))}
      </svg>
      <div className={styles.bloom} {...depth(2)}>
        <span className={styles.bloomRing} />
        <span className={styles.bloomRing} />
        <svg viewBox="-50 -50 100 100" className={styles.flower}>
          {petals.map((angle) => (
            <ellipse key={angle} cx="0" cy="-18" rx="8" ry="18" transform={`rotate(${angle})`} />
          ))}
          <circle r="5" />
        </svg>
      </div>
      {sensors.map((sensor) => (
        <span
          key={sensor.label}
          className={styles.sensor}
          style={{ left: `${sensor.x}%`, top: `${sensor.y}%` }}
          {...depth(3)}
        >
          <span className={styles.sensorDot} />
          {sensor.label}
        </span>
      ))}
      <svg className={styles.wave} viewBox="0 0 200 40" preserveAspectRatio="none" {...depth(1)}>
        <path d="M0 30 C 20 10, 40 34, 60 20 S 100 6, 120 18 S 160 30, 200 8" />
      </svg>
    </div>
  );
}

const visuals: Record<string, () => ReactNode> = {
  inventory: Inventory,
  employee: Employee,
  ecommerce: Commerce,
  saffron: Saffron,
};

/**
 * An abstract composition that suggests what each project does. These are
 * illustrations, not screenshots, and are labelled as such.
 */
export function ProjectVisual({ projectId }: ProjectVisualProps) {
  const Visual = visuals[projectId];

  return (
    <div className={styles.visual} data-visual>
      <div className={styles.stage} data-visual-stage>
        {Visual ? <Visual /> : null}
      </div>
      <span className={styles.note}>Illustrative visual</span>
    </div>
  );
}
