import React from 'react';
import { Toaster } from 'sonner';
import { StoreProvider } from './contexts/StoreContext';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ScrollDirector } from './components/cinematic/ScrollDirector';
import { CollectionsSection } from './components/store/CollectionsSection';
import { ShopSection } from './components/store/ShopSection';
import { BrandStory } from './components/store/BrandStory';
import { SupportSection } from './components/store/SupportSection';
import { CartDrawer } from './components/store/CartDrawer';
import { SearchOverlay } from './components/store/SearchOverlay';
import { ProductDetailModal } from './components/store/ProductDetailModal';

export function App() {
  return (
    <StoreProvider>
      <div className="relative min-h-screen w-full bg-charcoal font-sans text-charcoal antialiased">
        <AnimatedBackground />
        <Header />
        <main className="relative z-10">
          <ScrollDirector />
          <CollectionsSection />
          <ShopSection />
          <BrandStory />
          <SupportSection />
        </main>
        <Footer />
        <CartDrawer />
        <SearchOverlay />
        <ProductDetailModal />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: { background: '#211B18', color: '#F7F1E5', border: '1px solid rgba(213, 173, 87, 0.3)' }
          }} />
        
      </div>
    </StoreProvider>);

}