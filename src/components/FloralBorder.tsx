import type { CSSProperties } from 'react';
import floralBorderUrl from '../assets/floral-border.png';
import './FloralBorder.css';

const frameStyle = { '--frame': `url(${floralBorderUrl})` } as CSSProperties;

export default function FloralBorder() {
  return <div className="floral-border" style={frameStyle} aria-hidden="true" />;
}
