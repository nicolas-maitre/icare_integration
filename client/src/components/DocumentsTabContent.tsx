import * as React from "react";
import styled from "styled-components";
// import { FileLine } from "./FileList";

interface DocumentsTabContentProps {}
export function DocumentsTabContent({}: DocumentsTabContentProps) {
  return (
    <>
      <ScDocumentsTabContent>
        <ScFilesPanel>
          {/* <ScFilesList>
            {[...Array(10)].map((_, i) => (
              <FileLine key={i} name={`random${i}.pdf`} />
            ))}
          </ScFilesList> */}
        </ScFilesPanel>
        <ScPreviewPanel></ScPreviewPanel>
      </ScDocumentsTabContent>
      <br />
      <i className="fa fa-exclamation-triangle" /> L'onglet "Documents" ne fait
      pas partie de kibe-iCare et n'est pas maintenu par CSE
    </>
  );
}

const ScDocumentsTabContent = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 10px;
  /* &,* {box-sizing: border-box;} */
`;

const ScPanel = styled.div`
  background: white;
  box-shadow: 0 0 10px #0006;
  padding: 10px;
`;
const ScFilesPanel = styled(ScPanel)`
  flex: 1;
`;
const ScPreviewPanel = styled(ScPanel)`
  flex: 3;
`;
