import { useState, FormEvent } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export default function RSVP() {
  const [fullName, setFullName] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [mealChoice, setMealChoice] = useState('Beef');
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
    } catch (err: any) {
      console.error('Error submitting RSVP:', err);
      setErrorMessage('Something went wrong submitting your RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '40px 30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          border: '1px solid #e8e2d5',
        }}
      >
        <h1 style={{ fontFamily: 'serif', textAlign: 'center', color: '#3b3a36', marginBottom: '10px' }}>
          RSVP
        </h1>
        <p style={{ textAlign: 'center', color: '#7a8b79', fontStyle: 'italic', marginBottom: '30px' }}>
          Please respond by June 1st, 2027
        </p>

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🌸</div>
            <h2 style={{ fontFamily: 'serif', color: '#3b3a36', marginBottom: '10px' }}>
              Thank You, {fullName}!
            </h2>
            <p style={{ color: '#555', lineHeight: '1.6' }}>
              Your RSVP has been successfully received. We can't wait to celebrate with you at Conyngham Arms Hotel!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {errorMessage && (
              <div style={{ backgroundColor: '#fdf2f2', color: '#9b1c1c', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>
                {errorMessage}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#3b3a36', marginBottom: '8px' }}>
                Full Name(s) *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. John & Sarah Smith"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                  fontSize: '1rem',
                }}
              />
            </div>

            {/* Attendance Choice */}
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#3b3a36', marginBottom: '8px' }}>
                Will you be attending? *
              </label>
              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="attending"
                    value="yes"
                    checked={attending === 'yes'}
                    onChange={() => setAttending('yes')}
                  />
                  Joyfully Accepts
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
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
            </div>

            {/* Meal Choice (Only shown if attending) */}
            {attending === 'yes' && (
              <>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', color: '#3b3a36', marginBottom: '8px' }}>
                    Meal Selection *
                  </label>
                  <select
                    value={mealChoice}
                    onChange={(e) => setMealChoice(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      boxSizing: 'border-box',
                      fontSize: '1rem',
                      backgroundColor: '#fff',
                    }}
                  >
                    <option value="Beef">Roast Prime Rib of Beef</option>
                    <option value="Salmon">Pan-Seared Atlantic Salmon</option>
                    <option value="Vegetarian">Wild Mushroom & Herb Risotto (Vegetarian/Vegan)</option>
                  </select>
                </div>

                {/* Dietary Notes */}
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', color: '#3b3a36', marginBottom: '8px' }}>
                    Dietary Requirements or Allergies
                  </label>
                  <textarea
                    rows={3}
                    value={dietaryNotes}
                    onChange={(e) => setDietaryNotes(e.target.value)}
                    placeholder="Please specify any allergies, gluten-free, dairy-free requirements..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      boxSizing: 'border-box',
                      fontSize: '1rem',
                      fontFamily: 'sans-serif',
                    }}
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '14px',
                backgroundColor: isSubmitting ? '#cccccc' : '#b87d74',
                color: '#ffffff',
                border: 'none',
                borderRadius: '25px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(184, 125, 116, 0.3)',
                marginTop: '10px',
                transition: 'background-color 0.2s ease',
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Send RSVP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}