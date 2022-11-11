import React from "react";
import ReactDOM from "react-dom/client";
import "./fonts/index.css";
import "./fonts/icare.css";
import "./fonts/jq-ui.css";
import "./fonts/fontawesome.css";
import { DocumentsTabContent } from "../../src/components/DocumentsTabContent";

ReactDOM.createRoot(
  document.getElementById("ui-id-doc-content") as HTMLElement
).render(
  <React.StrictMode>
    <DocumentsTabContent />
  </React.StrictMode>
);
