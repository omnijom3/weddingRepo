import { useState } from 'react';

const WILDFLOWER_COLOURS = [
  '#d94f3d', // poppy
  '#5b7fd1', // cornflower
  '#e8c547', // ragwort
  '#8e5fa8', // purple loosestrife
  '#d98aa7', // red clover
  '#f6f3ea', // oxeye daisy
];

type Petal = {
  id: number;
  colour: string;
  shape: 'round' | 'long' | 'leaf';
  left: number;
  delay: number;
  duration: number;
  sway: number;
  spin: number;
  size: number;
};

function createPetals(count: number): Petal[] {
  const shapes: Petal['shape'][] = ['round', 'long', 'leaf'];
  return Array.from({ length: count }, (_, id) => ({
    id,
    colour: WILDFLOWER_COLOURS[Math.floor(Math.random() * WILDFLOWER_COLOURS.length)],
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 4 + Math.random() * 2.5,
    sway: (Math.random() - 0.5) * 120,
    spin: (Math.random() < 0.5 ? -1 : 1) * (180 + Math.random() * 360),
    size: 14 + Math.random() * 14,
  }));
}

function PetalSvg({ shape, colour }: { shape: Petal['shape']; colour: string }) {
  const paths = {
    round: 'M12 2 C18 6 20 12 12 22 C4 12 6 6 12 2 Z',
    long: 'M12 1 C15 8 15 16 12 23 C9 16 9 8 12 1 Z',
    leaf: 'M3 12 C8 4 16 4 21 12 C16 20 8 20 3 12 Z',
  };
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path d={paths[shape]} fill={colour} />
    </svg>
  );
}

export default function PetalShower({ count = 50 }: { count?: number }) {
  const [petals] = useState(() => createPetals(count));

  return (
    <div className="petal-shower" aria-hidden="true">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="petal"
          style={{
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
            ['--sway' as string]: `${petal.sway}px`,
            ['--spin' as string]: `${petal.spin}deg`,
          }}
        >
          <PetalSvg shape={petal.shape} colour={petal.colour} />
        </span>
      ))}
    </div>
  );
}
