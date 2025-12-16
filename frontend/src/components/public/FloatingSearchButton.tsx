// src/components/public/FloatingSearchButton.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";

/* ---------------- Suggestions Hook (debounced + abort) ---------------- */
type Suggestion = { id: string; title: string; image?: string | null };

function useProductSuggestions(q: string, open: boolean) {
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const query = q.trim();
    if (!query) {
      setItems([]);
      return;
    }

    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        // BE: /api/products?q=...&limit=5 (gerekirse kendi endpoint’ine uyarlayabilirsin)
        const u = `/api/products?q=${encodeURIComponent(query)}&limit=5`;
        const res = await fetch(u, { signal: ctrl.signal, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json() as any[];

        // BE alan adlarını projene göre eşle (ör: name/slug/image_effective_url)
        const mapped: Suggestion[] = (Array.isArray(json) ? json : []).map((r) => ({
          id: String(r.id ?? r.slug ?? r.uuid ?? r._id ?? crypto.randomUUID()),
          title: String(r.name ?? r.title ?? "-"),
          image: r.image_effective_url ?? r.image_url ?? null,
        }));

        setItems(mapped);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 200); // debounce

    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q, open]);

  return { items, loading };
}

/* ---------------- Component ---------------- */
type Props = {
  onSearch: (q: string) => void;
  initialTerm?: string;
  hotkey?: string; // default: "k" (Ctrl/⌘+K)
};

export function FloatingSearchButton({ onSearch, initialTerm = "", hotkey = "k" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [q, setQ] = useState(initialTerm);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // SSR guard
  useEffect(() => setMounted(true), []);

  // Body scroll lock
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen, mounted]);

  // Hotkey: Ctrl/⌘ + K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMeta = e.ctrlKey || e.metaKey;
      if (isMeta && e.key.toLowerCase() === hotkey) {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hotkey]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 0);
  }, [isOpen]);

  // Mobile ölçüm
  const isMobile = useMemo(() => (typeof window !== "undefined" ? window.innerWidth <= 768 : false), []);
  const buttonSize = isMobile ? 56 : 64;

  // Öneriler
  const { items: suggestions, loading } = useProductSuggestions(q, isOpen);

  // Recent terms
  const RECENT_KEY = "mt_recent_searches";
  const getRecents = (): string[] => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
  };
  const pushRecent = (term: string) => {
    const arr = [term, ...getRecents().filter((t) => t !== term)].slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(arr));
  };

  const runSearch = (term?: string) => {
    const value = (term ?? q).trim();
    if (!value) return;
    // analytics (opsiyonel)
    (window as any).gtag?.("event", "search", {
      search_term: value,
      event_category: "engagement",
      event_label: "floating_search_button",
    });
    pushRecent(value);
    onSearch(value);
    setIsOpen(false);
    setQ("");
  };

  const onOverlayClick = () => setIsOpen(false);
  const onToggle = () => {
    setIsOpen((v) => !v);
    if (isOpen) setQ("");
  };

  const modal = (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onOverlayClick} />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ürün Arama"
        className="fixed top-1/2 left-1/2 z-50 w-11/12 max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium text-slate-800">Ürün Arama</h3>
          <button onClick={onToggle} className="p-1 hover:bg-gray-100 rounded" aria-label="Kapat">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
              placeholder="Aradığınız ürün adını yazınız..."
              className="flex-1 px-3 py-2 border-2 rounded focus:outline-none focus:border-emerald-500"
              style={{ borderColor: "#334155" }}
              autoFocus
            />
            <button
              onClick={() => runSearch()}
              className="text-white px-4 py-2 rounded hover:opacity-90 transition-all"
              style={{ backgroundColor: "#334155" }}
            >
              ARA
            </button>
          </div>

          {/* Suggestions / Recents */}
          <div className="mt-4 space-y-2">
            {q.trim().length === 0 ? (
              <>
                <div className="text-xs text-slate-500">Son aramalar</div>
                <div className="flex flex-wrap gap-2">
                  {getRecents().map((t) => (
                    <button
                      key={t}
                      onClick={() => runSearch(t)}
                      className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Popüler aramalar: <span className="opacity-80">Mezar taşı, Baş taşı, Çiçeklendirme</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-xs text-slate-500">Öneriler</div>
                <div className="divide-y rounded border">
                  {loading && <div className="p-3 text-sm text-slate-500">Yükleniyor…</div>}
                  {!loading && suggestions.length === 0 && (
                    <div className="p-3 text-sm text-slate-500">Sonuç bulunamadı</div>
                  )}
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => runSearch(s.title)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 text-left"
                    >
                      {s.image ? (
                        <img
                          src={s.image}
                          alt={s.title}
                          className="w-10 h-10 rounded object-cover border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-slate-100 border" />
                      )}
                      <span className="text-sm text-slate-800">{s.title}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
            <div>İpucu: <kbd className="px-1 py-0.5 border rounded">ESC</kbd> ile kapat</div>
            <div>Kısayol: <kbd className="px-1 py-0.5 border rounded">{navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}</kbd>+<kbd className="px-1 py-0.5 border rounded">{hotkey.toUpperCase()}</kbd></div>
          </div>
        </div>
      </div>
    </>
  );

  const fab = (
    <button
      onClick={onToggle}
      className="fixed bottom-6 right-6 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-30 group hover:opacity-90"
      style={{ backgroundColor: "#334155", width: buttonSize, height: buttonSize }}
      aria-label="Ürün Ara"
      title="Ürün Ara"
    >
      <Search size={24} />
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Ürün Ara
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
      </div>
    </button>
  );

  if (!mounted) return null;
  return (
    <>
      {createPortal(fab, document.body)}
      {isOpen && createPortal(modal, document.body)}
    </>
  );
}
