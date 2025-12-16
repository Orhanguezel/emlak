// =============================================================
// FILE: src/components/layout/AdminFooter.tsx
// =============================================================
"use client";

import { ChevronUp } from "lucide-react";

export default function AdminFooter() {
  const year = new Date().getFullYear();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer data-admin-footer className="w-full border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-screen-lg px-4 py-6">
        <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
          <span>© {year} mezarisim.com — Admin</span>
          <span className="opacity-40">•</span>
          <span>v1.0.0</span>
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Yukarı çık"
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-gray-600 hover:bg-gray-50"
          >
            <ChevronUp className="h-4 w-4" />
            Yukarı
          </button>
        </div>
      </div>
    </footer>
  );
}
