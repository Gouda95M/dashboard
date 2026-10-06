import { OverviewContent } from "@/components/OverviewContent";
import { PageHeader } from "@/components/layout/PageHeader";

export default function OverviewPage() {
  return (
    <>
      <PageHeader title="Overview" description="Here's what's happening with your business." />
      <OverviewContent />
    </>
  );
}
