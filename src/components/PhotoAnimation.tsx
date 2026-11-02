import { useEffect } from 'react';
import { PHOTO_PASS_MS, photoSources, type PhotoVariant } from '../data/animations';
import { prefersReducedMotion } from '../lib/motion';
import './PhotoAnimation.css';

type PhotoAnimationProps = {
  variant: PhotoVariant;
  onDone: () => void;
};

export default function PhotoAnimation({ variant, onDone }: PhotoAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, PHOTO_PASS_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  const reduced = prefersReducedMotion();

  return (
    <div
      className={`photo-animation photo-animation--${variant}${reduced ? ' photo-animation--reduced' : ''}`}
      aria-hidden="true"
    >
      <img className="photo-animation-img" src={photoSources[variant]} alt="" />
    </div>
  );
}
