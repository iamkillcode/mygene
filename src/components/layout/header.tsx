'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { Home, UserPlus, LogIn, PlusSquare, Users, LogOut, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { user, logout, isLoading } = useAuth();

  return (
    <header className="bg-card shadow-md sticky top-0 z-50 no-print">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
          <Logo className="h-8 w-auto text-primary" />
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/" passHref>
            <Button variant="ghost" className="flex items-center gap-1">
              <Home size={18} /> Home
            </Button>
          </Link>
          {isLoading ? (
            <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
          ) : user ? (
            <>
              <Link href="/submit-profile" passHref>
                <Button variant="ghost" className="flex items-center gap-1">
                  <PlusSquare size={18} /> Submit Profile
                </Button>
              </Link>
              <Link href="/profiles" passHref>
                <Button variant="ghost" className="flex items-center gap-1">
                  <Users size={18} /> View Profiles
                </Button>
              </Link>
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
            </>
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
      </div>
    </header>
  );
}
