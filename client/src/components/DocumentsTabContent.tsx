import * as React from "react";
import { useRef, useState } from "react";
import styled from "styled-components";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AnyFile, NewFile, ZodAnyFile } from "../types/file";
import { FileList } from "./FileList";
import { EdgeResizer } from "./SplitResizer";
import { z } from "zod";
import { FilePreviewer } from "./FilePreviewer";
import { API_URL } from "../env";
import { fileEntriesToNewFiles } from "../helpers/files";

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

function useUploadContractFiles(personId: number, contractId: number) {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ newFiles }: { newFiles: NewFile[] }) => {
      const body = new FormData();
      body.append(
        "files_json",
        JSON.stringify(
          newFiles.map((file, index) => ({
            ...file,
            file_data: undefined,
            data_index: index,
          }))
        )
      );
      const fileFiles = await Promise.all(
        newFiles.map(
          (file) =>
            new Promise<File>((res, rej) => {
              if (!file.file_data) rej();
              else file.file_data?.file(res, rej);
            })
        )
      );
      fileFiles.forEach((file) => {
        body.append("files", file);
      });

      console.log("body", body);

      const res = await fetch(
        `${API_URL}/people/${personId}/contracts/${contractId}/files`,
        {
          method: "POST",
          body,
        }
      );

      if (!res.ok) {
        alert("Une erreur s'est produite durant l'envoi des fichiers");
      }
    },
    {
      onSettled() {
        queryClient.invalidateQueries([
          "personContractFiles",
          personId,
          contractId,
        ]);
      },
    }
  );
}

interface DocumentsTabContentProps {
  personId: number;
  contractNumber: number;
}
export function DocumentsTabContentContent({
  personId,
  contractNumber,
}: DocumentsTabContentProps) {
  const {
    data: files,
    isLoading,
    isError,
  } = useContractFiles(personId, contractNumber);
  const { mutate: triggerFileUpload } = useUploadContractFiles(
    personId,
    contractNumber
  );
  const filesPanelRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<AnyFile | undefined>();
  return (
    <>
      <ScDocumentsTabContent>
        <ScFilesPanel
          ref={filesPanelRef}
          onClick={() => setSelectedFile(undefined)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const items = [...e.dataTransfer.items].flatMap((item) => {
              const itemEntry = item.webkitGetAsEntry();
              return itemEntry ? [itemEntry] : [];
            });
            const newFiles = fileEntriesToNewFiles(items);
            console.log(items, newFiles);
            if (
              !confirm(`Êtes vous sûr de vouloir envoyer le(s) fichier(s) ?`)
            ) {
              return;
            }
            triggerFileUpload({ newFiles });
          }}
        >
          {isLoading ? (
            "Chargement..."
          ) : isError ? (
            "Une erreur s'est produite..."
          ) : !files?.length ? (
            "Aucun fichier."
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
