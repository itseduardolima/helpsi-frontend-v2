"use client";

import { Button } from "@/src/components/ui/button";
import { Users, Brain, LogOut, Settings, Home } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    
  },
  {
    title: "Usuários",
    href: "/admin/users",
    icon: Users,
  
  },
  {
    title: "Especialidades",
    href: "/admin/specialties",
    icon: Brain,
    
  },
  {
    title: "Configurações",
    href: "/admin/settings",
    icon: Settings,
    
  }
];

export function Sidebar() {
  const { signOut } = useAuth();
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-main to-primary-dark bg-clip-text text-black">
          Helpsi Admin
        </h1>
        <Brain className="h-6 w-6" />
        </div>
        <p className="text-sm text-gray-500 mt-1">Painel de Controle</p>
      </div>

      <nav className="flex-1 mt-3">
        <div className="px-4 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 h-12 mt-2 transition-all duration-200",
                    isActive(item.href) && `bg-gradient-to-br from-green-50 to-emerald-50 text-green-600  hover:text-green-600`
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 h-12 transition-all duration-200"
          onClick={signOut}
        >
          <LogOut className="h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );
} 