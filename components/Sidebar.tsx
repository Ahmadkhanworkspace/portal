'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Bell, Network, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getPermissions } from '@/lib/permissions';

interface SidebarProps {
  requestCount?: number;
}

export default function Sidebar({ requestCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRole = session?.user?.role as 'Admin' | 'Supervisor' | 'User' | undefined;
  const permissions = userRole ? getPermissions(userRole) : null;

  const allNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: null },
    { href: '/forms', label: 'Forms', icon: FileText, permission: 'canManageForms' as const },
    { href: '/requests', label: 'Requests', icon: Bell, badge: requestCount, permission: 'canManageRequests' as const },
    { href: '/ip-management', label: 'IP Management', icon: Network, permission: 'canManageIPs' as const },
    { href: '/user-management', label: 'User Management', icon: Users, permission: 'canManageUsers' as const },
  ];

  // Filter nav items based on permissions
  const navItems = allNavItems.filter(item => {
    if (!item.permission) return true; // Dashboard is always visible
    if (!permissions) return false;
    return permissions[item.permission];
  });

  // Prevent hydration mismatch - usePathname can differ on server/client
  if (!mounted) {
    return (
      <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-md bg-blue-50"
              >
                <Icon size={20} />
                <span className="font-medium text-blue-700">{item.label}</span>
              </div>
            );
          })}
        </nav>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

