import { useState } from 'react';
import { WILDFLOWER_COLOURS } from '../data/palette';

export type Origin = { x: number; y: number };

type Shape = 'round' | 'long' | 'leaf' | 'dot';

type Petal = {
  id: number;
  colour: string;
  shape: Shape;
  size: number;
  delay: number;
  burstX: number;
  burstY: number;
  sway: number;
  spin: number;
  fallDuration: number;
};

const BURST_DURATION_S = 1.2;
const FLAP_DELAY_S = 0.3;
const SHAPES: Shape[] = ['round', 'long', 'leaf', 'dot'];

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

function createPetals(count: number): Petal[] {
  return Array.from({ length: count }, (_, id) => {
    const shape = pick(SHAPES);
    const angle = randomBetween(-165, -15) * (Math.PI / 180);
    const distance = randomBetween(120, 320);
    return {
      id,
      colour: pick(WILDFLOWER_COLOURS),
      shape,
      size: shape === 'dot' ? randomBetween(7, 11) : randomBetween(14, 26),
      delay: FLAP_DELAY_S + Math.random() * 0.15,
      burstX: Math.cos(angle) * distance,
      burstY: Math.sin(angle) * distance,
      sway: (Math.random() - 0.5) * 120,
      spin: (Math.random() < 0.5 ? -1 : 1) * randomBetween(180, 540),
      fallDuration: randomBetween(4, 6.5),
    };
  });
}

function PetalSvg({ shape, colour }: { shape: Shape; colour: string }) {
  if (shape === 'dot') {
    return (
      <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill={colour} />
      </svg>
    );
  }
  const paths: Record<Exclude<Shape, 'dot'>, string> = {
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

export default function PetalShower({ count = 50, origin }: { count?: number; origin: Origin }) {
  const [petals] = useState(() => createPetals(count));

  return (
    <div className="petal-shower" aria-hidden="true">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="petal"
          style={{
            left: origin.x,
            top: origin.y,
            animationDelay: `${petal.delay}s`,
            ['--bx' as string]: `${petal.burstX}px`,
            ['--by' as string]: `${petal.burstY}px`,
            ['--sway' as string]: `${petal.sway}px`,
            ['--spin' as string]: `${petal.spin}deg`,
            ['--fall' as string]: `calc(105vh - (${origin.y + petal.burstY}px))`,
          }}
        >
          <span
            className="petal-body"
            style={{
              width: petal.size,
              height: petal.size,
              marginLeft: -petal.size / 2,
              marginTop: -petal.size / 2,
              animationDelay: `${petal.delay + BURST_DURATION_S}s`,
              animationDuration: `${petal.fallDuration}s`,
            }}
          >
            <PetalSvg shape={petal.shape} colour={petal.colour} />
          </span>
        </span>
      ))}
    </div>
  );
}
