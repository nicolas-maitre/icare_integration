import * as React from "react";
import { useRef, useState } from "react";
import styled from "styled-components";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { AnyFile, ZodAnyFile } from "../types/file";
import { FileList } from "./FileList";
import { EdgeResizer } from "./SplitResizer";
import { z } from "zod";
import { FilePreviewer } from "./FilePreviewer";
import { API_URL } from "../env";

const queryClient = new QueryClient();
export function DocumentsTabContent(props: DocumentsTabContentProps) {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <DocumentsTabContentContent {...props} />
      </QueryClientProvider>
    </React.StrictMode>
  );
}

function useContractFiles(personId: number, contractId: number) {
  return useQuery(
    ["personContractFiles", personId, contractId],
    async () => {
      const tmpRes = await fetch(
        `${API_URL}/people/${personId}/contracts/${contractId}/files`
      );
      if (!tmpRes.ok) throw new Error();

      return z.array(ZodAnyFile).parse(await tmpRes.json());
    },
    { retry: false }
  );
}

interface DocumentsTabContentProps {
  personId: number;
  contractId: number;
}
export function DocumentsTabContentContent({
  personId,
  contractId,
}: DocumentsTabContentProps) {
  const {
    data: files,
    isLoading,
    isError,
  } = useContractFiles(personId, contractId);
  const filesPanelRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<AnyFile | undefined>();
  return (
    <>
      <ScDocumentsTabContent>
        <ScFilesPanel
          ref={filesPanelRef}
          onClick={() => setSelectedFile(undefined)}
        >
          {isLoading ? (
            "Chargement..."
          ) : isError ? (
            "Une erreur s'est produite..."
          ) : !files?.length ? (
            "Aucuns fichiers."
          ) : (
            <FileList
              files={files ?? []}
              selectedFile={selectedFile}
              onSelect={setSelectedFile}
            />
          )}
        </ScFilesPanel>
        <EdgeResizer elementRef={filesPanelRef} />
        <ScPreviewPanel>
          {selectedFile ? (
            <FilePreviewer file={selectedFile} />
          ) : (
            <>Sélectionnez un fichier sur le panneau de gauche.</>
          )}
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
  min-height: max(400px, 60vh);
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
