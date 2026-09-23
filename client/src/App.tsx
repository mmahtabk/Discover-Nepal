import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './auth/AuthContext';
import { SavedProvider } from './saved/SavedContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProvincesPage from './pages/ProvincesPage';
import ProvinceDetailPage from './pages/ProvinceDetailPage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import MapPage from './pages/MapPage';
import TripPlannerPage from './pages/TripPlannerPage';
import ContactPage from './pages/ContactPage';
import AdminRoute from './admin/AdminRoute';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminDestinationsPage from './pages/admin/AdminDestinationsPage';
import AdminProvincesPage from './pages/admin/AdminProvincesPage';
import AdminInquiriesPage from './pages/admin/AdminInquiriesPage';

function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">— 404</p>
      <h1 className="mt-2 font-serif text-4xl font-bold">{t('notFound.title')}</h1>
      <p className="mt-3 text-muted">{t('notFound.msg')}</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink hover:brightness-95"
      >
        {t('notFound.back')}
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SavedProvider>
        <BrowserRouter>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/provinces" element={<ProvincesPage />} />
                <Route path="/provinces/:slug" element={<ProvinceDetailPage />} />
                <Route path="/destinations" element={<DestinationsPage />} />
                <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/plan-trip" element={<TripPlannerPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin" element={<AdminRoute />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="destinations" element={<AdminDestinationsPage />} />
                  <Route path="provinces" element={<AdminProvincesPage />} />
                  <Route path="inquiries" element={<AdminInquiriesPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </SavedProvider>
    </AuthProvider>
  );
}