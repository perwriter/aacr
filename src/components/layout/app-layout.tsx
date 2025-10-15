import { Search, PanelLeft } from 'lucide-react';
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
import { Button } from '../ui/button';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
                <Image src="/logo.svg" alt="All American Assets" width={32} height={32} />
                <div className="group-data-[collapsed=icon]:hidden">
                    <p className="font-semibold text-lg">All American Assets</p>
                    <p className="text-xs text-muted-foreground">Precious Metals & Gold IRAs</p>
                </div>
            </div>
            <SidebarTrigger className="group-data-[collapsed=icon]:hidden">
              <PanelLeft />
            </SidebarTrigger>
          </div>
          <div className="p-2 group-data-[collapsed=icon]:p-0 group-data-[collapsed=icon]:pt-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-data-[collapsed=icon]:left-1/2 group-data-[collapsed=icon]:-translate-x-1/2" />
              <SidebarInput placeholder="Search leads..." className="pl-8 group-data-[collapsed=icon]:hidden" />
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
