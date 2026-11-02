import { lazy, Suspense } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

const Schedule = lazy(() => import('./pages/Schedule'));
const RSVP = lazy(() => import('./pages/RSVP'));
const Travel = lazy(() => import('./pages/Travel'));
const FAQ = lazy(() => import('./pages/FAQ'));

export default function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/rsvp" element={<RSVP />} />
            <Route path="/travel" element={<Travel />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}
