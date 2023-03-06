import styled from "styled-components";
import * as React from "react";
import { FamilyIntegration } from "../integrations/familyIntegration";
import { SplitExplorer } from "./SplitExplorer";

export type FamilyDocumentSection = Pick<FamilyIntegration, "parentId">;
export function FamilyDocumentSection({ parentId }: FamilyDocumentSection) {
  return (
    <ScFamilyDocumentSection>
      <SplitExplorer rootPath={`/people/${parentId}/family`} />
    </ScFamilyDocumentSection>
  );
}

export const ScFamilyDocumentSection = styled.div`
  width: 100%;
  padding: 0 15px;
`;
