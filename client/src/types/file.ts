import { z } from "zod";

const _ZodBaseFile = z.object({
  id: z.number(),
  type: z.unknown(),
  name: z.string(),
});

const _ZodFolder = _ZodBaseFile.extend({
  type: z.literal("folder"),
});
//with children, to avoid exploding typescript with recursive types
export const ZodFolder: z.ZodType<Folder> = _ZodFolder.extend({
  children: z.array(z.lazy(() => ZodAnyFile)),
});
export type Folder = z.infer<typeof _ZodFolder> & { children: AnyFile[] };

export const ZodFile = _ZodBaseFile.extend({
  type: z.literal("file"),
  url: z.string(),
  // mime_type: z.string(),
});
export type File = z.infer<typeof ZodFile>;

export const ZodAnyFile = z.union([ZodFile, ZodFolder]);
export type AnyFile = z.infer<typeof ZodAnyFile>;

export function getFileType(file: AnyFile) {
  const fileNameParts = file.name.split(".");
  return file.type === "folder"
    ? "folder"
    : fileNameParts.length > 1
    ? fileNameParts.at(-1)?.toLowerCase()
    : undefined;
}

export interface NewFile {
  type: "file";
  name: string;
  sub_path: string;
  data_index?: number;
  file_data: FileSystemFileEntry | undefined;
}
