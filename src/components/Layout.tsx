import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/schedule', label: 'Schedule' },
  { to: '/rsvp', label: 'RSVP', accent: true },
  { to: '/travel', label: 'Travel' },
  { to: '/faq', label: 'FAQ' },
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="site">
      <nav className="site-nav">
        <div className="site-nav-inner">
          <Link to="/" className="site-brand">
            Rosie & Joe
          </Link>
          <div className="site-links">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={item.accent ? 'site-link site-link--accent' : 'site-link'}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
      <main className="site-main">{children}</main>
    </div>
  );
}
