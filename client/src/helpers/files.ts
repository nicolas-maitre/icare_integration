import { API_URL } from "../env";
import { AnyFile, File, NewFile } from "../types/file";

export function fileEntriesToNewFiles(entries: FileSystemEntry[]): NewFile[] {
  return entries.flatMap((entry) => {
    if (entry.isFile) {
      const sub_path = entry.fullPath.split("/").slice(0, -1).join("/");
      return [
        <NewFile>{
          name: entry.name,
          type: "file",
          sub_path,
          file_data: entry,
          // name:
        },
      ];
    }
    if (entry.isDirectory) {
      // return fileEntriesToNewFiles(entry.)
      throw new Error("folders are not supported yet");
    }
    throw new Error("unknown file type");
  });
}

export function getDownloadLink(file: File) {
  return `${API_URL}${file.url}`;
}

export function countFiles(files: AnyFile[]): number {
  return files.reduce(
    (prev, file) =>
      prev + (file.type === "folder" ? countFiles(file.children) : 1),
    0
  );
}
