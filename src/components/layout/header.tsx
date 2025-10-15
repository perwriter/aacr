'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';

const pageTitles: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/hiragana': 'Hiragana',
  '/katakana': 'Katakana',
  '/board': 'Interactive Board',
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? 'KanaFlow';

  return (
    <header className="sticky top-0 z-10 flex h-[60px] items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="flex md:hidden" />
      <div className="flex w-full items-center">
        <h1 className="font-headline text-2xl font-semibold text-primary">{title}</h1>
      </div>
    </header>
  );
}
