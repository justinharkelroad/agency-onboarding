"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminAuth from "@/components/admin/AdminAuth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AdminAuth>
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 bottom-0 z-40">
        <div className="px-6 py-5 border-b border-gray-200">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AB</span>
            </div>
            <span className="font-semibold text-gray-900 text-lg">
              Agency Brain
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-gray-200">
          <Link
            href="/"
            className="text-gray-400 text-xs hover:text-gray-600 transition-colors"
          >
            ← View Onboarding Form
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64 min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
    </AdminAuth>
  );
}
