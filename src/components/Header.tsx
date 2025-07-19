'use client';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { ArrowLeft, PanelRight, PanelLeft } from 'lucide-react';
import { SidebarTrigger, useSidebar } from './ui/sidebar';

interface HeaderProps {
  showBack?: boolean;
  showSidebarToggle?: boolean;
}

function HeaderContent({ showBack, showSidebarToggle }: HeaderProps) {
    const sidebar = showSidebarToggle ? useSidebar() : null;

    return (
      <header className="flex h-16 items-center justify-between px-4 md:px-6 border-b shrink-0">
        <div className="flex items-center gap-4">
          {showBack && (
             <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="w-5 h-5" />
                <span className="sr-only">Back to templates</span>
              </Link>
            </Button>
          )}
          <Link href="/" className="text-xl font-bold font-headline hover:text-primary transition-colors">
            GenEdit
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {showSidebarToggle && sidebar && (
            <SidebarTrigger>
              {sidebar.open ? <PanelRight /> : <PanelLeft />}
            </SidebarTrigger>
          )}
          <ThemeToggle />
        </div>
      </header>
    )
}


export function Header({ showBack = false, showSidebarToggle = false }: HeaderProps) {
  return <HeaderContent showBack={showBack} showSidebarToggle={showSidebarToggle} />;
}
