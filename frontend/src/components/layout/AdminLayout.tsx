// src/components/layout/AdminLayout.tsx
"use client";

import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";

export type ActiveTab =
  | "dashboard"
  | "properties"
  | "sliders"
  | "pages"
  | "faqs"
  | "reviews"
  | "contacts"
  | "sitesettings"
  | "users"
  | "settings";

type AdminLayoutProps = {
  activeTab: ActiveTab;
  onTabChange: (v: ActiveTab) => void;
  onNavigateHome?: () => void;
  onNavigateLogin?: () => void;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
};

export default function AdminLayout({
  activeTab,
  onTabChange,
  onNavigateHome,
  onNavigateLogin,
  header,
  footer,
  children,
}: AdminLayoutProps) {
  return (
    <SidebarProvider
      className={[
        "bg-white text-gray-900 antialiased",
        "[--sidebar-background:222_33%_9%]",
        "[--sidebar-foreground:210_40%_96%]",
        "[--sidebar-primary:173_80%_40%]",
        "[--sidebar-accent:199_89%_48%]",
        "[--sidebar-border:0_0%_100%/0.08]",
      ].join(" ")}
    >
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        {...(onNavigateHome ? { onNavigateHome } : {})}
        {...(onNavigateLogin ? { onNavigateLogin } : {})}
      />

      <SidebarInset className="min-h-dvh flex flex-col">
        {header}
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="w-full px-4 py-6 sm:px-6">{children}</div>
        </main>
        {footer}
      </SidebarInset>
    </SidebarProvider>
  );
}
