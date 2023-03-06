import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../env";
import { z } from "zod";
import { AnyFile, NewFile, ZodAnyFile } from "../types/file";
import { useRef, useState } from "react";
import * as React from "react";
import styled from "styled-components";
import { fileEntriesToNewFiles } from "../helpers/files";
import { FileList } from "./FileList";
import { EdgeResizer } from "./SplitResizer";
import { FilePreviewer } from "./FilePreviewer";

export function useFiles(rootPath: string) {
  return useQuery(
    ["files", rootPath],
    async () => {
      const tmpRes = await fetch(`${API_URL}${rootPath}/files`);
      if (!tmpRes.ok) throw new Error("fetch error " + tmpRes.statusText);

      return z.array(ZodAnyFile).parse(await tmpRes.json());
    },
    { retry: false }
  );
}

export function useUploadFiles(rootPath: string) {
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

      const res = await fetch(`${API_URL}/${rootPath}/files`, {
        method: "POST",
        body,
      });

      if (!res.ok) {
        throw new Error("file upload fail " + res.statusText);
      }
    },
    {
      onSettled() {
        queryClient.invalidateQueries(["files", rootPath]);
      },
    }
  );
}

type SplitExplorerProps = {
  rootPath: string;
};
export function SplitExplorer({ rootPath }: SplitExplorerProps) {
  const { data: files, isLoading, isError } = useFiles(rootPath);
  const { mutate: triggerFileUpload } = useUploadFiles(rootPath);
  const filesPanelRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<AnyFile | undefined>();
  return (
    <>
      <ScSplitExplorer>
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

            triggerFileUpload(
              { newFiles },
              {
                onError(err: Error) {
                  console.error(err);
                  alert(
                    "Une erreur s'est produite durant l'envoi des fichiers"
                  );
                },
              }
            );
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
      </ScSplitExplorer>
      <br />
      <i className="fa fa-exclamation-triangle" /> La partie "Documents" ne fait
      pas partie de cse.kibe-iCare et n'est donc pas maintenue par CSE
    </>
  );
}

const ScSplitExplorer = styled.div`
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
