import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname
import { useTranslation } from "react-i18next"; // Import useTranslation
import { Home, Users, Settings } from "lucide-react"; // Example icons

// Define navigation items with icons and labels
const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

/**
 * Renders the main sidebar navigation for the admin dashboard.
 * It displays dynamic links with icons, applies active styling based on the current route,
 * and supports internationalization for labels.
 */
export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="">{t("Admin Dashboard")}</span> {/* Translated */}
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary
                    ${isActive ? "bg-muted text-primary" : "text-muted-foreground"}
                  `}
                >
                  <item.icon className="h-4 w-4" /> {/* Render icon */}
                  {t(item.label)} {/* Translated */}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
