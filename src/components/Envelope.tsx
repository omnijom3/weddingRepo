import type { ReactNode } from 'react';

type EnvelopeProps = {
  isOpen: boolean;
  onOpen: () => void;
  children?: ReactNode;
};

function Bow() {
  return (
    <svg className="envelope-bow" viewBox="0 0 120 80" aria-hidden="true">
      <path d="M60 40 C40 10 8 8 10 30 C12 48 40 42 60 40 Z" fill="#b87d74" />
      <path d="M60 40 C80 10 112 8 110 30 C108 48 80 42 60 40 Z" fill="#b87d74" />
      <path d="M60 40 C44 56 22 70 30 76 C38 80 52 56 60 40 Z" fill="#a36a61" />
      <path d="M60 40 C76 56 98 70 90 76 C82 80 68 56 60 40 Z" fill="#a36a61" />
      <circle cx="60" cy="40" r="9" fill="#8f554c" />
    </svg>
  );
}

export default function Envelope({ isOpen, onOpen, children }: EnvelopeProps) {
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

      {!isOpen && (
        <div className="envelope-caption">
          <span className="envelope-caption-title">Rosie &amp; Joe</span>
          <span className="envelope-caption-hint">Tap the bow to open</span>
        </div>
      )}

      {children}
    </div>
  );
}
