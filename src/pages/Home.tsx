import { useState } from 'react';
import { Link } from 'react-router-dom';
import Envelope from '../components/Envelope';
import PetalShower from '../components/PetalShower';
import type { Household } from '../lib/households';
import './Home.css';

function InvitationCard({ household }: { household?: Household }) {
  return (
    <div className="invite-card card-sliding-smooth">
      <h1 className="invite-title">Rosie & Joe</h1>
      <p className="invite-subtitle">Are Getting Married</p>

      {household && <p className="invite-greeting">Dear {household.greetingName},</p>}

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

export default function Home({ household }: { household?: Household }) {
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
          {isOpen && <InvitationCard household={household} />}
        </Envelope>
      </div>
    </div>
  );
}
