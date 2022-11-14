import * as React from "react";
import { useRef, useState } from "react";
import styled from "styled-components";
import { AnyFile, FileList } from "./FileList";
import { EdgeResizer } from "./SplitResizer";
// import { FileLine } from "./FileList";

const testFiles: AnyFile[] = [
  { id: 1, type: "file", name: "cool-file-1.pdf", subType: "pdf" },
  { id: 2, type: "file", name: "cool-file-2.pdf", subType: "pdf" },
  { id: 3, type: "file", name: "cool-file-3.doc", subType: "word" },
  {
    id: 4,
    type: "folder",
    name: "important",
    children: [
      {
        id: 5,
        type: "file",
        name: "important-file-1.doc",
        subType: "word",
      },
      { id: 6, type: "file", name: "important-file-2.doc", subType: "word" },
      { id: 7, type: "file", name: "important-file-3.doc", subType: "word" },
    ],
  },
  { id: 8, type: "file", name: "cool-file-4.xls", subType: "excel" },
  {
    id: 9,
    type: "folder",
    name: "archive",
    children: [
      { id: 10, type: "file", name: "archive-file-1.doc", subType: "word" },
      { id: 11, type: "file", name: "archive-file-2.doc", subType: "word" },
      { id: 12, type: "file", name: "archive-file-3.doc", subType: "word" },
      {
        id: 13,
        type: "folder",
        name: "2020",
        children: [
          { id: 14, type: "file", name: "vieux-1.doc", subType: "word" },
          { id: 15, type: "file", name: "vieux-2.doc", subType: "word" },
          { id: 16, type: "file", name: "vieux-3.doc", subType: "word" },
        ],
      },
    ],
  },
];

export function DocumentsTabContent() {
  const [files, setFiles] = useState(testFiles);
  const filesPanelRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <ScDocumentsTabContent>
        <ScFilesPanel ref={filesPanelRef}>
          <FileList files={files} />
        </ScFilesPanel>
        <EdgeResizer elementRef={filesPanelRef} />
        <ScPreviewPanel>
          Sélectionnez un fichier sur le panneau de gauche.
        </ScPreviewPanel>
      </ScDocumentsTabContent>
      <br />
      <i className="fa fa-exclamation-triangle" /> L'onglet "Documents" ne fait
      pas partie de kibe-iCare et n'est donc pas maintenu par CSE
    </>
  );
}

const ScDocumentsTabContent = styled.div`
  display: flex;
  flex-flow: row nowrap;
  max-height: max(500px, 90vh);
  /* gap: 10px; */
  /* &,* {box-sizing: border-box;} */
`;

const ScPanel = styled.div`
  background: white;
  box-shadow: 0 0 10px #0006;
  padding: 10px;
`;
const ScFilesPanel = styled(ScPanel)`
  /* flex: 1;
  max-width: max(200px, 25%); */
  min-width: 200px;
  overflow: hidden;
  overflow-y: auto;
`;
const ScPreviewPanel = styled(ScPanel)`
  flex: 3;
  //for text
  display: flex;
  justify-content: center;
  flex-flow: column;
  text-align: center;
  font-size: 2em;
  color: #666;
`;
