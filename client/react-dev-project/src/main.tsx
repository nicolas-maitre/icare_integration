import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import "./css/icare.min.css";
import "./css/jq-ui.min.css";
import "./css/fontawesome.min.css";
import { DocumentsTabContent } from "../../src/components/DocumentsTabContent";

ReactDOM.createRoot(
  document.getElementById("ui-id-doc-content") as HTMLElement
).render(
  <React.StrictMode>
    <DocumentsTabContent />
  </React.StrictMode>
);