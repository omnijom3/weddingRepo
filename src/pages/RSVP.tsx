import { useCallback, useEffect, useState, type FormEvent } from 'react';
import PageHeader from '../components/PageHeader';
import PhotoAnimation from '../components/PhotoAnimation';
import type { PhotoVariant } from '../data/animations';
import { mealOptions, wedding } from '../data/wedding';
import {
  findHousehold,
  rememberedHouseholdCode,
  rememberHouseholdCode,
  saveRsvps,
  type Household,
  type RsvpAnswer,
  type Side,
} from '../lib/households';

type GuestForm = RsvpAnswer;

function toForm(household: Household): GuestForm[] {
  return household.guests.map((guest) => ({
    guestId: guest.id,
    guestName: guest.name,
    attending: true,
    mealChoice: mealOptions[0].value,
    dietaryNotes: '',
  }));
}

export default function RSVP() {
  const [household, setHousehold] = useState<Household | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');
  const [guests, setGuests] = useState<GuestForm[]>([]);
  const [side, setSide] = useState<Side>('both');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [photo, setPhoto] = useState<{ id: number; variant: PhotoVariant } | null>(null);
  const triggerPhoto = (variant: PhotoVariant) => setPhoto({ id: Date.now(), variant });
  const clearPhoto = useCallback(() => setPhoto(null), []);

  useEffect(() => {
    const remembered = rememberedHouseholdCode();
    if (!remembered) return;

    let active = true;
    findHousehold(remembered)
      .then((found) => {
        if (!active || !found) return;
        setHousehold(found);
        setGuests(toForm(found));
        setSide(found.side ?? 'both');
      })
      .catch((err: unknown) => console.error('Error loading household:', err));

    return () => {
      active = false;
    };
  }, []);

  const handleCodeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCodeError('');

    const code = codeInput.trim().toLowerCase();
    try {
      const found = await findHousehold(code);
      if (!found) {
        setCodeError('We could not find that invite code. Please check it and try again.');
        return;
      }
      rememberHouseholdCode(found.householdCode);
      setHousehold(found);
      setGuests(toForm(found));
      setSide(found.side ?? 'both');
    } catch (err: unknown) {
      console.error('Error looking up invite code:', err);
      setCodeError('Something went wrong. Please try again.');
    }
  };

  const updateGuest = (guestId: string, changes: Partial<GuestForm>) => {
    setGuests((current) =>
      current.map((guest) => (guest.guestId === guestId ? { ...guest, ...changes } : guest)),
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!household) return;

    setIsSubmitting(true);
    setErrorMessage('');

    const answers = guests.map((guest) => ({
      ...guest,
      mealChoice: guest.attending ? guest.mealChoice : 'N/A',
      dietaryNotes: guest.attending ? guest.dietaryNotes.trim() || 'None' : 'None',
    }));

    try {
      await saveRsvps(household.householdCode, side, answers);
      setIsSubmitted(true);
      triggerPhoto(side);
    } catch (err: unknown) {
      console.error('Error submitting RSVP:', err);
      setErrorMessage('Something went wrong submitting your RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!household) {
    return (
      <div className="card rsvp-card">
        <PageHeader title="RSVP" />
        <p className="rsvp-deadline">Please enter the invite code from your invitation.</p>
        <form onSubmit={handleCodeSubmit} className="form-stack">
          {codeError && <div className="form-error">{codeError}</div>}
          <div className="form-field">
            <label htmlFor="invite-code" className="form-label">
              Invite code *
            </label>
            <input
              id="invite-code"
              type="text"
              required
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              className="form-input"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Continue
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="card rsvp-card">
      {photo && <PhotoAnimation key={photo.id} variant={photo.variant} onDone={clearPhoto} />}
      <PageHeader title="RSVP" />
      <p className="rsvp-deadline">Please respond by {wedding.rsvpDeadline}</p>

      {isSubmitted ? (
        <div className="rsvp-success">
          <h2 className="page-title">Thank You, {household.greetingName}!</h2>
          <p>
            Your RSVP has been successfully received. We can&apos;t wait to celebrate with you at{' '}
            {wedding.venue}!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="form-stack">
          {errorMessage && <div className="form-error">{errorMessage}</div>}

          <fieldset className="form-field">
            <legend className="form-label">Whose guest are you? *</legend>
            <div className="radio-group">
              {(
                [
                  ['rosie', "Rosie's"],
                  ['joe', "Joe's"],
                  ['both', 'Both'],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="radio-option">
                  <input
                    type="radio"
                    name="side"
                    value={value}
                    checked={side === value}
                    onChange={() => {
                      setSide(value);
                      triggerPhoto(value);
                    }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          {guests.map((guest) => (
            <fieldset key={guest.guestId} className="form-field">
              <legend className="form-label">{guest.guestName}</legend>

              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name={`attending-${guest.guestId}`}
                    checked={guest.attending}
                    onChange={() => updateGuest(guest.guestId, { attending: true })}
                  />
                  Joyfully Accepts
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name={`attending-${guest.guestId}`}
                    checked={!guest.attending}
                    onChange={() => updateGuest(guest.guestId, { attending: false })}
                  />
                  Regretfully Declines
                </label>
              </div>

              {guest.attending && (
                <>
                  <label htmlFor={`meal-${guest.guestId}`} className="form-label">
                    Meal Selection *
                  </label>
                  <select
                    id={`meal-${guest.guestId}`}
                    value={guest.mealChoice}
                    onChange={(e) => {
                      updateGuest(guest.guestId, { mealChoice: e.target.value });
                      triggerPhoto(side);
                    }}
                    className="form-input"
                  >
                    {mealOptions.map((meal) => (
                      <option key={meal.value} value={meal.value}>
                        {meal.label}
                      </option>
                    ))}
                  </select>

                  <label htmlFor={`dietary-${guest.guestId}`} className="form-label">
                    Dietary Requirements or Allergies
                  </label>
                  <textarea
                    id={`dietary-${guest.guestId}`}
                    rows={2}
                    value={guest.dietaryNotes}
                    onChange={(e) => updateGuest(guest.guestId, { dietaryNotes: e.target.value })}
                    className="form-input"
                  />
                </>
              )}
            </fieldset>
          ))}

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
