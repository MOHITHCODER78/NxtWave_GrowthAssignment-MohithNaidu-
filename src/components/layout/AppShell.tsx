import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ActiveTab } from '@/types';

interface AppShellProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenWorkshopModal: () => void;
  onNavigateSection?: (sectionId: string) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  onSelectTab,
  onOpenWorkshopModal,
  onNavigateSection,
  children,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Background subtle radial glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-[600px] -right-40 w-[500px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full" />
      </div>

      <Navbar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onOpenWorkshopModal={onOpenWorkshopModal}
        onNavigateSection={onNavigateSection}
      />

      <main className="flex-1 relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>

      <Footer />
    </div>
  );
};
