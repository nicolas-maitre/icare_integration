import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ContractDocumentsTab } from "../../src/components/ContractDocumentsTab";
import { FamilyDocumentSection } from "../../src/components/FamilyDocumentSection";
import "./css/index.css";
import "./css/icare.min.css";
import "./css/jq-ui.min.css";
import "./css/fontawesome.min.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(
  document.getElementById("ui-id-doc-content") as HTMLElement
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function App() {
  const tabs = ["contract", "family", "person"] as const;
  const [selectedTab, setSelectedTab] =
    useState<typeof tabs[number]>("contract");

  const [personId, setPersonId] = useState(1);
  const [contractNumber, setContractNumber] = useState(1);
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        {tabs.map((tab) => (
          <button
            onClick={() => setSelectedTab(tab)}
            key={tab}
            style={selectedTab === tab ? { fontWeight: "bold" } : undefined}
          >
            {tab}
          </button>
        ))}
      </div>
      {selectedTab === "contract" && (
        <>
          <label htmlFor="personIdInput" />
          <label htmlFor="contractNumInput" />
          <input
            id="personIdInput"
            type="number"
            value={personId}
            onChange={(e) => setPersonId(e.currentTarget.valueAsNumber)}
          />
          <input
            id="contractNumInput"
            type="number"
            value={contractNumber}
            onChange={(e) => setContractNumber(e.currentTarget.valueAsNumber)}
          />
          <ContractDocumentsTab
            personId={personId}
            contractNumber={contractNumber}
          />
        </>
      )}
      {selectedTab === "family" && (
        <>
          <label htmlFor="parentIdInput" />
          <input
            id="parentIdInput"
            type="number"
            value={personId}
            onChange={(e) => setPersonId(e.currentTarget.valueAsNumber)}
          />
          <FamilyDocumentSection parentId={personId} />
        </>
      )}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
