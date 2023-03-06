import * as React from "react";
import { FamilyIntegration } from "../integrations/familyIntegration";

export type FamilyDocumentSection = Pick<FamilyIntegration, "parentId">;
export function FamilyDocumentSection({ parentId }: FamilyDocumentSection) {
  return <>WIP...</>;
}
