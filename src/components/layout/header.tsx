'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useSidebar } from '@/components/ui/sidebar';

const pageTitles: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/prospects': 'Prospects',
  '/clients': 'Clients',
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? 'Dashboard';
  const { state } = useSidebar();

  return (
    <header className="sticky top-0 z-10 flex h-[60px] items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className={`flex ${state === 'expanded' ? 'md:hidden' : ''}`} />
      <div className="flex w-full items-center">
        <h1 className="font-semibold text-2xl">{title}</h1>
      </div>
    </header>
  );
}
