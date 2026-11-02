import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const PETAL_EMOJIS = ['🌸', '🌿', '🌼', '🌺', '🍃', '🌾', '🌻'];

function createPetals(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: PETAL_EMOJIS[Math.floor(Math.random() * PETAL_EMOJIS.length)],
    left: Math.random() * 95,
    delay: Math.random(),
    duration: 4 + Math.random() * 2.5,
    size: 0.9 + Math.random() * 0.7,
  }));
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [petals] = useState(() => createPetals(50));

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '75vh',
        padding: '10px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
          {petals.map((petal) => (
            <span
              key={petal.id}
              className="falling-petal"
              style={{
                left: `${petal.left}%`,
                fontSize: `${petal.size}rem`,
                animationDelay: `${petal.delay}s`,
                animationDuration: `${petal.duration}s`,
              }}
            >
              {petal.emoji}
            </span>
          ))}
        </div>
      )}

      <div className="envelope-scene">
        {!isOpen ? (
          /* --- Closed Envelope --- */
          <div
            onClick={() => setIsOpen(true)}
            style={{
              backgroundColor: '#f2eae1',
              border: '2px solid #e0d2c3',
              borderRadius: '12px',
              height: '300px',
              width: '100%',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {/* Top Triangular Flap */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                borderLeft: '273px solid transparent',
                borderRight: '273px solid transparent',
                borderTop: '150px solid #e3d3c3',
                zIndex: 4,
              }}
            />

            {/* Wax Seal & Title */}
            <div
              style={{
                position: 'absolute',
                top: '95px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#b87d74',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  boxShadow: '0 6px 15px rgba(184, 125, 116, 0.4)',
                  border: '3px solid #a36a61',
                  marginBottom: '8px',
                }}
              >
                💌
              </div>
              <h2
                style={{
                  fontFamily: 'serif',
                  color: '#3b3a36',
                  fontSize: '1.4rem',
                  margin: '0 0 4px 0',
                }}
              >
                Rosie & Joe
              </h2>
              <p style={{ color: '#7a8b79', fontStyle: 'italic', margin: 0, fontSize: '0.9rem' }}>
                Click seal to open envelope
              </p>
            </div>

            {/* Bottom Pocket */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '160px',
                backgroundColor: '#ebdcd0',
                borderTop: '2px solid #e0d2c3',
                borderRadius: '0 0 12px 12px',
                zIndex: 3,
              }}
            />
          </div>
        ) : (
          /* --- Opening Animation Sequence --- */
          <div style={{ position: 'relative', width: '100%', height: '300px' }}>
            {/* Envelope Background Container */}
            <div
              className="envelope-fading-smooth"
              style={{
                backgroundColor: '#f2eae1',
                border: '2px solid #e0d2c3',
                borderRadius: '12px',
                height: '300px',
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
              }}
            >
              {/* Folding Top Flap */}
              <div
                className="flap-opening-slow"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '0',
                  height: '0',
                  borderLeft: '273px solid transparent',
                  borderRight: '273px solid transparent',
                  borderTop: '150px solid #e3d3c3',
                  zIndex: 3,
                }}
              />
              {/* Pocket */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '160px',
                  backgroundColor: '#ebdcd0',
                  borderTop: '2px solid #e0d2c3',
                  borderRadius: '0 0 12px 12px',
                  zIndex: 2,
                }}
              />
            </div>

            {/* Invitation Card */}
            <div
              className="card-sliding-smooth"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e8e2d5',
                borderRadius: '16px',
                padding: '35px 30px',
                textAlign: 'center',
                boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                position: 'absolute',
                top: '-15px',
                left: 0,
                width: '100%',
                boxSizing: 'border-box',
                zIndex: 10,
              }}
            >
              <div style={{ fontSize: '1.1rem', color: '#b87d74', marginBottom: '8px' }}>
                🌿 August Wildflowers Collection 🌿
              </div>

              <h1
                style={{
                  fontSize: '2.5rem',
                  fontFamily: 'serif',
                  color: '#3b3a36',
                  marginBottom: '4px',
                }}
              >
                Rosie & Joe
              </h1>
              <p
                style={{
                  fontSize: '0.95rem',
                  color: '#7a8b79',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '20px',
                }}
              >
                Are Getting Married
              </p>

              <div
                style={{
                  backgroundColor: '#fcfbf7',
                  borderLeft: '3px solid #c9a050',
                  padding: '15px',
                  margin: '20px 0',
                  textAlign: 'left',
                  borderRadius: '4px',
                }}
              >
                <p style={{ margin: '0 0 6px 0', fontSize: '1rem' }}>
                  <strong>Date:</strong> Friday, August 13th, 2027
                </p>
                <p style={{ margin: '0 0 6px 0', fontSize: '1rem' }}>
                  <strong>Venue:</strong> Conyngham Arms Hotel, Slane, Co. Meath
                </p>
                <p style={{ margin: 0, fontSize: '1rem' }}>
                  <strong>Ceremony:</strong> 1:30 PM Sharp
                </p>
              </div>

              <p
                style={{
                  lineHeight: '1.6',
                  color: '#555',
                  marginBottom: '20px',
                  fontSize: '0.9rem',
                }}
              >
                We are overjoyed to celebrate our wedding day surrounded by our favorite people.
                Explore our itinerary, travel guides, and let us know if you can make it!
              </p>

              <div
                style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}
              >
                <Link
                  to="/rsvp"
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#b87d74',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: '25px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(184, 125, 116, 0.3)',
                  }}
                >
                  RSVP Now
                </Link>
                <Link
                  to="/schedule"
                  style={{
                    padding: '10px 24px',
                    backgroundColor: 'transparent',
                    color: '#3b3a36',
                    border: '1px solid #3b3a36',
                    textDecoration: 'none',
                    borderRadius: '25px',
                    fontWeight: 'bold',
                  }}
                >
                  View Schedule
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
