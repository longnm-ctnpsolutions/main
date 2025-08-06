
import { ClientDashboard } from "@/features/clients/components/client-list/client-dashboard";
import { ClientsProvider } from "@/shared/context/clients-context";

export default function ClientsPage() {
  return (
    <ClientsProvider>
      <ClientDashboard />
    </ClientsProvider>
  )
}
