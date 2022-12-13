import * as React from "react";
import styled from "styled-components";
import { getDownloadLink } from "../helpers/files";
import { AnyFile, getFileType } from "../types/file";

interface FilePreviewerProps {
  file: AnyFile;
}
export function FilePreviewer({ file }: FilePreviewerProps) {
  if (file.type === "folder") {
    return <>{file.name}</>;
  }

  const fileType = getFileType(file);
  const downloadLink = getDownloadLink(file);
  switch (fileType) {
    case "txt":
    case "pdf":
    case "jpg":
    case "png":
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
