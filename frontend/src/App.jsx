import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import api from './api/client';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/dashboard/Sidebar';
import { WorkspaceHeader } from './components/dashboard/WorkspaceHeader';
import { DashboardView } from './components/dashboard/DashboardView';
import { LinksPage } from './components/dashboard/LinksPage';
import { AnalyticsView } from './components/dashboard/AnalyticsView';
import { QrCodesPage } from './components/dashboard/QrCodesPage';
import { SettingsPage } from './components/dashboard/SettingsPage';
import { QuickCreateModal } from './components/dashboard/QuickCreateModal';
import { AnalyticsModal } from './components/dashboard/AnalyticsModal';
import { QrModal } from './components/dashboard/QrModal';
import { EditLinkModal } from './components/dashboard/EditLinkModal';
import { Toast } from './components/common/Toast';

export function App() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Active workspace tab: 'dashboard' | 'links' | 'analytics' | 'qr-codes' | 'settings'
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const [links, setLinks] = useState([]);
  const [linksLoading, setLinksLoading] = useState(false);

  const [activeAnalyticsLink, setActiveAnalyticsLink] = useState(null);
  const [activeQrLink, setActiveQrLink] = useState(null);
  const [activeEditLink, setActiveEditLink] = useState(null);

  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: 'success' });
    }, 3500);
  };

  const loadLinks = useCallback(async () => {
    if (!isAuthenticated) return;
    setLinksLoading(true);
    try {
      const res = await api.get('/api/links');
      setLinks(res.data);
    } catch (e) {
      // ignore
    } finally {
      setLinksLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadLinks();
    } else {
      setLinks([]);
      setCurrentTab('dashboard');
    }
  }, [isAuthenticated, loadLinks]);

  const handleLinkCreated = (newLink) => {
    setLinks((prev) => [newLink, ...prev]);
  };

  const handleLinkUpdated = (updatedLink) => {
    setLinks((prev) => prev.map((l) => (l.id === updatedLink.id ? updatedLink : l)));
  };

  const handleToggleActive = async (id) => {
    try {
      const res = await api.patch(`/api/links/${id}/toggle`);
      setLinks((prev) => prev.map((l) => (l.id === id ? res.data : l)));
      showToast(res.data.active ? 'Link enabled' : 'Link paused', 'info');
    } catch (e) {
      showToast('Failed to toggle status', 'error');
    }
  };

  const handleDeleteLink = async (id) => {
    try {
      await api.delete(`/api/links/${id}`);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      showToast('Link permanently deleted', 'success');
    } catch (e) {
      showToast('Failed to delete link', 'error');
    }
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setCurrentTab('dashboard');
    showToast('Welcome to LinkForge!', 'success');
    loadLinks();
  };

  // If user is unauthenticated, show the Landing Page
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-200">
        {/* Background hero radial glow & grid pattern */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-gradient-hero" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-grid" />

        {/* Landing Page Navbar */}
        <Navbar onOpenAuth={handleOpenAuth} />

        {/* Landing Page Body (Presentation only; no shortener functionality except header) */}
        <main className="relative z-10">
          <LandingPage onOpenAuth={handleOpenAuth} />
        </main>

        {/* Auth Modal for Login / Registration */}
        <AuthModal
          isOpen={authModalOpen}
          initialMode={authModalMode}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />

        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      </div>
    );
  }

  // When authenticated, render full SaaS Workspace with Sidebar layout
  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Background radial glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[480px] bg-gradient-hero opacity-60" />

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        linksCount={links.length}
        onOpenQuickCreate={() => setQuickCreateOpen(true)}
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      {/* Main Content Area (Offset by sidebar width on desktop) */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Workspace Top Header */}
        <WorkspaceHeader
          currentTab={currentTab}
          onOpenQuickCreate={() => setQuickCreateOpen(true)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Dynamic Page Views based on Sidebar Selection */}
        <main className="flex-1 pb-16 relative z-10">
          {currentTab === 'dashboard' && (
            <DashboardView
              links={links}
              linksLoading={linksLoading}
              onLinkCreated={handleLinkCreated}
              onLinkUpdated={handleLinkUpdated}
              onToggleActive={handleToggleActive}
              onDeleteLink={handleDeleteLink}
              onOpenAnalytics={setActiveAnalyticsLink}
              onOpenQr={setActiveQrLink}
              onOpenEdit={setActiveEditLink}
              onShowToast={showToast}
              onTabChange={setCurrentTab}
            />
          )}

          {currentTab === 'links' && (
            <LinksPage
              links={links}
              linksLoading={linksLoading}
              onCopy={(url) => showToast('Copied to clipboard!', 'info')}
              onOpenAnalytics={setActiveAnalyticsLink}
              onOpenQr={setActiveQrLink}
              onOpenEdit={setActiveEditLink}
              onToggleActive={handleToggleActive}
              onDelete={handleDeleteLink}
              onOpenQuickCreate={() => setQuickCreateOpen(true)}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView
              links={links}
              onRequireAuth={() => handleOpenAuth('login')}
            />
          )}

          {currentTab === 'qr-codes' && (
            <QrCodesPage
              links={links}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              linksCount={links.length}
              onShowToast={showToast}
            />
          )}
        </main>

        {/* Workspace Footer */}
        <footer className="border-t border-border py-6 px-6 text-center text-xs text-muted-foreground relative z-10">
          © 2026 LinkForge Enterprise · High-Performance URL Shortener & Analytics
        </footer>
      </div>

      {/* Quick Forge Modal (Available from any page in the workspace) */}
      <QuickCreateModal
        isOpen={quickCreateOpen}
        onClose={() => setQuickCreateOpen(false)}
        onLinkCreated={handleLinkCreated}
        onOpenQr={setActiveQrLink}
        onShowToast={showToast}
      />

      {/* QR Code Modal */}
      <QrModal
        isOpen={!!activeQrLink}
        link={activeQrLink}
        onClose={() => setActiveQrLink(null)}
        onShowToast={showToast}
      />

      {/* Individual Link Analytics Modal */}
      <AnalyticsModal
        isOpen={!!activeAnalyticsLink}
        link={activeAnalyticsLink}
        onClose={() => setActiveAnalyticsLink(null)}
      />

      {/* Edit Link Modal */}
      <EditLinkModal
        isOpen={!!activeEditLink}
        link={activeEditLink}
        onClose={() => setActiveEditLink(null)}
        onLinkUpdated={handleLinkUpdated}
        onShowToast={showToast}
      />

      {/* System Toast Alerts */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}

export default App;
