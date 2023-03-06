import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { createPortal } from "react-dom";
import { ContractIntegration } from "../integrations/contractPageIntegration";
import { ContractDocumentsTab } from "./ContractDocumentsTab";

const queryClient = new QueryClient();

type AppProps = {
  contractIntegration?: ContractIntegration;
};
export function App({ contractIntegration }: AppProps) {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        {contractIntegration &&
          createPortal(
            <ContractDocumentsTab {...contractIntegration} />,
            contractIntegration.container
          )}
      </QueryClientProvider>
    </React.StrictMode>
  );
}
