'use client';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  showBack?: boolean;
  children?: React.ReactNode;
}

export function Header({ showBack = false, children }: HeaderProps) {
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
        {children}
        <ThemeToggle />
      </div>
    </header>
  );
}
