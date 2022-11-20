import * as React from "react";
import styled from "styled-components";
import { API_URL } from "../env";
import { AnyFile, getFileType } from "../types/file";

interface FilePreviewerProps {
  file: AnyFile;
}
export function FilePreviewer({ file }: FilePreviewerProps) {
  if (file.type === "folder") {
    return <>{file.name}</>;
  }

  const fileType = getFileType(file);
  const downloadLink = `${API_URL}${file.url}`;
  switch (fileType) {
    case "txt":
    case "pdf":
      return <ScPreviewIframe src={downloadLink} />;

    default:
      return (
        <a download href={downloadLink} target="_blank" rel="noreferrer">
          {file.name}
        </a>
      );
  }
}

const ScPreviewIframe = styled.iframe`
  flex: 1;
`;
