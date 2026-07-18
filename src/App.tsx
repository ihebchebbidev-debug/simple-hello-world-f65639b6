import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import About from './pages/About';
import NotreMission from './pages/NotreMission';
import NosValeurs from './pages/NosValeurs';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import News from './pages/News';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminCategories from './pages/admin/AdminCategories';
import AdminVisitors from './pages/admin/AdminVisitors';
import CookieConsent from './components/CookieConsent';
import { Toaster } from 'sonner';
import { trackVisitor } from './lib/visitor-tracker';
import { getConsent, onConsentChange } from './lib/consent';

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) return;
    if (getConsent() === 'accepted') trackVisitor();
    const off = onConsentChange((c) => { if (c === 'accepted') trackVisitor(); });
    return () => { off(); };
  }, [isAdmin]);

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-surface">
      {!isAdmin && <LoadingScreen />}
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/notre-mission" element={<NotreMission />} />
          <Route path="/nos-valeurs" element={<NosValeurs />} />
          <Route path="/produits" element={<Products />} />
          <Route path="/produits/:slug" element={<ProductDetail />} />
          <Route path="/actualites" element={<News />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="produits" element={<AdminProducts />} />
            <Route path="produits/nouveau" element={<AdminProductForm />} />
            <Route path="produits/:id" element={<AdminProductForm />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="visiteurs" element={<AdminVisitors />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <CookieConsent />}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: { fontFamily: 'inherit', borderRadius: '14px' },
        }}
      />
    </div>
  );
}
