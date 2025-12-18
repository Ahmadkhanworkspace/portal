'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

/**
 * Floating chat shortcut anchored bottom-right.
 */
export default function ChatFab() {
  return (
    <Link
      href="/chat"
      aria-label="Open chat"
      className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-500/30 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
    >
      <MessageCircle size={22} />
    </Link>
  );
}

