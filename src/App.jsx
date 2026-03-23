import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Home from "./pages/home";
import About from "./pages/about";
import Programme from "./pages/programme";
import Sponsoring from "./pages/sponsoring";
import Contact from "./pages/contact";
import Gallery from "./pages/gallery";
import Announcements from "./pages/announcements";
import AdminPanel from "./pages/adminPanel";
import EvaluationPage from "./pages/EvaluationPage";   // ← NEW
import TestimonialsPage from "./pages/TestimonialsPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ── Secret admin route ── */}
        <Route path="/stud-admin-2026" element={<AdminPanel />} />

        {/* ── Evaluation — no Navbar/Footer clutter, standalone ── */}
        <Route path="/evaluation"   element={<EvaluationPage />} />
        <Route path="/avis"  element={<TestimonialsPage />} />

        {/* ── Public routes ── */}
        <Route path="/*" element={
          <PublicLayout>
            <Routes>
              <Route path="/"             element={<Home />} />
              <Route path="/about"        element={<About />} />
              <Route path="/programme"    element={<Programme />} />
              <Route path="/sponsoring"   element={<Sponsoring />} />
              <Route path="/gallery"      element={<Gallery />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/contact"      element={<Contact />} />
            </Routes>
          </PublicLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}