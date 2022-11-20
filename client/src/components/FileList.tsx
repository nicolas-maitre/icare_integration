import * as React from "react";
import { CSSProperties, useState } from "react";
import styled from "styled-components";
import { AnyFile, getFileType } from "../types/file";

export interface FileListProps {
  files: AnyFile[];
  onSelect?: (file: AnyFile) => void;
  selectedFile?: AnyFile;
}
export function FileList(props: FileListProps) {
  return (
    <ScFilesList>
      <InternalFileList {...props} indentLevel={0} />
    </ScFilesList>
  );
}
interface InternalFileListProps extends FileListProps {
  indentLevel: number;
}
function InternalFileList({
  files,
  indentLevel,
  selectedFile,
  onSelect,
}: InternalFileListProps) {
  return (
    <>
      {files.map((file) => (
        <FileLine
          key={file.id}
          file={file}
          indentLevel={indentLevel}
          selectedFile={selectedFile}
          onSelect={onSelect}
        />
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

const iconDictionary: Partial<Record<string | "folder" | "other", string>> = {
  folder: "folder",
  pdf: "file-pdf",
  other: "file",
};
interface FileLineProps {
  file: AnyFile;
  indentLevel?: number;
  selectedFile?: AnyFile;
  onSelect?: (file: AnyFile) => void;
}

function FileLine({
  file,
  indentLevel = 0,
  selectedFile,
  onSelect,
}: FileLineProps) {
  const isFolder = file.type === "folder";
  const [isOpen, setIsOpen] = useState(indentLevel < 1);
  const isSelected = file.id === selectedFile?.id;
  const fileType = getFileType(file);
  const iconClassPostfix =
    iconDictionary[fileType ?? "other"] ?? iconDictionary.other;

  return (
    <>
      <ScFileLine
        className={isSelected ? "selected-file" : ""}
        style={{ "--indent-level": indentLevel } as CSSProperties}
        onClick={(evt) => {
          evt.stopPropagation();
          setIsOpen(true);
          onSelect?.(file);
        }}
      >
        <i className={`type-icon fa fa-${iconClassPostfix}`} />
        <p>{file.name}</p>
        {isFolder && (
          <i
            className={`fa fa-caret-${isOpen ? "down" : "right"}`}
            onClick={(evt) => {
              evt.stopPropagation();
              setIsOpen(!isOpen);
            }}
          />
        )}
      </ScFileLine>
      {isOpen && file.type === "folder" && (
        <InternalFileList
          files={file.children}
          indentLevel={indentLevel + 1}
          selectedFile={selectedFile}
          onSelect={onSelect}
        />
      )}
    </>
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

  &.selected-file {
    background-color: #666;
    color: white;
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
