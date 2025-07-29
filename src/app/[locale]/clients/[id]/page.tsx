import ClientDetailHeader from "@/features/clients/components/clientdetail-header"
import ClientDetailTabs from "@/features/clients/components/clientdetail-tab"

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden space-y-4">
      <ClientDetailHeader />
      <div className="h-screen overflow-hidden flex flex-col">
        <ClientDetailTabs />
      </div>
    </div>
  );
}

