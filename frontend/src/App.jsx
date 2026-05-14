import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Header";
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from "./Admin/ProtectedRoute";
import AdminLayout from "./Admin/AdminLayout";
import AdminErrorBoundary from "./Admin/AdminErrorBoundary";

// ─── Lazy-loaded Public Pages ───────────────────────────────────────────────
const Container       = lazy(() => import("./pages/Container"));
const About           = lazy(() => import("./pages/About"));
const WhatIOffer      = lazy(() => import("./pages/Offer"));
const SpecializedSolutions = lazy(() => import("./pages/Contact"));
const SkillsSection   = lazy(() => import("./pages/Skills"));
const Projects        = lazy(() => import("./pages/Project"));
const ProjectDetails  = lazy(() => import("./components/Project_details"));
const PricingPage     = lazy(() => import("./pages/Pricing"));
const SignUp          = lazy(() => import("./pages/SignUp"));
const SignIn          = lazy(() => import("./pages/SignIn"));
const ForgotPassword  = lazy(() => import("./pages/ForgotPassword"));
const Footer          = lazy(() => import("./components/Footer"));
const DynamicPage     = lazy(() => import("./pages/DynamicPage"));
const Team            = lazy(() => import("./pages/our_team"));
const TeamDetails     = lazy(() => import("./pages/TeamDetails"));
const ServiceDetails  = lazy(() => import("./pages/ServiceDetails"));
const ClientFeedback  = lazy(() => import("./pages/ClientFeedback"));
const LegalPage       = lazy(() => import("./pages/LegalPage"));
const NotFound        = lazy(() => import("./pages/NotFound"));

// ─── Lazy-loaded Admin Pages ─────────────────────────────────────────────────
const AdminHome           = lazy(() => import("./Admin/AdminHome"));
const AdminAbout          = lazy(() => import("./Admin/AdminAbout"));
const AdminServices       = lazy(() => import("./Admin/AdminServices"));
const AdminSkills         = lazy(() => import("./Admin/AdminSkills"));
const AdminProjects       = lazy(() => import("./Admin/AdminProjects"));
const AdminPrices         = lazy(() => import("./Admin/AdminPrices"));
const AdminContact        = lazy(() => import("./Admin/AdminContact"));
const AdminDashboard      = lazy(() => import("./Admin/AdminDashBord"));
const AdminProjectDetails = lazy(() => import("./Admin/AdminProjectDetails"));
const AdminTeam           = lazy(() => import("./Admin/AdminTeam"));
const AdminServiceDetails = lazy(() => import("./Admin/AdminServiceDetails"));
const AdminFeedback       = lazy(() => import("./Admin/AdminFeedback"));
const AdminLegal          = lazy(() => import("./Admin/AdminLegal"));
const AdminWhyWebsite      = lazy(() => import("./Admin/AdminWhyWebsite"));

import { GlobalSkeleton } from "./components/Skeleton";

// ─── Minimal page-transition fallback (Premium Skeleton) ────────────────────
const PageFallback = () => <GlobalSkeleton />;

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthRoute = location.pathname === "/signin" || location.pathname === "/signup" || location.pathname === "/forgot-password";

  return (
    <>
      <Toaster 
        position="bottom-center" 
        reverseOrder={false} 
        toastOptions={{
          className: 'premium-toast',
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
            borderRadius: '4px',
            padding: '16px 24px',
            border: '1px solid var(--toast-border)',
            fontSize: '11px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
            maxWidth: '400px'
          },
          success: {
            style: {
              borderLeft: '4px solid #f97316',
            },
            iconTheme: {
              primary: '#f97316',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              borderLeft: '4px solid #ef4444',
            },
          },
        }}
      />
      <ScrollToTop />

      {!isAdminRoute && !isAuthRoute && <Navbar />}

      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* --- Public Client Routes --- */}
          <Route path="/" element={<Container />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<WhatIOffer />} />
          <Route path="/skills" element={<SkillsSection />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/Prices" element={<PricingPage />} />
          <Route path="/Clients-feedback" element={<ClientFeedback />} />
          <Route path="/contact" element={<SpecializedSolutions />} />
          <Route path="/project_details/:projectId" element={<ProjectDetails />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/page/:slug" element={<DynamicPage />} />
          <Route path="/team" element={<Team />} />
          <Route path="/team/:id" element={<TeamDetails />} />
          <Route path="/service_details/:serviceId" element={<ServiceDetails />} />
          <Route path="/legal/:slug" element={<LegalPage />} />


          {/* --- Protected Admin Dashboard Routes --- */}
          <Route path="/admin" element={<ProtectedRoute><AdminErrorBoundary><AdminLayout /></AdminErrorBoundary></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="my/home" element={<AdminHome />} />
            <Route path="my/about" element={<AdminAbout />} />
            <Route path="my/services" element={<AdminServices />} />
            <Route path="my/skills" element={<AdminSkills />} />
            <Route path="my/projects" element={<AdminProjects />} />
            <Route path="my/prices" element={<AdminPrices />} />
            <Route path="my/contact" element={<AdminContact />} />
            <Route path="my/feedback" element={<AdminFeedback />} />
            <Route path="my/team" element={<AdminTeam />} />
            <Route path="my/legal" element={<AdminLegal />} />
            <Route path="my/why-website" element={<AdminWhyWebsite />} />
            <Route path="service-details/:serviceId" element={<AdminServiceDetails />} />
            <Route path="project-details/:projectId" element={<AdminProjectDetails />} />
          </Route>

          {/* --- 404 Not Found Catch-all --- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Suspense fallback={null}>
        {!isAdminRoute && !isAuthRoute && <Footer />}
      </Suspense>
    </>
  );
}

export default App;
