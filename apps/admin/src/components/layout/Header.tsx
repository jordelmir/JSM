import Link from "next/link";
import { CircleUser, Menu, Package2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTranslation } from "react-i18next"; // New import
import { useAuthStore } from "@gasolinera-jsm/shared/store/authStore"; // New import
import { usePathname } from "next/navigation"; // Needed for active link styling in mobile nav

// Define navigation items for mobile menu (consistent with Sidebar)
const mobileNavItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/users", label: "Users" },
  { href: "/dashboard/settings", label: "Settings" },
];

/**
 * Renders the main header bar for the admin dashboard.
 * It includes a mobile navigation menu, a search bar, and a user dropdown menu.
 * Supports internationalization for all displayed texts and integrates with authentication for logout functionality.
 */
export function Header() {
  const { t } = useTranslation();
  const logout = useAuthStore((state) => state.logout);
  const pathname = usePathname(); // For active link styling in mobile nav

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">{t("Toggle navigation menu")}</span> {/* Translated */}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">{t("Admin Dashboard")}</span> {/* Translated */}
            </Link>
            {mobileNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground
                    ${isActive ? "bg-muted text-foreground" : ""}
                  `}
                >
                  {t(item.label)} {/* Translated */}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("Search products...")} {/* Translated */}
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">{t("Toggle user menu")}</span> {/* Translated */}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("My Account")}</DropdownMenuLabel> {/* Translated */}
          <DropdownMenuSeparator />
          <DropdownMenuItem>{t("Settings")}</DropdownMenuItem> {/* Translated */}
          <DropdownMenuItem>{t("Support")}</DropdownMenuItem> {/* Translated */}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()}>{t("Logout")}</DropdownMenuItem> {/* Translated and connected */}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
