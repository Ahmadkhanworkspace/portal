'use client';

import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || status === 'loading') {
    return (
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Comet Portal</h1>
        <div className="flex items-center gap-4">
          <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

  if (!session?.user) return null;

  const user = session.user;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-800">Comet Portal</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-700">{user.name || user.email}</span>
        <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-md font-medium">
          {user.role}
        </span>
        <button
          onClick={handleLogout}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

