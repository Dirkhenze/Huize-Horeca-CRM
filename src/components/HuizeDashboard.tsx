import { useState } from 'react';
import { NavCategory } from '../lib/types';
import { TopBar } from './layout/TopBar';
import { Sidebar } from './layout/Sidebar';
import { UserMenu } from './layout/UserMenu';
import { Breadcrumbs } from './layout/Breadcrumbs';
import { useAuth } from '../contexts/AuthContext';

import { Offertes } from './pages/sales/Offertes';
import { Prijzen } from './pages/sales/Prijzen';
import { SalesAnalytics } from './pages/sales/SalesAnalytics';
import { PriceUpload } from './pages/sales/PriceUpload';
import { TeamPage } from './pages/common/TeamPage';

import { ArtikelenInvoeren } from './pages/inkoop/ArtikelenInvoeren';
import { Besteladvies } from './pages/inkoop/Besteladvies';

import { Autos } from './pages/logistiek/Autos';
import { Chauffeurs } from './pages/logistiek/Chauffeurs';
import { Routes } from './pages/logistiek/Routes';

import { Voorraad } from './pages/magazijn/Voorraad';
import { ArtikelenEnhanced as Artikelen } from './pages/magazijn/ArtikelenEnhanced';

import { Klantenorders } from './pages/verkoop/Klantenorders';
import { Facturen } from './pages/verkoop/Facturen';

import { TrendzDashboard } from './pages/trendz/TrendzDashboard';
import { TopKansen } from './pages/trendz/TopKansen';

import { Contacten } from './pages/contacten/Contacten';
import { Instellingen } from './pages/settings/Instellingen';
import { ArtikelveldenInstellingen } from './pages/settings/ArtikelveldenInstellingen';

export function HuizeDashboard() {
  const { signOut } = useAuth();
  const [activeCategory, setActiveCategory] = useState<NavCategory>('sales');
  const [activePage, setActivePage] = useState('offertes');
  const [menuOpen, setMenuOpen] = useState(false);

  const handlePageChange = (page: string) => {
    setActivePage(page);
  };

  const renderPage = () => {
    if (activePage === 'contacten') {
      return <Contacten />;
    }

    if (activePage === 'instellingen') {
      return <Instellingen />;
    }

    if (activePage === 'artikelvelden-instellingen') {
      return <ArtikelveldenInstellingen />;
    }

    if (activePage === 'team') {
      return <TeamPage category={activeCategory} />;
    }

    switch (activeCategory) {
      case 'sales':
        switch (activePage) {
          case 'offertes':
            return <Offertes />;
          case 'prijzen':
            return <Prijzen />;
          case 'price-upload':
            return <PriceUpload />;
          case 'analytics':
            return <SalesAnalytics />;
          default:
            return <Offertes />;
        }

      case 'inkoop':
        switch (activePage) {
          case 'artikelen-invoeren':
            return <ArtikelenInvoeren />;
          case 'besteladvies':
            return <Besteladvies />;
          default:
            return <ArtikelenInvoeren />;
        }

      case 'logistiek':
        switch (activePage) {
          case 'autos':
            return <Autos />;
          case 'chauffeurs':
            return <Chauffeurs />;
          case 'routes':
            return <Routes />;
          default:
            return <Autos />;
        }

      case 'magazijn':
        switch (activePage) {
          case 'voorraad':
            return <Voorraad />;
          case 'artikelen':
            return <Artikelen />;
          default:
            return <Voorraad />;
        }

      case 'verkoop':
        switch (activePage) {
          case 'klantenorders':
            return <Klantenorders />;
          case 'facturen':
            return <Facturen />;
          default:
            return <Klantenorders />;
        }

      case 'trendz':
        switch (activePage) {
          case 'top-kansen':
            return <TopKansen />;
          default:
            return <TrendzDashboard onNavigate={handlePageChange} />;
        }

      default:
        return <Offertes />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar
        activeCategory={activeCategory}
        onCategoryChange={(cat) => {
          setActiveCategory(cat);
          setActivePage(cat === 'trendz' ? 'trendz-dashboard' : 'offertes');
        }}
        onMenuToggle={() => setMenuOpen(true)}
      />

      <Sidebar
        activeCategory={activeCategory}
        activePage={activePage}
        onPageChange={handlePageChange}
      />

      <UserMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={handlePageChange}
        onLogout={signOut}
      />

      <main className="ml-64 mt-16 p-8">
        <Breadcrumbs category={activeCategory} page={activePage} />
        {renderPage()}
      </main>
    </div>
  );
}
