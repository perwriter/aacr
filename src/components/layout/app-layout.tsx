import { Search } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarInput,
} from '@/components/ui/sidebar';
import { MainNav } from './main-nav';
import { Header } from './header';
import Image from 'next/image';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-4">
            <Image src="/logo.svg" alt="All American Assets" width={32} height={32} />
            <div>
              <p className="font-semibold text-lg">All American Assets</p>
              <p className="text-xs text-muted-foreground">Precious Metals & Gold IRAs</p>
            </div>
          </div>
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <SidebarInput placeholder="Search leads..." className="pl-8" />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter>
            {/* Can add footer items here */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 md:p-6 bg-muted/30">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
