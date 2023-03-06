import { e, waitForSelector } from "../helpers/elements";
import { IntegrateProps } from "./integrations";

export type FamilyIntegration = {
  container: Element;
  parentId: number;
};

export async function integrateFamily({
  renderApp,
}: IntegrateProps): Promise<FamilyIntegration | null> {
  const form = document.querySelector("form[name=PersonSpeichernForm]");
  const isAdult = !!form;
  const isParent = isAdult && form.id === "peredit";

  //"Family" is only available on the main parent
  if (!isParent) return null;

  //add to family tab
  const familyTabContent = await waitForSelector(
    "#tabs0tab2 > table > tbody > tr > td > div.container-fluid"
  );

  e(familyTabContent).addElem("h3", null, "Documents familiaux");
  const container = e(familyTabContent).addElem("div", {
    className: "form-group row",
  });

  //query parent id from title
  const titleElement = document.querySelector("#jqContentTable #data h2");
  const parentIdStr = titleElement?.textContent
    ?.trim()
    .split("(")
    .at(1)
    ?.split(")")
    .at(0);

  if (parentIdStr === undefined) return null;

  return {
    container,
    parentId: +parentIdStr,
  };
}
