import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { createPortal } from "react-dom";
import { ContractIntegration } from "../integrations/contractIntegration";
import { FamilyIntegration } from "../integrations/familyIntegration";
import { ContractDocumentsTab } from "./ContractDocumentsTab";
import { FamilyDocumentSection } from "./FamilyDocumentSection";

const queryClient = new QueryClient();

type AppProps = {
  contractIntegration: ContractIntegration | null;
  familyIntegration: FamilyIntegration | null;
};
export function App({ contractIntegration, familyIntegration }: AppProps) {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        {contractIntegration &&
          createPortal(
            <ContractDocumentsTab {...contractIntegration} />,
            contractIntegration.container
          )}
        {familyIntegration &&
          createPortal(
            <FamilyDocumentSection {...familyIntegration} />,
            familyIntegration.container
          )}
      </QueryClientProvider>
    </React.StrictMode>
  );
}
