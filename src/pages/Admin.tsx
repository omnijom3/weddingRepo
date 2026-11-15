import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { fetchAuthSession, getCurrentUser, signIn, signOut } from 'aws-amplify/auth';
import PageHeader from '../components/PageHeader';
import { PROGRESS_STEPS } from '../data/progress';
import {
  householdsCsv,
  notificationsCsv,
  rsvpsCsv,
  summariseHouseholds,
  type AdminHousehold,
  type AdminNotification,
  type AdminProgress,
  type AdminRsvp,
} from '../lib/admin';
import { client } from '../lib/amplifyClient';

type Data = {
  households: AdminHousehold[];
  rsvps: AdminRsvp[];
  progress: AdminProgress[];
  notifications: AdminNotification[];
};

async function listAll<T>(
  list: (options: { authMode: 'userPool'; nextToken?: string | null }) => Promise<{
    data: T[];
    nextToken?: string | null;
    errors?: { message: string }[];
  }>,
): Promise<T[]> {
  const items: T[] = [];
  let nextToken: string | null | undefined;
  do {
    const page = await list({ authMode: 'userPool', nextToken });
    if (page.errors?.length) throw new Error(page.errors[0].message);
    items.push(...page.data);
    nextToken = page.nextToken;
  } while (nextToken);
  return items;
}

async function fetchAll(): Promise<Data> {
  const [households, rsvps, progress, notifications] = await Promise.all([
    listAll((options) => client.models.Household.list(options)),
    listAll((options) => client.models.RSVP.list(options)),
    listAll((options) => client.models.Progress.list(options)),
    listAll((options) => client.models.NotificationSignup.list(options)),
  ]);
  return {
    households: households.map((h) => ({
      householdCode: h.householdCode,
      greetingName: h.greetingName,
      side: h.side ?? null,
      guests: (h.guests ?? []) as AdminHousehold['guests'],
    })),
    rsvps: rsvps.map((r) => ({
      householdCode: r.householdCode,
      guestId: r.guestId,
      guestName: r.guestName,
      attending: r.attending,
      mealChoice: r.mealChoice,
      dietaryNotes: r.dietaryNotes ?? null,
    })),
    progress: progress.map((p) => ({
      householdCode: p.householdCode,
      step: p.step,
      completedAt: p.completedAt,
    })),
    notifications: notifications.map((n) => ({
      householdCode: n.householdCode,
      email: n.email ?? null,
      phone: n.phone ?? null,
      createdAt: n.createdAt,
    })),
  };
}

function download(filename: string, contents: string) {
  const url = URL.createObjectURL(new Blob([contents], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function isAdmin(groups: unknown): boolean {
  return Array.isArray(groups) && groups.includes('admins');
}

export default function Admin() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [data, setData] = useState<Data | null>(null);
  const [loadError, setLoadError] = useState('');

  const refreshSession = async () => {
    try {
      await getCurrentUser();
      const session = await fetchAuthSession();
      const groups = session.tokens?.accessToken.payload['cognito:groups'];
      if (!isAdmin(groups)) {
        await signOut();
        setLoginError('This account does not have admin access.');
        setSignedIn(false);
        return;
      }
      setSignedIn(true);
      setData(await fetchAll());
    } catch {
      setSignedIn(false);
    }
  };

  useEffect(() => {
    void refreshSession();
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await signIn({ username: email.trim(), password });
      setPassword('');
      await refreshSession();
    } catch (err: unknown) {
      console.error('Admin sign-in failed:', err);
      setLoginError('Sign-in failed. Check your email and password.');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setData(null);
    setSignedIn(false);
  };

  const summaries = useMemo(
    () => (data ? summariseHouseholds(data.households, data.rsvps, data.progress) : []),
    [data],
  );

  if (signedIn === null) return null;

  if (!signedIn) {
    return (
      <div className="card rsvp-card">
        <PageHeader title="Admin" />
        <form onSubmit={handleLogin} className="form-stack">
          {loginError && <div className="form-error">{loginError}</div>}
          <div className="form-field">
            <label htmlFor="admin-email" className="form-label">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-field">
            <label htmlFor="admin-password" className="form-label">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Sign in
          </button>
        </form>
      </div>
    );
  }

  const exportHouseholds = () => {
    if (!data) return;
    download('households.csv', householdsCsv(summaries));
  };

  const exportRsvps = () => {
    if (!data) return;
    download('rsvps.csv', rsvpsCsv(data.households, data.rsvps));
  };

  const exportNotifications = () => {
    if (!data) return;
    download('notifications.csv', notificationsCsv(data.notifications));
  };

  const refresh = async () => {
    setLoadError('');
    try {
      setData(await fetchAll());
    } catch (err: unknown) {
      console.error('Error loading admin data:', err);
      setLoadError('Could not load data. Please try again.');
    }
  };

  return (
    <div className="card rsvp-card admin-card">
      <PageHeader title="Admin" />
      {loadError && <div className="form-error">{loadError}</div>}

      <div className="admin-actions">
        <button type="button" className="btn btn-outline" onClick={refresh}>
          Refresh
        </button>
        <button type="button" className="btn btn-outline" onClick={exportHouseholds}>
          Export households CSV
        </button>
        <button type="button" className="btn btn-outline" onClick={exportRsvps}>
          Export RSVPs CSV
        </button>
        <button type="button" className="btn btn-outline" onClick={exportNotifications}>
          Export notifications CSV
        </button>
        <button type="button" className="btn btn-outline" onClick={handleSignOut}>
          Sign out
        </button>
      </div>

      <h2 className="page-title">Households ({summaries.length})</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Greeting</th>
              <th>Side</th>
              <th>Guests</th>
              <th>RSVPs</th>
              {PROGRESS_STEPS.map((step) => (
                <th key={step.key}>{step.label}</th>
              ))}
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {summaries.map((summary) => (
              <tr key={summary.householdCode}>
                <td>{summary.greetingName}</td>
                <td>{summary.side ?? ''}</td>
                <td>{summary.guestNames.join(', ')}</td>
                <td>{summary.rsvpCount}</td>
                {PROGRESS_STEPS.map((step) => (
                  <td key={step.key}>{summary.completed[step.key] ? 'Yes' : 'No'}</td>
                ))}
                <td>
                  {summary.completedCount}/{summary.totalSteps}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
