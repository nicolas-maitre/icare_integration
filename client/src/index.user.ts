import { createElem, e, waitForSelector } from "./helpers/elements";
import { urlCheck } from "./helpers/url";
try {
  await (async () => {
    if (!urlCheck("/icare/Be/VertragEdit.do")) return;
    const tabList = await waitForSelector("ul[role=tablist]");

    e(tabList).addElem(
      "li",
      {
        className: "ui-tabs-tab ui-corner-top ui-state-default ui-tab",
        style: {
          cursor: "pointer",
        },
        ariaSelected: "false",
        ariaExpanded: "false",
        tabIndex: -1,
        attributes: {
          role: "tab",
          "aria-controls": "ui-id-17",
          "aria-labelledby": "ui-id-17",
        },
      },
      createElem(
        "a",
        {
          id: "ui-id-17",
          className: "ui-tabs-anchor",
          tabIndex: -1,
          attributes: {
            role: "presentation",
          },
        },
        "Documents"
        // createElem("i", {className: "fa fa-external-link-alt"})
      )
    );
  })();
} catch (e) {
  console.error("An error occured", e);
}
console.info("ged icare integration loaded");
