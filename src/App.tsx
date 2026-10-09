/**
 * The Sewing Bird – Children's Clothing Boutique Catalogue
 */

import React from 'react';
import { CatalogueProvider, useCatalogue } from './context/CatalogueContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/home/HeroSection';
import { CategoryGrid } from './components/home/CategoryGrid';
import { FeaturedOutfits } from './components/home/FeaturedOutfits';
import { InstagramGallery } from './components/home/InstagramGallery';
import { CataloguePage } from './components/catalogue/CataloguePage';
import { ProductDetailPage } from './components/product/ProductDetailPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AboutPage } from './components/home/AboutPage';
import { ContactPage } from './components/home/ContactPage';
import { QuickViewModal } from './components/common/QuickViewModal';
import { EnquiryModal } from './components/common/EnquiryModal';
import { SearchModal } from './components/common/SearchModal';
import { WishlistDrawer } from './components/common/WishlistDrawer';
import { AdminAuthModal } from './components/common/AdminAuthModal';
import { ToastContainer } from './components/common/ToastContainer';
import { BackToTop } from './components/common/BackToTop';

const AppContent: React.FC = () => {
  const { currentView } = useCatalogue();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#24272D] font-sans selection:bg-[#FAD4C0] selection:text-[#3B1F17]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection />
            <CategoryGrid />
            <FeaturedOutfits />
            <InstagramGallery />
          </>
        )}

        {currentView === 'catalogue' && <CataloguePage />}

        {currentView === 'product-detail' && <ProductDetailPage />}

        {currentView === 'admin' && <AdminDashboard />}

        {currentView === 'about' && <AboutPage />}

        {currentView === 'contact' && <ContactPage />}
      </main>

      {/* Footer (displayed on customer views) */}
      {currentView !== 'admin' && <Footer />}

      {/* Modals & Overlays */}
      <QuickViewModal />
      <EnquiryModal />
      <SearchModal />
      <WishlistDrawer />
      <AdminAuthModal />
      <ToastContainer />
      <BackToTop />
    </div>
  );
};

export default function App() {
  return (
    <CatalogueProvider>
      <AppContent />
    </CatalogueProvider>
  );
}
