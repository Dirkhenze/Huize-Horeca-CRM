import { useState } from 'react';
import { NavCategory } from '../lib/types';
import { TopBar } from './layout/TopBar';
import { Sidebar } from './layout/Sidebar';
import { UserMenu } from './layout/UserMenu';
import { Breadcrumbs } from './layout/Breadcrumbs';
import { useAuth } from '../contexts/AuthContext';

import { Offertes } from './pages/sales/Offertes';
import PrijzenWithTabs from './pages/sales/PrijzenWithTabs';
import Analytics from './pages/sales/Analytics';

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
import LeadManagement from './pages/contacten/LeadManagement';
import { AccountmanagersPage } from './pages/contacten/AccountmanagersPage';
import SalesTeamPage from './pages/contacten/SalesTeamPage';
import SupplierAccountManagersPage from './pages/contacten/SupplierAccountManagersPage';
import { Instellingen } from './pages/settings/Instellingen';
import { ArtikelveldenInstellingen } from './pages/settings/ArtikelveldenInstellingen';
import { Tools } from './pages/settings/Tools';

export function HuizeDashboard() {
  const { signOut } = useAuth();
  const [activeCategory, setActiveCategory] = useState<NavCategory>('sales');
  const [activePage, setActivePage] = useState('sales-team');
  const [menuOpen, setMenuOpen] = useState(false);

  const handlePageChange = (page: string) => {
    if (page === 'contacten') {
      setActiveCategory('contacten');
      setActivePage('klanten');
    } else {
      setActivePage(page);
    }
  };

  const renderPage = () => {
    if (activePage === 'contacten') {
      setActiveCategory('contacten');
      setActivePage('klanten');
      return <Contacten />;
    }

    if (activePage === 'instellingen') {
      return <Instellingen />;
    }

    if (activePage === 'artikelvelden-instellingen') {
      return <ArtikelveldenInstellingen />;
    }

    if (activePage === 'tools') {
      return <Tools />;
    }

    switch (activeCategory) {
      case 'sales':
        switch (activePage) {
          case 'sales-team':
            return <SalesTeamPage />;
          case 'lead-management':
            return <LeadManagement />;
          case 'prijzen':
            return <PrijzenWithTabs />;
          case 'offertes':
            return <Offertes />;
          case 'marketing':
            return <div className="text-center py-12 text-gray-500">Marketing pagina - coming soon</div>;
          case 'analytics':
            return <Analytics />;
          case 'accountmanagers-leveranciers':
            return <SupplierAccountManagersPage />;
          default:
            return <SalesTeamPage />;
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

      case 'contacten':
        switch (activePage) {
          case 'klanten':
            return <Contacten />;
          case 'leveranciers':
            return <Contacten />;
          default:
            return <Contacten />;
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
          if (cat === 'sales') {
            setActivePage('sales-team');
          } else if (cat === 'trendz') {
            setActivePage('trendz-dashboard');
          } else if (cat === 'contacten') {
            setActivePage('klanten');
          } else if (cat === 'inkoop') {
            setActivePage('artikelen-invoeren');
          } else if (cat === 'logistiek') {
            setActivePage('autos');
          } else if (cat === 'magazijn') {
            setActivePage('voorraad');
          } else if (cat === 'verkoop') {
            setActivePage('klantenorders');
          }
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
