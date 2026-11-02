import { useEffect, useState, type ReactNode } from 'react';

const HINT_DELAY_MS = 25_000;

type EnvelopeProps = {
  isOpen: boolean;
  onOpen: () => void;
  children?: ReactNode;
};

function Bow() {
  return (
    <svg className="envelope-bow" viewBox="0 0 120 80" aria-hidden="true">
      <path
        d="M60 40 C40 10 8 8 10 30 C12 48 40 42 60 40 Z"
        style={{ fill: 'var(--color-rose)' }}
      />
      <path
        d="M60 40 C80 10 112 8 110 30 C108 48 80 42 60 40 Z"
        style={{ fill: 'var(--color-rose)' }}
      />
      <path
        d="M60 40 C44 56 22 70 30 76 C38 80 52 56 60 40 Z"
        style={{ fill: 'var(--color-rose-dark)' }}
      />
      <path
        d="M60 40 C76 56 98 70 90 76 C82 80 68 56 60 40 Z"
        style={{ fill: 'var(--color-rose-dark)' }}
      />
      <circle cx="60" cy="40" r="9" style={{ fill: 'var(--color-rose-dark)' }} />
    </svg>
  );
}

function OpenHint() {
  return (
    <div className="envelope-hint" role="status">
      <span className="envelope-hint-pill">Click to open</span>
      <svg className="envelope-hint-arrow" viewBox="0 0 24 70" aria-hidden="true">
        <path d="M12 0 L12 62" stroke="#a36a61" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path
          d="M4 54 L12 68 L20 54"
          stroke="#a36a61"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

export default function Envelope({ isOpen, onOpen, children }: EnvelopeProps) {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (isOpen) return;
    const timer = window.setTimeout(() => setShowHint(true), HINT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  return (
    <div className={`envelope ${isOpen ? 'envelope--open' : ''}`}>
      <div className="envelope-body">
        <div className="envelope-pocket" />
        <div className="envelope-ribbon envelope-ribbon--vertical" />
        <div className="envelope-ribbon envelope-ribbon--horizontal" />
      </div>

      <div className="envelope-flap" />

      <button
        type="button"
        className="envelope-bow-button"
        onClick={onOpen}
        disabled={isOpen}
        aria-label="Open the invitation"
      >
        <Bow />
      </button>

      {showHint && !isOpen && <OpenHint />}

      {children}
    </div>
  );
}
