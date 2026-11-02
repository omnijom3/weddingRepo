import { useState } from 'react';
import { Link } from 'react-router-dom';
import Envelope from '../components/Envelope';
import PetalShower from '../components/PetalShower';
import './Home.css';

function InvitationCard() {
  return (
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
        We are overjoyed to celebrate our wedding day surrounded by our favorite people. Explore
        our itinerary, travel guides, and let us know if you can make it!
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
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
  );
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

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
      {isOpen && <PetalShower />}

      <div className="envelope-scene">
        <Envelope isOpen={isOpen} onOpen={() => setIsOpen(true)}>
          {isOpen && <InvitationCard />}
        </Envelope>
      </div>
    </div>
  );
}
