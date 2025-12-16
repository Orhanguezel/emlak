import { SimpleCampaignPage } from "./SimpleCampaignPage";

interface FamilyTombPackagePageProps {
  onNavigate: (page: string) => void;
}

export function FamilyTombPackagePage({ onNavigate }: FamilyTombPackagePageProps) {
  return (
    <SimpleCampaignPage
      onNavigate={onNavigate}
      campaignId="family-tomb-package"
    />
  );
}