/* eslint-disable react/react-in-jsx-scope */
import ReactDOM from "react-dom/client";
import "./css/index.css";
import "./css/icare.min.css";
import "./css/jq-ui.min.css";
import "./css/fontawesome.min.css";
import { DocumentsTabContent } from "../../src/components/DocumentsTabContent";
import { useState } from "react";

ReactDOM.createRoot(
  document.getElementById("ui-id-doc-content") as HTMLElement
).render(<App />);

function App() {
  const [personId, setPersonId] = useState(1);
  const [contractNumber, setContractNumber] = useState(1);
  return (
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
      <DocumentsTabContent
        personId={personId}
        contractNumber={contractNumber}
      />
    </>
  );
}
