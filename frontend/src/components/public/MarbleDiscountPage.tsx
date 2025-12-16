import { SimpleCampaignPage } from "./SimpleCampaignPage";

interface MarbleDiscountPageProps {
  onNavigate: (page: string) => void;
}

export function MarbleDiscountPage({ onNavigate }: MarbleDiscountPageProps) {
  return (
    <SimpleCampaignPage
      onNavigate={onNavigate}
      campaignId="marble-discount"
    />
  );
}