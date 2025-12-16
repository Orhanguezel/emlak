// FILE: src/components/public/FloatingCallButton.tsx
import { Phone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useListSiteSettingsQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";

export function FloatingCallButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // 🔹 Site settings'ten telefon bilgilerini çek
  const { data: settings } = useListSiteSettingsQuery({
    keys: ["contact_phone_display", "contact_phone_tel"],
    limit: 20,
  });

  const getSetting = (key: string, fallback: string): string => {
    const found = settings?.find((s) => s.key === key);
    const v = found?.value;
    return typeof v === "string" && v.trim().length > 0 ? v : fallback;
  };

  // Seed fallback’leri
  const phoneDisplay = getSetting("contact_phone_display", "0533 483 89 71");
  const phoneTelRaw = getSetting("contact_phone_tel", "05334838971");
  const phoneNumber = phoneTelRaw.replace(/\s+/g, "");

  // Mobile ölçümünü SSR uyumlu yap
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 768;
  }, []);

  const buttonSize = isMobile ? 56 : 64;
  const buttonPadding = isMobile ? 14 : 16;
  const iconSize = isMobile ? 22 : 24;
  const bottomPosition = isMobile ? "20px" : "24px";
  const rightPosition = isMobile ? "20px" : "24px";

  const handleCall = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate?.([100, 50, 100]);
    }

    if (typeof window !== "undefined") {
      (window as any).gtag?.("event", "phone_call", {
        event_category: "engagement",
        event_label: "floating_call_button",
        phone_number: phoneNumber,
      });

      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const labelText = `Hemen Ara: ${phoneDisplay}`;

  const buttonContent = (
    <button
      onClick={handleCall}
      className="floating-call-button text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group animate-pulse hover:animate-none hover:opacity-90 mobile-button touch-manipulation"
      style={{
        backgroundColor: "#14b8a6",
        position: "fixed",
        bottom: bottomPosition,
        right: rightPosition,
        zIndex: 2147483647,
        width: `${buttonSize}px`,
        height: `${buttonSize}px`,
        padding: `${buttonPadding}px`,
        border: "none",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow:
          "0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)",
        transform: "translateZ(0)",
        willChange: "transform",
        isolation: "isolate",
        pointerEvents: "auto",
      }}
      aria-label={`Hemen Ara - ${phoneDisplay}`}
      title={labelText}
    >
      <Phone
        size={iconSize}
        style={{ color: "white", position: "relative", zIndex: 1 }}
      />

      {/* Tooltip */}
      <div
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ pointerEvents: "none" }}
      >
        {labelText}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
      </div>

      {/* Pulse rings */}
      <div
        className="absolute inset-0 rounded-full opacity-75 animate-ping"
        style={{ backgroundColor: "#14b8a6", pointerEvents: "none", zIndex: -1 }}
      />
      <div
        className="absolute inset-0 rounded-full opacity-50 animate-ping"
        style={{ backgroundColor: "#14b8a6", pointerEvents: "none", zIndex: -1 }}
      />
    </button>
  );

  return mounted ? createPortal(buttonContent, document.body) : null;
}
