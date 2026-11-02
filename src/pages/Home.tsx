import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Envelope from '../components/Envelope';
import PetalShower, { type Origin } from '../components/PetalShower';
import './Home.css';

function InvitationCard() {
  return (
    <div className="invite-card card-sliding-smooth">
      <h1 className="invite-title">Rosie & Joe</h1>
      <p className="invite-subtitle">Are Getting Married</p>

      <div className="invite-details">
        <p>
          <strong>Date:</strong> Friday, August 13th, 2027
        </p>
        <p>
          <strong>Venue:</strong> Conyngham Arms Hotel, Slane, Co. Meath
        </p>
        <p>
          <strong>Ceremony:</strong> 1:30 PM Sharp
        </p>
      </div>

      <p className="invite-body">
        We are overjoyed to celebrate our wedding day surrounded by our favorite people. Explore our
        itinerary, travel guides, and let us know if you can make it!
      </p>

      <div className="invite-actions">
        <Link to="/rsvp" className="btn btn-primary">
          RSVP Now
        </Link>
        <Link to="/schedule" className="btn btn-outline">
          View Schedule
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [origin, setOrigin] = useState<Origin>({ x: 0, y: 0 });
  const sceneRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (rect) {
      setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height * 0.35 });
    }
    setIsOpen(true);
  };

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
      {isOpen && <PetalShower origin={origin} />}

      <div className="envelope-scene" ref={sceneRef}>
        <Envelope isOpen={isOpen} onOpen={handleOpen}>
          {isOpen && <InvitationCard />}
        </Envelope>
      </div>
    </div>
  );
}
