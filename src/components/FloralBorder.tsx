import type { CSSProperties, ReactElement } from 'react';
import { WILDFLOWER } from '../data/palette';
import './FloralBorder.css';

const Poppy = () => (
  <>
    {[0, 72, 144, 216, 288].map((angle) => (
      <ellipse
        key={angle}
        cx="20"
        cy="11"
        rx="8"
        ry="10"
        transform={`rotate(${angle} 20 20)`}
        style={{ fill: WILDFLOWER.poppy }}
      />
    ))}
    <circle cx="20" cy="20" r="4" style={{ fill: 'var(--text-main)' }} />
  </>
);

const Daisy = () => (
  <>
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <ellipse
        key={angle}
        cx="20"
        cy="10"
        rx="4.5"
        ry="9"
        transform={`rotate(${angle} 20 20)`}
        style={{ fill: WILDFLOWER.daisy, stroke: 'var(--color-sage)', strokeWidth: 0.6 }}
      />
    ))}
    <circle cx="20" cy="20" r="4" style={{ fill: WILDFLOWER.ragwort }} />
  </>
);

const Cornflower = () => (
  <>
    {[0, 60, 120, 180, 240, 300].map((angle) => (
      <circle
        key={angle}
        cx="20"
        cy="11"
        r="6"
        transform={`rotate(${angle} 20 20)`}
        style={{ fill: WILDFLOWER.cornflower }}
      />
    ))}
    <circle cx="20" cy="20" r="3" style={{ fill: WILDFLOWER.daisy }} />
  </>
);

const Ragwort = () => (
  <>
    {[
      [14, 14],
      [22, 11],
      [28, 18],
      [18, 21],
      [11, 23],
      [24, 27],
      [16, 30],
    ].map(([x, y]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" style={{ fill: WILDFLOWER.ragwort }} />
    ))}
  </>
);

const Loosestrife = () => (
  <>
    {[6, 10, 14, 18, 22, 26, 30].map((y, index) => (
      <circle
        key={y}
        cx={index % 2 === 0 ? 17 : 23}
        cy={y}
        r="3"
        style={{ fill: WILDFLOWER.loosestrife }}
      />
    ))}
  </>
);

const Clover = () => (
  <>
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <ellipse
        key={angle}
        cx="20"
        cy="11"
        rx="4"
        ry="5"
        transform={`rotate(${angle} 20 20)`}
        style={{ fill: WILDFLOWER.clover }}
      />
    ))}
  </>
);

const Leaf = () => (
  <>
    <path d="M20 38 C8 26 10 12 20 3 C30 12 32 26 20 38 Z" style={{ fill: 'var(--color-sage)' }} />
    <path
      d="M20 36 L20 8"
      style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 1, opacity: 0.4 }}
    />
  </>
);

const MOTIFS = {
  poppy: Poppy,
  daisy: Daisy,
  cornflower: Cornflower,
  ragwort: Ragwort,
  loosestrife: Loosestrife,
  clover: Clover,
  leaf: Leaf,
} satisfies Record<string, () => ReactElement>;

type MotifName = keyof typeof MOTIFS;

type Placement = {
  motif: MotifName;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: number;
  rotate?: number;
  desktopOnly?: boolean;
};

const PLACEMENTS: Placement[] = [
  { motif: 'poppy', top: '-1%', left: '-1%', size: 110 },
  { motif: 'daisy', top: '4%', left: '6%', size: 64, desktopOnly: true },
  { motif: 'leaf', top: '-2%', left: '12%', size: 70, rotate: 35, desktopOnly: true },
  { motif: 'clover', top: '12%', left: '0%', size: 56, desktopOnly: true },
  { motif: 'ragwort', top: '13%', left: '6%', size: 44, desktopOnly: true },
  { motif: 'cornflower', top: '2%', left: '19%', size: 46, desktopOnly: true },
  { motif: 'cornflower', top: '-1%', right: '-1%', size: 110 },
  { motif: 'daisy', top: '4%', right: '6%', size: 64, desktopOnly: true },
  { motif: 'leaf', top: '-2%', right: '12%', size: 70, rotate: -35, desktopOnly: true },
  { motif: 'loosestrife', top: '12%', right: '0%', size: 60, desktopOnly: true },
  { motif: 'ragwort', top: '13%', right: '7%', size: 44, desktopOnly: true },
  { motif: 'clover', top: '2%', right: '19%', size: 42, desktopOnly: true },
  { motif: 'poppy', bottom: '-1%', left: '-1%', size: 120 },
  { motif: 'leaf', bottom: '-2%', left: '12%', size: 72, rotate: 150, desktopOnly: true },
  { motif: 'daisy', bottom: '5%', left: '5%', size: 60, desktopOnly: true },
  { motif: 'ragwort', bottom: '12%', left: '0%', size: 44, desktopOnly: true },
  { motif: 'cornflower', bottom: '-1%', right: '-1%', size: 120 },
  { motif: 'leaf', bottom: '-2%', right: '12%', size: 72, rotate: -150, desktopOnly: true },
  { motif: 'daisy', bottom: '5%', right: '5%', size: 60, desktopOnly: true },
  { motif: 'poppy', bottom: '12%', right: '0%', size: 44, desktopOnly: true },
  { motif: 'leaf', top: '35%', left: '-0.5%', size: 60, rotate: 80, desktopOnly: true },
  { motif: 'loosestrife', top: '60%', left: '0.5%', size: 50, desktopOnly: true },
  { motif: 'leaf', top: '40%', right: '-0.5%', size: 60, rotate: -80, desktopOnly: true },
  { motif: 'clover', top: '62%', right: '1%', size: 48, desktopOnly: true },
];

export default function FloralBorder() {
  return (
    <div className="floral-border" aria-hidden="true">
      {PLACEMENTS.map((placement, index) => {
        const Motif = MOTIFS[placement.motif];
        const style = {
          top: placement.top,
          bottom: placement.bottom,
          left: placement.left,
          right: placement.right,
          '--size': `${placement.size}px`,
          transform: `rotate(${placement.rotate ?? 0}deg)`,
        } as CSSProperties;
        return (
          <svg
            key={index}
            className={`floral-motif${placement.desktopOnly ? ' floral-motif--desktop' : ''}`}
            viewBox="0 0 40 40"
            style={style}
          >
            <Motif />
          </svg>
        );
      })}
    </div>
  );
}
