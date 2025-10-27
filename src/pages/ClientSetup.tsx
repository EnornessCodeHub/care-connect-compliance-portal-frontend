import { useParams, useLocation, Navigate } from "react-router-dom";
import { ClientSetupWizard } from "@/components/ClientSetupWizard";

export default function ClientSetup() {
  const { clientId } = useParams<{ clientId: string }>();
  const location = useLocation();
  
  if (!clientId) {
    return <Navigate to="/clients" replace />;
  }

  const clientName = location.state?.clientName || "New Client";

  return (
    <ClientSetupWizard 
      clientId={clientId} 
      clientName={clientName}
    />
  );
}