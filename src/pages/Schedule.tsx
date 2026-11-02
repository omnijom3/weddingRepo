import PageHeader from '../components/PageHeader';
import { scheduleEvents, wedding } from '../data/wedding';

export default function Schedule() {
  return (
    <div className="page">
      <PageHeader title="Wedding Day Schedule" subtitle={`${wedding.date} • ${wedding.venue}`} />

      <div className="timeline">
        {scheduleEvents.map((event) => (
          <div key={event.time} className="timeline-item">
            <span className="timeline-time">{event.time}</span>
            <h3 className="timeline-title">{event.title}</h3>
            <p className="timeline-description">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
