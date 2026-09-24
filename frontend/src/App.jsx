import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { SihDemoModal } from './components/SihDemoModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { EntityDashboardPage } from './pages/EntityDashboardPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { SentimentPage } from './pages/SentimentPage';
import { DemographicsPage } from './pages/DemographicsPage';
import { TrendsPage } from './pages/TrendsPage';
import { NetworkPage } from './pages/NetworkPage';
import { PropagationPage } from './pages/PropagationPage';
import { TimelinePage } from './pages/TimelinePage';
import { AlertsPage } from './pages/AlertsPage';
import { ArchitecturePage } from './pages/ArchitecturePage';

export function App() {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [entityQuery, setEntityQuery] = useState('Virat Kohli');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [dateRange, setDateRange] = useState('24h');

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSihDemoOpen, setIsSihDemoOpen] = useState(false);

  // Keyboard shortcut for command-K search
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateTo = (path, extraQuery = '') => {
    if (extraQuery) setEntityQuery(extraQuery);
    setCurrentRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchEntity = (query) => {
    setEntityQuery(query);
    setCurrentRoute('/entity');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render main route content
  const renderContent = () => {
    switch (currentRoute) {
      case '/':
        return <LandingPage navigateTo={navigateTo} onStartSihDemo={() => setIsSihDemoOpen(true)} />;
      case '/dashboard':
        return <DashboardPage navigateTo={navigateTo} />;
      case '/entity':
        return (
          <EntityDashboardPage
            entityQuery={entityQuery}
            navigateTo={navigateTo}
            onSearchEntity={handleSearchEntity}
          />
        );
      case '/sources':
        return <DataSourcesPage onRefreshData={() => {}} />;
      case '/sentiment':
        return <SentimentPage />;
      case '/demographics':
        return <DemographicsPage />;
      case '/trends':
        return <TrendsPage />;
      case '/network':
        return <NetworkPage />;
      case '/propagation':
        return <PropagationPage />;
      case '/timeline':
        return <TimelinePage />;
      case '/alerts':
        return <AlertsPage />;
      case '/architecture':
        return <ArchitecturePage />;
      default:
        return <DashboardPage navigateTo={navigateTo} />;
    }
  };

  // If on landing page `/`, render clean hero view without sidebar/topbar shell
  if (currentRoute === '/') {
    return (
      <>
        <LandingPage navigateTo={navigateTo} onStartSihDemo={() => setIsSihDemoOpen(true)} />
        <SihDemoModal
          isOpen={isSihDemoOpen}
          onClose={() => setIsSihDemoOpen(false)}
          navigateTo={navigateTo}
        />
        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          navigateTo={navigateTo}
          onSearchEntity={handleSearchEntity}
        />
      </>
    );
  }

  // Application Workspace Shell
  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex">
      {/* Workspace Navigation Sidebar */}
      <Sidebar currentRoute={currentRoute} navigateTo={navigateTo} />

      {/* Top Controls Header */}
      <Topbar
        selectedPlatform={selectedPlatform}
        setSelectedPlatform={setSelectedPlatform}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onOpenSearch={() => setIsSearchOpen(true)}
        onStartSihDemo={() => setIsSihDemoOpen(true)}
        onRefreshData={() => {}}
      />

      {/* Workspace Main Content View */}
      <main className="flex-1 ml-64 pt-16 min-h-screen overflow-x-hidden">
        {renderContent()}
      </main>

      {/* Global Modals */}
      <SihDemoModal
        isOpen={isSihDemoOpen}
        onClose={() => setIsSihDemoOpen(false)}
        navigateTo={navigateTo}
      />
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        navigateTo={navigateTo}
        onSearchEntity={handleSearchEntity}
      />
    </div>
  );
}

export default App;
