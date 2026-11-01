import React, { useState } from 'react';

interface LandingOverlayProps {
  onUnlock: () => void;
}

export const LandingOverlay: React.FC<LandingOverlayProps> = ({ onUnlock }) => {
  const [code, setCode] = useState('');
  const [isFading, setIsFading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsFading(true);

    setTimeout(() => {
      onUnlock();
    }, 1000);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
        color: '#ffffff',
        zIndex: 50,
      }}
      className={`transition-opacity duration-1000 px-4 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
        }}
        className="space-y-6"
      >
        {/* Floating text 1 */}
        <h1 className="text-4xl sm:text-5xl font-serif tracking-widest uppercase animate-float-up">
          Welcome
        </h1>

        {/* Floating text 2 */}
        <p className="text-lg font-light text-stone-300 tracking-wide animate-float-up-delay">
          Please enter code
        </p>

        {/* Code Input Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
          className="gap-4 animate-float-up-delay"
        >
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter wedding code"
            className="w-full max-w-xs px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-md text-center text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-300 tracking-widest text-lg transition-colors"
            autoFocus
          />
          <button
            type="submit"
            className="px-8 py-2.5 bg-white text-black font-medium tracking-wider uppercase rounded-md hover:bg-neutral-200 transition-colors text-sm"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
};