// =============================================================
// FILE: src/components/layout/AdminHeader.tsx
// =============================================================
"use client";

import { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

type AdminHeaderProps = {
  onBackHome: () => void;
};

export default function AdminHeader({ onBackHome }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="relative flex h-14 w-full items-center px-4 sm:px-6">
        <SidebarTrigger className="text-gray-700 transition-colors hover:text-gray-900" />

        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-gray-600 hover:text-gray-900"
            onClick={onBackHome}
          >
            ← Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    </header>
  );
}
