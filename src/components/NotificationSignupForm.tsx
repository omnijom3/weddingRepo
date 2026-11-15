import { useState, type FormEvent } from 'react';
import PageHeader from './PageHeader';
import { findHousehold, rememberedHouseholdCode, saveNotificationSignup } from '../lib/households';

export default function NotificationSignupForm() {
  const [householdCode] = useState(() => rememberedHouseholdCode());
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const emailValue = email.trim();
    const phoneValue = phone.trim();
    if (!emailValue && !phoneValue) {
      setError('Please enter an email address or a phone number.');
      return;
    }
    if (!householdCode) return;

    setIsSubmitting(true);
    try {
      const found = await findHousehold(householdCode);
      if (!found) {
        setError('We could not find your invite. Please open the link from your invitation again.');
        return;
      }
      await saveNotificationSignup({
        householdCode: found.householdCode,
        email: emailValue || undefined,
        phone: phoneValue || undefined,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      console.error('Error saving notification sign-up:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="card rsvp-card">
        <PageHeader title="Thank you" />
        <p className="rsvp-deadline">
          We have your details. We will let you know as soon as the RSVP is open.
        </p>
      </div>
    );
  }

  if (!householdCode) {
    return (
      <div className="card rsvp-card">
        <PageHeader title="RSVP" />
        <p className="rsvp-deadline">
          The RSVP is not open yet. Please open the link from your invitation to leave your details.
        </p>
      </div>
    );
  }

  return (
    <div className="card rsvp-card">
      <PageHeader title="RSVP" />
      <p className="rsvp-deadline">
        The RSVP is not open yet. Leave your details and we will let you know when it is.
      </p>
      <form onSubmit={handleSubmit} className="form-stack">
        {error && <div className="form-error">{error}</div>}
        <div className="form-field">
          <label htmlFor="notify-email" className="form-label">
            Email
          </label>
          <input
            id="notify-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label htmlFor="notify-phone" className="form-label">
            Phone number
          </label>
          <input
            id="notify-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="form-input"
          />
        </div>
        <p className="rsvp-deadline">Please enter at least one of email or phone number.</p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
          style={{ padding: '14px', fontSize: '1.1rem' }}
        >
          {isSubmitting ? 'Sending...' : 'Notify me'}
        </button>
      </form>
    </div>
  );
}
