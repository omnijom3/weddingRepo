import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { findHousehold, rememberHouseholdCode, type Household } from '../lib/households';
import Home from './Home';

type LoadState =
  | { status: 'loading' }
  | { status: 'found'; household: Household }
  | { status: 'missing' }
  | { status: 'error' };

export default function Invite() {
  const { code = '' } = useParams();
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    let active = true;

    findHousehold(code)
      .then((household) => {
        if (!active) return;
        if (household) {
          rememberHouseholdCode(household.householdCode);
          setState({ status: 'found', household });
        } else {
          setState({ status: 'missing' });
        }
      })
      .catch((err: unknown) => {
        console.error('Error loading invitation:', err);
        if (active) setState({ status: 'error' });
      });

    return () => {
      active = false;
    };
  }, [code]);

  if (state.status === 'loading') return null;
  if (state.status === 'found') return <Home household={state.household} />;

  return (
    <div className="card rsvp-card">
      <PageHeader title="Invitation not found" />
      <p className="rsvp-deadline">
        {state.status === 'missing'
          ? 'Please check the link on your invitation and try again.'
          : 'Something went wrong loading your invitation. Please try again.'}
      </p>
    </div>
  );
}
