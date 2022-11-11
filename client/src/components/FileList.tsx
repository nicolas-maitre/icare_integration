import * as React from "react";
import { CSSProperties } from "react";
import styled from "styled-components";

interface _BaseFile {
  id: number;
  type: unknown;
  name: string;
}
interface Folder extends _BaseFile {
  type: "folder";
  children: AnyFile[];
}

type FileSubTypes = "pdf" | "word" | "excel" | "other"; //this is an example
interface File extends _BaseFile {
  type: "file";
  subType: FileSubTypes;
}
export type AnyFile = Folder | File;

export interface FileListProps {
  files: AnyFile[];
}
export function FileList({ files }: FileListProps) {
  return (
    <ScFilesList>
      <InternalFileList files={files} indentLevel={0} />
    </ScFilesList>
  );
}
interface InternalFileListProps {
  files: AnyFile[];
  indentLevel: number;
}
function InternalFileList({ files, indentLevel }: InternalFileListProps) {
  return (
    <>
      {files.map((file, index) => (
        <React.Fragment key={file.id}>
          <FileLine key={index} file={file} indentLevel={indentLevel} />
          {file.type === "folder" && (
            <InternalFileList
              files={file.children}
              indentLevel={indentLevel + 1}
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
}

const ScFilesList = styled.ul`
  display: flex;
  flex-flow: column nowrap;
  padding: 0;
  margin: 0;
  /* gap: 0.5em; */
`;

const iconBySubType: Partial<Record<FileSubTypes | "folder", string>> = {
  folder: "folder",
  pdf: "file-pdf",
  other: "file",
};
interface FileLineProps {
  file: AnyFile;
  indentLevel?: number;
}

function FileLine({ file, indentLevel = 0 }: FileLineProps) {
  const isFolder = file.type === "folder";
  const isOpen = true;
  const iconClassPostfix =
    file.type === "folder"
      ? iconBySubType.folder
      : iconBySubType[file.subType] ?? iconBySubType.other;

  return (
    <ScFileLine style={{ "--indent-level": indentLevel } as CSSProperties}>
      <i className={`type-icon fa fa-${iconClassPostfix}`} />
      <p>{file.name}</p>
      {isFolder && <i className={`fa fa-caret-${isOpen ? "down" : "right"}`} />}
    </ScFileLine>
  );
}

const ScFileLine = styled.li`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 0.5em;
  padding: 0.5em;
  padding-left: calc(var(--indent-level) * 1em);
  border-radius: 0.3em;

  cursor: pointer;
  :hover {
    background: #0003;
  }

  i.type-icon {
    margin-left: 0.5em;
  }

  p {
    margin: 0;
    flex: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;
