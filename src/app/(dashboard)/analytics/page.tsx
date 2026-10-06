import { AnalyticsContent } from "@/components/AnalyticsContent";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata = { title: "Analytics · Dashboard" };

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader title="Analytics" description="Revenue, products and customers from your orders." />
      <AnalyticsContent />
    </>
  );
}
