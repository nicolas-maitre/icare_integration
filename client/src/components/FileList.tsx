import * as React from "react";
import styled from "styled-components";

interface _BaseFile {
  type: unknown;
  name: string;
}
interface Folder extends _BaseFile {
  type: "folder";
  children: AnyFile[];
}
interface File extends _BaseFile {
  type: "file";
  subType: "pdf" | "word" | "text" | "excel" | "other"; //this is an example
}
export type AnyFile = Folder | File;

export interface FileListProps {
  files: AnyFile[];
}
export function FileList({ files }: FileListProps) {
  return <ScFilesList>{}</ScFilesList>;
}
interface InternalFileListProps {
  files: AnyFile[];
  indentLevel: number;
}
function InternalFileList({ files, indentLevel }: InternalFileListProps) {
  return (
    <>
      {files.map((file, index) => {
        return (
          <>
            <FileLine key={index} file={file} indentLevel={indentLevel} />
          </>
        );
      })}
    </>
  );
}

const ScFilesList = styled.ul`
  display: flex;
  flex-flow: column nowrap;
`;

interface FileLineProps {
  file: AnyFile;
  indentLevel?: number;
}
function FileLine({ file, indentLevel = 0 }: FileLineProps) {
  return (
    <ScFileLine style={{ "--indent-level": indentLevel } as any}>
      <i className="fa fa-file-pdf" />
      <p>{file.name}</p>
    </ScFileLine>
  );
}

const ScFileLine = styled.li`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 0.5em;
  p {
    margin: 0;
    /* flex: 1; */
  }
`;
