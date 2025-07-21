
'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { Home, UserPlus, LogIn, PlusSquare, Users, LogOut, Settings, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import React, { useState } from 'react';

export default function Header() {
  const { user, logout, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const commonNavLinks = (
    <>
      <Link href="/" passHref>
        <Button variant="ghost" className="flex items-center gap-1 justify-start w-full" onClick={() => setIsMobileMenuOpen(false)}>
          <Home size={18} /> Home
        </Button>
      </Link>
      {user && (
         <>
          <Link href="/submit-profile" passHref>
            <Button variant="ghost" className="flex items-center gap-1 justify-start w-full" onClick={() => setIsMobileMenuOpen(false)}>
              <PlusSquare size={18} /> Submit Profile
            </Button>
          </Link>
          <Link href="/profiles" passHref>
            <Button variant="ghost" className="flex items-center gap-1 justify-start w-full" onClick={() => setIsMobileMenuOpen(false)}>
              <Users size={18} /> View Profiles
            </Button>
          </Link>
        </>
      )}
    </>
  )

  return (
    <header className="bg-card shadow-md sticky top-0 z-50 no-print">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
          <Logo className="h-8 w-auto text-primary" />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {commonNavLinks}
          {isLoading ? (
            <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
          ) : user ? (
             <UserMenu user={user} logout={logout} />
          ) : (
            <>
              <Link href="/login" passHref>
                <Button variant="ghost" className="flex items-center gap-1">
                  <LogIn size={18} /> Login
                </Button>
              </Link>
              <Link href="/signup" passHref>
                <Button className="flex items-center gap-1">
                 <UserPlus size={18} /> Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 pt-8">
                 {isLoading ? (
                  <div className="space-y-4">
                    <div className="h-8 w-full bg-muted rounded animate-pulse"></div>
                    <div className="h-8 w-full bg-muted rounded animate-pulse"></div>
                  </div>
                 ) : user ? (
                  <>
                    <div className="px-4">
                       <p className="text-lg font-medium leading-none">{user.name || user.email}</p>
                       <p className="text-sm leading-none text-muted-foreground">
                         {user.email}
                       </p>
                    </div>
                    <DropdownMenuSeparator/>
                    {commonNavLinks}
                    <DropdownMenuSeparator/>
                    <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-accent" onClick={() => setIsMobileMenuOpen(false)}>
                        <Settings size={18} /> Dashboard
                    </Link>
                    <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 cursor-pointer p-2 rounded-md text-red-600 hover:!text-red-600 focus:!text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:!text-red-400 dark:focus:!text-red-400 dark:focus:!bg-red-900/50 text-left">
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                 ) : (
                  <>
                    {commonNavLinks}
                    <DropdownMenuSeparator />
                    <Link href="/login" passHref>
                       <Button variant="ghost" className="flex items-center gap-1 justify-start w-full" onClick={() => setIsMobileMenuOpen(false)}>
                         <LogIn size={18} /> Login
                       </Button>
                    </Link>
                    <Link href="/signup" passHref>
                       <Button className="flex items-center gap-1 justify-start w-full" onClick={() => setIsMobileMenuOpen(false)}>
                         <UserPlus size={18} /> Sign Up
                       </Button>
                    </Link>
                  </>
                 )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function UserMenu({ user, logout }: { user: NonNullable<ReturnType<typeof useAuth>['user']>, logout: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://placehold.co/100x100.png?text=${user.name?.[0] || 'U'}`} alt={user.name || 'User'} data-ai-hint="avatar person" />
            <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
           <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
              <Settings size={16} /> Dashboard
           </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="flex items-center gap-2 cursor-pointer text-red-600 hover:!text-red-600 focus:!text-red-600 focus:!bg-red-50 dark:text-red-400 dark:hover:!text-red-400 dark:focus:!text-red-400 dark:focus:!bg-red-900/50">
          <LogOut size={16} /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
