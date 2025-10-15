'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Columns, Home, PenSquare } from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/hiragana', label: 'Hiragana', icon: BookOpen },
  { href: '/katakana', label: 'Katakana', icon: PenSquare },
  { href: '/board', label: 'Board', icon: Columns },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <Link href={link.href} passHref legacyBehavior>
            <SidebarMenuButton
              asChild
              isActive={pathname === link.href}
              tooltip={link.label}
            >
              <link.icon />
              <span>{link.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
