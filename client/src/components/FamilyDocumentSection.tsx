import styled from "styled-components";
import * as React from "react";
import { FamilyIntegration } from "../integrations/familyIntegration";
import { SplitExplorer } from "./SplitExplorer";

export type FamilyDocumentSection = Pick<
  FamilyIntegration,
  "parentId" | "tabNotifContainer"
>;
export function FamilyDocumentSection({
  parentId,
  tabNotifContainer,
}: FamilyDocumentSection) {
  return (
    <ScFamilyDocumentSection>
      <SplitExplorer
        rootPath={`/people/${parentId}/family`}
        tabNotifContainer={tabNotifContainer}
      />
    </ScFamilyDocumentSection>
  );
}

export const ScFamilyDocumentSection = styled.div`
  width: 100%;
  padding: 0 15px;
`;
