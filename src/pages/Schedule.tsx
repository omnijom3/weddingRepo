export default function Schedule() {
  const events = [
    { time: '1:00 PM', title: 'Guest Arrival', description: 'Welcome drinks in the main foyer at Conyngham Arms.' },
    { time: '1:30 PM', title: 'Ceremony Begins', description: 'Please be seated in the ceremony suite by 1:20 PM.' },
    { time: '2:30 PM', title: 'Drinks Reception & Photos', description: 'Enjoy prosecco, canopy, and live acoustics in the garden lounge.' },
    { time: '5:30 PM', title: 'Call to Dinner', description: 'Speeches followed by a 3-course dinner.' },
    { time: '8:30 PM', title: 'First Dance & Evening Party', description: 'The band takes the stage!' },
    { time: '11:00 PM', title: 'Late Night Food', description: 'Sliders and late snacks served.' },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'serif', textAlign: 'center', color: '#2c3e50' }}>Wedding Day Schedule</h1>
      <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '40px' }}>
        Friday, August 13th, 2027 • Conyngham Arms Hotel
      </p>

      <div style={{ position: 'relative', paddingLeft: '30px', borderLeft: '3px solid #8e44ad' }}>
        {events.map((e, index) => (
          <div key={index} style={{ marginBottom: '30px', position: 'relative' }}>
            <span style={{ fontSize: '0.9rem', color: '#8e44ad', fontWeight: 'bold' }}>{e.time}</span>
            <h3 style={{ margin: '5px 0', color: '#2c3e50' }}>{e.title}</h3>
            <p style={{ margin: 0, color: '#555' }}>{e.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}