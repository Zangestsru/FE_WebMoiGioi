import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { StatusModal } from '../ui/StatusModal';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * MainLayout - Wraps pages with common Navbar and Footer.
 * Rule: DRY UI (Rule 4).
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      {/* Add margin top for fixed navbar behavior if needed, or handle in CSS */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-[80px]">
        {children}
      </main>

      <Footer />
      
      {/* Global Modals/Notifications */}
      <StatusModal />
    </div>
  );
}
