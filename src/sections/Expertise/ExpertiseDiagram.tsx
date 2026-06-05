import { useRef, type CSSProperties } from 'react';
import { expertise, expertiseNodes } from '../../data/expertise';
import { gsap, media, useGSAP } from '../../motion/gsap';
import { cx } from '../../utils/cx';
import styles from './Expertise.module.scss';

interface ExpertiseDiagramProps {
  activeId: string | null;
  onActivate: (id: string | null) => void;
}

/** Node positions on an ellipse around the centre, as percentages of the diagram. */
const positions = expertiseNodes.map((_, index) => {
  const angle = (-90 + (360 / expertiseNodes.length) * index) * (Math.PI / 180);
  return { x: 50 + 41 * Math.cos(angle), y: 50 + 41 * Math.sin(angle) };
});

/**
 * Decorative map of the core technologies around "Frontend Engineering".
 * Hovering a capability (or a node) lights the technologies that belong to it.
 * The list beside it carries the same information for assistive technology.
 */
export function ExpertiseDiagram({ activeId, onActivate }: ExpertiseDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const active = expertise.find((capability) => capability.id === activeId);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add({ motion: media.motion, pointer: media.pointer }, (context) => {
        const { motion, pointer } = context.conditions as Record<string, boolean>;
        if (!motion) return;

        gsap
          .timeline({ scrollTrigger: { trigger: root, start: 'top 75%', once: true } })
          .from('[data-ring]', { scale: 0.6, opacity: 0, duration: 1.4, ease: 'expo.out', stagger: 0.12 })
          .from('[data-center]', { scale: 0.85, opacity: 0, duration: 1.2, ease: 'expo.out' }, 0.1)
          .from('[data-link]', { strokeDashoffset: 1, duration: 1.1, ease: 'power3.inOut', stagger: 0.05 }, 0.3)
          .from(
            '[data-node]',
            { scale: 0.7, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05, clearProps: 'opacity,transform' },
            0.55,
          );

        // The outer rings turn slowly with scroll, tying the diagram to the reader's progress.
        gsap.to('[data-ring]', {
          rotation: (index: number) => (index % 2 ? -40 : 40),
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });

        if (!pointer) return;

        // Pointer depth: rings drift least, nodes more, the centre label most.
        const layers = (['[data-layer="rings"]', '[data-layer="nodes"]', '[data-layer="center"]'] as const).map(
          (selector, depth) => ({
            x: gsap.quickTo(selector, 'x', { duration: 1.2, ease: 'power3.out' }),
            y: gsap.quickTo(selector, 'y', { duration: 1.2, ease: 'power3.out' }),
            amount: 8 + depth * 8,
          }),
        );
        let bounds: DOMRect | null = null;
        const onMove = (event: PointerEvent) => {
          bounds ??= root.getBoundingClientRect();
          const nx = (event.clientX - bounds.left) / bounds.width - 0.5;
          const ny = (event.clientY - bounds.top) / bounds.height - 0.5;
          layers.forEach(({ x, y, amount }) => {
            x(nx * amount);
            y(ny * amount);
          });
        };
        const onLeave = () => {
          bounds = null;
          layers.forEach(({ x, y }) => {
            x(0);
            y(0);
          });
        };
        const onScroll = () => {
          bounds = null;
        };
        root.addEventListener('pointermove', onMove);
        root.addEventListener('pointerleave', onLeave);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
          root.removeEventListener('pointermove', onMove);
          root.removeEventListener('pointerleave', onLeave);
          window.removeEventListener('scroll', onScroll);
        };
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className={cx(styles.diagram, activeId && styles.diagramFocused)}
      aria-hidden="true"
      onPointerLeave={() => onActivate(null)}
    >
      <div className={styles.layer} data-layer="rings">
        <span className={cx(styles.ring, styles.ringOuter)} data-ring />
        <span className={cx(styles.ring, styles.ringInner)} data-ring />
      </div>

      <div className={styles.layer} data-layer="nodes">
        <svg className={styles.links} viewBox="0 0 100 100">
          {positions.map((point, index) => (
            <line
              key={expertiseNodes[index]?.label}
              x1="50"
              y1="50"
              x2={point.x}
              y2={point.y}
              pathLength={1}
              data-link
              className={cx(
                styles.link,
                expertiseNodes[index]?.capability === activeId && styles.linkLit,
              )}
            />
          ))}
        </svg>

        {expertiseNodes.map((node, index) => (
          <span
            key={node.label}
            data-node
            className={cx(styles.node, node.capability === activeId && styles.nodeLit)}
            style={{ '--x': `${positions[index]?.x}%`, '--y': `${positions[index]?.y}%` } as CSSProperties}
            onPointerEnter={() => onActivate(node.capability)}
          >
            <span className={styles.nodeInner}>
              {node.label}
            </span>
          </span>
        ))}
      </div>

      <div className={styles.layer} data-layer="center">
        <p className={styles.center} data-center>
          <span key={active?.id ?? 'default'} className={styles.centerText}>
            {active ? active.title : 'Frontend Engineering'}
          </span>
        </p>
      </div>
    </div>
  );
}
