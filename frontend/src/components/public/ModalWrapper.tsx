"use client";

import * as React from "react";
import { Button } from "../ui/button";

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string; // tailwind max-w-*
}

export function ModalWrapper({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-6xl",
}: ModalWrapperProps) {
  // ESC ile kapatma
  React.useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={[
          "relative w-full mx-4",
          maxWidth,
          "max-h-[90vh] overflow-hidden",
          "rounded-2xl bg-white shadow-2xl",
          "border border-slate-200",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-14 px-4 flex items-center justify-between bg-slate-950 text-white border-b border-white/10">
          <h2 className="text-base md:text-lg font-extrabold tracking-tight">
            {title}
          </h2>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/10 hover:text-white p-2"
            aria-label="Kapat"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-56px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
