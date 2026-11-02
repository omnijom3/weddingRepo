import { useEffect, useState } from 'react';
import './CinematicIntro.css';

const LINE_MS = 2200;
const FADE_OUT_MS = 1200;

type CinematicIntroProps = {
  lines: readonly string[];
  onDone: () => void;
};

export default function CinematicIntro({ lines, onDone }: CinematicIntroProps) {
  const [index, setIndex] = useState(0);
  const finished = index >= lines.length;

  useEffect(() => {
    if (finished) return;
    const timer = setTimeout(() => setIndex((current) => current + 1), LINE_MS);
    return () => clearTimeout(timer);
  }, [index, finished]);

  useEffect(() => {
    if (!finished) return;
    const timer = setTimeout(onDone, FADE_OUT_MS);
    return () => clearTimeout(timer);
  }, [finished, onDone]);

  return (
    <section
      className={finished ? 'cinematic-intro cinematic-intro--fading' : 'cinematic-intro'}
      aria-label="Invitation introduction"
    >
      {!finished && (
        <p key={index} className="cinematic-intro-line" aria-live="polite">
          {lines[index]}
        </p>
      )}
      <button type="button" className="cinematic-intro-skip" onClick={onDone}>
        Skip intro
      </button>
    </section>
  );
}
