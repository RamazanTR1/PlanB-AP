import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import DarkModeToggle from "../dark-mode-toggle";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
  User,
  Settings,
  Tag,
  Handshake,
  Briefcase,
  Wrench,
  Sliders,
  Bell,
  BellRing,
  Users2,
  Contact,
} from "lucide-react";
import { useState } from "react";
import { useLoginState } from "@/hooks/use-login-state";
import { useMe } from "@/hooks/use-user";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarCategory {
  title: string;
  items: SidebarItem[];
}

const sidebarCategories: SidebarCategory[] = [
  {
    title: "Ana Sayfa",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Kullanıcı Yönetimi",
    items: [
      {
        title: "Kullanıcılar",
        href: "/users",
        icon: Users,
      },
      {
        title: "Takım Üyeleri",
        href: "/team-members",
        icon: Users2,
      },
    ],
  },
  {
    title: "İçerik Yönetimi",
    items: [
      {
        title: "Portfolyolar",
        href: "/portfolios",
        icon: Briefcase,
      },
      {
        title: "Hizmetler",
        href: "/services",
        icon: Wrench,
      },
      {
        title: "Partnerler",
        href: "/partners",
        icon: Handshake,
      },
      {
        title: "Etiketler",
        href: "/tags",
        icon: Tag,
      },
      {
        title: "Slider",
        href: "/sliders",
        icon: Sliders,
      },
    ],
  },
  {
    title: "İletişim & Bildirimler",
    items: [
      {
        title: "İletişim",
        href: "/contacts",
        icon: Contact,
      },
      {
        title: "Bildirimler",
        href: "/notifications",
        icon: Bell,
      },
      {
        title: "Bildirim Abonelikleri",
        href: "/notification-subscribers",
        icon: BellRing,
      },
    ],
  },
  {
    title: "Sistem",
    items: [
      {
        title: "Ayarlar",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const { logout } = useLoginState();
  const { data: user, isLoading: isLoadingUser } = useMe();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed left-4 top-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
        >
          {isMobileOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 transform border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-800",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-center border-b border-gray-200 px-6 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                <LayoutDashboard className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                PlanB Admin Panel
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4 md:space-y-2 md:px-4 md:py-6">
            {sidebarCategories.map((category) => (
              <div key={category.title}>
                <h3 className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 md:mb-2 md:px-3">
                  {category.title}
                </h3>
                {category.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "flex items-center space-x-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors md:space-x-3 md:px-3 md:py-2 md:text-sm",
                        isActive
                          ? "bg-black text-white"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-3.5 w-3.5 md:h-4 md:w-4",
                          isActive ? "text-white" : "text-gray-500",
                        )}
                      />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="space-y-2 border-t border-gray-200 p-2 dark:border-gray-700 md:space-y-3 md:p-4">
            {/* User Info */}
            {isLoadingUser ? (
              <div className="flex items-center space-x-2 rounded-lg bg-gray-50 px-2 py-1.5 dark:bg-gray-700 md:space-x-3 md:px-3 md:py-2">
                <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200 md:h-8 md:w-8"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-2.5 animate-pulse rounded bg-gray-200 md:h-3"></div>
                  <div className="h-2 w-2/3 animate-pulse rounded bg-gray-200"></div>
                </div>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-2 rounded-lg bg-gray-50 px-2 py-1.5 dark:bg-gray-700 md:space-x-3 md:px-3 md:py-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black md:h-8 md:w-8">
                  <User className="h-3 w-3 text-white md:h-4 md:w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-gray-900 dark:text-white md:text-sm">
                    {user.username}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Dark Mode Toggle */}
            <DarkModeToggle className="w-full justify-start dark:border-none" />

            <Button
              onClick={handleLogout}
              variant="outline"
              className="h-8 w-full justify-start space-x-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:border-none dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white md:h-10 md:space-x-3 md:text-sm"
            >
              <LogOut className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="truncate">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
