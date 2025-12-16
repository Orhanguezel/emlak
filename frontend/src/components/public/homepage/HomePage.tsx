"use client";

import { HomeLeftColumn } from "./HomeLeftColumn";
import { HomeRightColumn } from "./HomeRightColumn";

type Props = {
  onNavigate?: (page: string) => void;
  onOpenRecentWorkModal?: (payload: { id: string; slug?: string }) => void;
  onOpenCampaignsModal?: (payload?: any) => void;
  onOpenAnnouncementModal?: (payload?: any) => void;
};

export function HomePage({
  onOpenRecentWorkModal,
  onOpenCampaignsModal,
  onOpenAnnouncementModal,
}: Props = {}) {
  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* ============ SOL SÜTUN ============ */}
          <div className="order-2 lg:order-1 space-y-8">
            <HomeLeftColumn onOpenRecentWorkModal={onOpenRecentWorkModal} />
          </div>

          {/* ============ SAĞ SÜTUN ============ */}
          <div className="order-1 lg:order-2 space-y-8">
            <HomeRightColumn
              onOpenCampaignsModal={onOpenCampaignsModal}
              onOpenAnnouncementModal={onOpenAnnouncementModal}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
