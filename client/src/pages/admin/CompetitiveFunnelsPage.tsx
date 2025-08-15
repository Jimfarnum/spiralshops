import AdminTechWatchFunnels from "@/components/AdminTechWatchFunnels";

export default function CompetitiveFunnelsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Competitive Funnel Intelligence</h1>
        <p className="text-muted-foreground">
          Automated analysis and insights from competitor shopping funnels to optimize SPIRAL's conversion flow.
        </p>
      </div>
      <AdminTechWatchFunnels />
    </div>
  );
}