import React, { useState } from 'react';
import { useApp } from './context/AppContext';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { Footer } from './components/layout/Footer';

// Landing Components
import { HeroSection } from './components/landing/HeroSection';
import { ValueStrip } from './components/landing/ValueStrip';
import { ProblemComparison } from './components/landing/ProblemComparison';
import { HowItWorks } from './components/landing/HowItWorks';
import { FeatureGrid } from './components/landing/FeatureGrid';
import { InteractivePreview } from './components/landing/InteractivePreview';
import { TelegramAlertPreview } from './components/landing/TelegramAlertPreview';
import { PricingSection } from './components/landing/PricingSection';
import { FaqSection } from './components/landing/FaqSection';
import { FinalCta } from './components/landing/FinalCta';

// Onboarding
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';

// Dashboard Views
import { OverviewTab } from './components/dashboard/OverviewTab';
import { WebsitesTab } from './components/dashboard/WebsitesTab';
import { AffiliateLinksTab } from './components/dashboard/AffiliateLinksTab';
import { BrokenLinksTab } from './components/dashboard/BrokenLinksTab';
import { CompetitorSpotterTab } from './components/dashboard/CompetitorSpotterTab';
import { AlertsTab } from './components/dashboard/AlertsTab';
import { ScanHistoryTab } from './components/dashboard/ScanHistoryTab';
import { SettingsTab } from './components/dashboard/SettingsTab';
import { BillingTab } from './components/dashboard/BillingTab';

// Modals
import { AuthModal } from './components/auth/AuthModal';
import { AddWebsiteModal } from './components/dashboard/AddWebsiteModal';
import { FixLinkModal } from './components/dashboard/FixLinkModal';
import { LinkDetailModal } from './components/dashboard/LinkDetailModal';
import { HeadlessRedirectModal } from './components/dashboard/HeadlessRedirectModal';
import { WhiteLabelPortalModal } from './components/dashboard/WhiteLabelPortalModal';
import { WebhookIntegrationsModal } from './components/dashboard/WebhookIntegrationsModal';
import { ScannerProgressModal } from './components/dashboard/ScannerProgressModal';
import { TelegramModal } from './components/dashboard/TelegramModal';
import { EmailPreviewModal } from './components/dashboard/EmailPreviewModal';
import { ToastContainer } from './components/common/ToastContainer';

export const App: React.FC = () => {
  const { activeView } = useApp();
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Landing Page View
  if (
    activeView === 'landing' ||
    activeView === 'pricing' ||
    activeView === 'features' ||
    activeView === 'how-it-works'
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF0F4] via-[#FFF5F8] to-white flex flex-col justify-between selection:bg-rose-500 selection:text-white">
        <Navbar />
        <main className="flex-grow">
          <HeroSection />
          <ValueStrip />
          <ProblemComparison />
          <HowItWorks />
          <FeatureGrid />
          <InteractivePreview />
          <TelegramAlertPreview />
          <PricingSection />
          <FaqSection />
          <FinalCta />
        </main>
        <Footer />

        {/* Global Modals & Toasts */}
        <AuthModal />
        <FixLinkModal />
        <TelegramModal />
        <ToastContainer />
      </div>
    );
  }

  // Onboarding Wizard View
  if (activeView === 'onboarding') {
    return (
      <>
        <OnboardingWizard />
        <ToastContainer />
      </>
    );
  }

  // Dashboard App View
  return (
    <div className="flex h-screen bg-[#FFF0F4] overflow-hidden selection:bg-rose-500 selection:text-white">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          searchQuery={globalSearchQuery}
          setSearchQuery={setGlobalSearchQuery}
        />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {activeView === 'dashboard' && <OverviewTab searchQuery={globalSearchQuery} />}
            {activeView === 'websites' && <WebsitesTab />}
            {activeView === 'links' && (
              <AffiliateLinksTab
                searchQuery={globalSearchQuery}
                setSearchQuery={setGlobalSearchQuery}
              />
            )}
            {activeView === 'broken' && <BrokenLinksTab searchQuery={globalSearchQuery} />}
            {activeView === 'competitors' && <CompetitorSpotterTab />}
            {activeView === 'alerts' && <AlertsTab />}
            {activeView === 'scans' && <ScanHistoryTab />}
            {activeView === 'settings' && <SettingsTab />}
            {activeView === 'billing' && <BillingTab />}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <AuthModal />
      <AddWebsiteModal />
      <FixLinkModal />
      <LinkDetailModal />
      <HeadlessRedirectModal />
      <WhiteLabelPortalModal />
      <WebhookIntegrationsModal />
      <ScannerProgressModal />
      <TelegramModal />
      <EmailPreviewModal />
      <ToastContainer />
    </div>
  );
};
