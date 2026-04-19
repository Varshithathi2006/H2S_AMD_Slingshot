"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { ShoppingCart, User, LogOut, LayoutDashboard, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LanguageToggle from "./LanguageToggle";

export default function Navbar() {
  const { data: session } = useSession();
  const t = useTranslations("nav");

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-purple-600 p-1.5 rounded-lg">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">ShopMind</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-sm font-medium hover:text-purple-600 transition-colors">
            {t("products")}
          </Link>
          <Link href="/chat" className="text-sm font-medium hover:text-purple-600 transition-colors">
            Ask AI
          </Link>
          {session?.user.role === "ADMIN" && (
            <Link href="/admin/dashboard" className="text-sm font-medium hover:text-purple-600 transition-colors">
              {t("admin")}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <LanguageToggle />
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
            </Button>
          </Link>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="w-5 h-5" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={
                  <Link href="/orders" className="cursor-pointer">
                    {t("orders")}
                  </Link>
                } />
                {session.user.role === "ADMIN" && (
                  <DropdownMenuItem render={
                    <Link href="/admin/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  } />
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">{t("login")}</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">{t("signup")}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
