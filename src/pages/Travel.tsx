export default function Travel() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.7' }}>
      <h1 style={{ fontFamily: 'serif', textAlign: 'center', color: '#2c3e50' }}>Travel & Accommodation</h1>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#8e44ad', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>The Venue</h2>
        <p><strong>Conyngham Arms Hotel</strong><br />Main Street, Slane, Co. Meath, C15 A272</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#8e44ad', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Where to Stay</h2>
        <ul>
          <li><strong>Conyngham Arms Hotel:</strong> Rooms are held for immediate family/wedding party. Contact us for codes.</li>
          <li><strong>The Castleboy Lodge:</strong> 5-minute taxi from Slane village.</li>
          <li><strong>Tankardstown House:</strong> Located 10 mins away for additional luxury rooms.</li>
          <li><strong>Local B&Bs:</strong> Several cozy guest houses available around Slane village.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#8e44ad', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Busses & Transport</h2>
        <p>
          Bus Eireann routes connect Slane directly to Dublin and Drogheda. 
          Taxi services are available, but we recommend booking local taxis in advance for late-night returns!
        </p>
      </section>

      <section>
        <h2 style={{ color: '#8e44ad', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Parking</h2>
        <p>
          Complimentary parking is available directly behind the hotel for resident guests. Additional public parking is located in Slane main square.
        </p>
      </section>
    </div>
  );
}