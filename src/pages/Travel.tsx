import PageHeader from '../components/PageHeader';
import { wedding } from '../data/wedding';

export default function Travel() {
  return (
    <div className="page travel">
      <PageHeader title="Travel & Accommodation" />

      <section className="section">
        <h2 className="section-heading">The Venue</h2>
        <p>
          <strong>{wedding.venue}</strong>
          <br />
          {wedding.venueAddress}
        </p>
      </section>

      <section className="section">
        <h2 className="section-heading">Where to Stay</h2>
        <ul>
          <li>
            <strong>Conyngham Arms Hotel:</strong> Rooms are held for immediate family/wedding
            party. Contact us for codes.
          </li>
          <li>
            <strong>The Castleboy Lodge:</strong> 5-minute taxi from Slane village.
          </li>
          <li>
            <strong>Tankardstown House:</strong> Located 10 mins away for additional luxury rooms.
          </li>
          <li>
            <strong>Local B&Bs:</strong> Several cozy guest houses available around Slane village.
          </li>
        </ul>
      </section>

      <section className="section">
        <h2 className="section-heading">Busses & Transport</h2>
        <p>
          Bus Eireann routes connect Slane directly to Dublin and Drogheda. Taxi services are
          available, but we recommend booking local taxis in advance for late-night returns!
        </p>
      </section>

      <section className="section">
        <h2 className="section-heading">Parking</h2>
        <p>
          Complimentary parking is available directly behind the hotel for resident guests.
          Additional public parking is located in Slane main square.
        </p>
      </section>
    </div>
  );
}
