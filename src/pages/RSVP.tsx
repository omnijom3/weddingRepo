import { useState, FormEvent } from 'react';
import { client } from '../lib/amplifyClient';
import PageHeader from '../components/PageHeader';
import { mealOptions, wedding } from '../data/wedding';

export default function RSVP() {
  const [fullName, setFullName] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [mealChoice, setMealChoice] = useState<string>(mealOptions[0].value);
  const [dietaryNotes, setDietaryNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await client.models.RSVP.create({
        fullName,
        attending: attending === 'yes',
        mealChoice: attending === 'yes' ? mealChoice : 'N/A',
        dietaryNotes: dietaryNotes.trim() || 'None',
      });

      setIsSubmitted(true);
    } catch (err: unknown) {
      console.error('Error submitting RSVP:', err);
      setErrorMessage('Something went wrong submitting your RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card rsvp-card">
      <PageHeader title="RSVP" />
      <p className="rsvp-deadline">Please respond by {wedding.rsvpDeadline}</p>

      {isSubmitted ? (
        <div className="rsvp-success">
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🌸</div>
          <h2 className="page-title">Thank You, {fullName}!</h2>
          <p>
            Your RSVP has been successfully received. We can&apos;t wait to celebrate with you at{' '}
            {wedding.venue}!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="form-stack">
          {errorMessage && <div className="form-error">{errorMessage}</div>}

          <div className="form-field">
            <label htmlFor="rsvp-name" className="form-label">
              Full Name(s) *
            </label>
            <input
              id="rsvp-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. John & Sarah Smith"
              className="form-input"
            />
          </div>

          <fieldset className="form-field">
            <legend className="form-label">Will you be attending? *</legend>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="attending"
                  value="yes"
                  checked={attending === 'yes'}
                  onChange={() => setAttending('yes')}
                />
                Joyfully Accepts
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="attending"
                  value="no"
                  checked={attending === 'no'}
                  onChange={() => setAttending('no')}
                />
                Regretfully Declines
              </label>
            </div>
          </fieldset>

          {attending === 'yes' && (
            <>
              <div className="form-field">
                <label htmlFor="rsvp-meal" className="form-label">
                  Meal Selection *
                </label>
                <select
                  id="rsvp-meal"
                  value={mealChoice}
                  onChange={(e) => setMealChoice(e.target.value)}
                  className="form-input"
                >
                  {mealOptions.map((meal) => (
                    <option key={meal.value} value={meal.value}>
                      {meal.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="rsvp-dietary" className="form-label">
                  Dietary Requirements or Allergies
                </label>
                <textarea
                  id="rsvp-dietary"
                  rows={3}
                  value={dietaryNotes}
                  onChange={(e) => setDietaryNotes(e.target.value)}
                  placeholder="Please specify any allergies, gluten-free, dairy-free requirements..."
                  className="form-input"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ padding: '14px', fontSize: '1.1rem', marginTop: '10px' }}
          >
            {isSubmitting ? 'Submitting...' : 'Send RSVP'}
          </button>
        </form>
      )}
    </div>
  );
}
