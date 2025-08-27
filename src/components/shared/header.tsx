"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Bell, FileText, Sun, Moon } from "lucide-react";
import { useUser, type UserRole } from "@/context/user-context";
import { useNotification } from "@/context/notification-context";
import { Badge } from "../ui/badge";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const roleAvatars: Record<UserRole, string> = {
  'Product Manager': 'https://placehold.co/150x150/3B5998/FFFFFF.png',
  'Marketing Team': 'https://placehold.co/150x150/87CEEB/FFFFFF.png',
  'Data Scientist': 'https://placehold.co/150x150/222222/FFFFFF.png',
  'Administrator': 'https://placehold.co/150x150/777777/FFFFFF.png',
};

const roleAvatarHints: Record<UserRole, string> = {
  'Product Manager': 'roadmap logo',
  'Marketing Team': 'growth chart',
  'Data Scientist': 'data analysis',
  'Administrator': 'secure shield',
};

export function AppHeader() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const { notifications, markAsRead } = useNotification();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    setUser(null);
    router.push('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const avatarUrl = user?.avatar || (user ? roleAvatars[user.role] : 'https://placehold.co/150x150.png');
  const avatarHint = user ? roleAvatarHints[user.role] : 'abstract logo';
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6 lg:px-8 sticky top-0 z-10 animate-fade-in">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
      </div>
      <div className="flex items-center gap-4">
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover-lift animate-slide-up"
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}
        <DropdownMenu onOpenChange={(open) => { if (open && unreadCount > 0) markAsRead(); }}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full relative hover-lift">
              {unreadCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">
                  {unreadCount}
                </Badge>
              )}
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
            ) : (
              notifications.map(notif => (
                <DropdownMenuItem key={notif.id} asChild className="cursor-pointer">
                  <Link href={notif.href || '#'} className="flex gap-3 items-start">
                    <div className="mt-1"><FileText className="h-4 w-4 text-primary" /></div>
                    <div className="flex flex-col">
                      <p className="font-semibold">{notif.title}</p>
                      <p className="text-xs text-muted-foreground">{notif.message}</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full hover-lift">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} alt={user?.role} data-ai-hint={avatarHint} />
                <AvatarFallback>{user?.name?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}