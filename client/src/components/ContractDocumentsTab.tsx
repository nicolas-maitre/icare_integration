import * as React from "react";
import { ContractIntegration } from "../integrations/contractIntegration";
import { SplitExplorer } from "./SplitExplorer";

export type ContractDocumentsTabProps = Pick<
  ContractIntegration,
  "personId" | "contractNumber" | "tabNotifContainer"
>;

export function ContractDocumentsTab({
  personId,
  contractNumber,
  tabNotifContainer,
}: ContractDocumentsTabProps) {
  return (
    <SplitExplorer
      rootPath={`/people/${personId}/contracts/${contractNumber}`}
      tabNotifContainer={tabNotifContainer}
    />
  );
}
