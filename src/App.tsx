import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';

const Schedule = lazy(() => import('./pages/Schedule'));
const RSVP = lazy(() => import('./pages/RSVP'));
const Travel = lazy(() => import('./pages/Travel'));
const FAQ = lazy(() => import('./pages/FAQ'));

export default function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#fcfbf7', color: '#3b3a36', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {/* Navigation Header */}
        <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e8e2d5', padding: '15px 30px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ fontSize: '1.2rem', fontFamily: 'serif', textDecoration: 'none', color: '#3b3a36', fontWeight: 'bold' }}>
              Rosie & Joe
            </Link>
            <div style={{ display: 'flex', gap: '30px' }}>
              <Link to="/" style={{ textDecoration: 'none', color: '#555' }}>Home</Link>
              <Link to="/schedule" style={{ textDecoration: 'none', color: '#555' }}>Schedule</Link>
              <Link to="/rsvp" style={{ textDecoration: 'none', color: '#b87d74', fontWeight: 'bold' }}>RSVP</Link>
              <Link to="/travel" style={{ textDecoration: 'none', color: '#555' }}>Travel</Link>
              <Link to="/faq" style={{ textDecoration: 'none', color: '#555' }}>FAQ</Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/rsvp" element={<RSVP />} />
              <Route path="/travel" element={<Travel />} />
              <Route path="/faq" element={<FAQ />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      
    </Router>
  );
}