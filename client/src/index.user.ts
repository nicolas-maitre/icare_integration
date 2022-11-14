// ==UserScript==
// @name        iCare GED Integration
// @namespace   Violentmonkey Scripts
// @noframes
// @match       https://icare-vali.lausanne.ch/icare/*
// @match       https://icare.lausanne.ch/icare/*
// @grant       none
// @version     1.0
// @author      Nicolas Maitre (mail privé: nmaitre@ik.me)
// @description GED Integration in icare
// ==/UserScript==

import { createRoot as reactDOMCreateRoot, Root } from "react-dom/client";
import { createElement as reactCreateElement, StrictMode } from "react";

import { DocumentsTabContent } from "./components/DocumentsTabContent";
import { createElem, e, waitForSelector } from "./helpers/elements";
import { urlCheck } from "./helpers/url";

try {
  await (async () => {
    //Check for contract page
    if (
      !urlCheck([
        "/icare/Be/VertragEdit.do",
        "/icare/Ad/WartelisteToPlatzierung.do",
      ])
    )
      return;

    const tabsContainer = await waitForSelector("#tabs");
    const tabList = await e(tabsContainer).waitForSelector("ul[role=tablist]");
    const otherTabListLIs = [...tabList.querySelectorAll("li")];

    otherTabListLIs.forEach((li) => {
      li.addEventListener("click", onDeselectDocsTab);
    });

    const docTabLI = e(tabList).addElem(
      "li",
      {
        className: "ui-tabs-tab ui-corner-top ui-state-default ui-tab",
        style: {
          cursor: "pointer",
        },
        tabIndex: -1,
        attributes: {
          role: "tab",
          "aria-selected": "false",
          "aria-expanded": "false",
          "aria-controls": "ui-id-docs-content",
          "aria-labelledby": "ui-id-docs-tab",
        },
        onclick: onSelectDocsTab,
      },
      createElem(
        "a",
        {
          id: "ui-id-docs-tab",
          className: "ui-tabs-anchor",
          tabIndex: -1,
          attributes: {
            role: "presentation",
          },
        },
        "Documents"
      )
    );
    const docTabContentDiv = e(tabsContainer).addElem(
      "div",
      {
        id: "ui-id-doc-content",
        className: "ui-tabs-panel ui-corner-bottom ui-widget-content",
        attributes: {
          "aria-live": "polite",
          "aria-labelledby": "ui-id-doc-tab",
          "aria-hidden": "true",
          role: "tabpanel",
        },
        style: { display: "none" },
      },
      createElem("p", null, "Chargement...")
    );

    //MANAGE TAB STATE
    let lastSelectedLI =
      tabList.querySelector<HTMLLIElement>(
        "li.ui-tabs-active.ui-state-active"
      ) ?? undefined;

    let reactRoot: Root | undefined;

    function onSelectDocsTab(evt?: MouseEvent) {
      setVisualTab(docTabLI, true);
      if (lastSelectedLI) setVisualTab(lastSelectedLI, false);

      const lastTabContentDiv = getLITabContent(lastSelectedLI);
      if (lastTabContentDiv) setVisualTabContent(lastTabContentDiv, false);
      setVisualTabContent(docTabContentDiv, true);

      //create / update react tree

      //dynamic imports are complicated in a userscript
      // const [
      //   { DocumentsTabContent },
      //   { render: reactDOMRender },
      //   { createElement: reactCreateElement },
      // ] = await Promise.all([
      //   import("./components/DocumentsTabContent"),
      //   import("react-dom"),
      //   import("react"),
      // ]);

      if (!reactRoot) reactRoot = reactDOMCreateRoot(docTabContentDiv);
      reactRoot.render(
        reactCreateElement(
          StrictMode,
          null,
          reactCreateElement(DocumentsTabContent)
        )
      );
    }
    function onDeselectDocsTab(evt: MouseEvent) {
      if ((evt.target as HTMLElement).tagName.toLowerCase() !== "a") return;

      if (evt.currentTarget === lastSelectedLI) {
        const lastTabContentDiv = getLITabContent(lastSelectedLI);
        if (lastTabContentDiv) setVisualTabContent(lastTabContentDiv, true);
        setVisualTab(lastSelectedLI, true);
      } else {
        lastSelectedLI = evt.currentTarget as HTMLLIElement;
      }
      setVisualTab(docTabLI, false);
      setVisualTabContent(docTabContentDiv, false);
    }

    function setVisualTab(elem: HTMLLIElement, state: boolean) {
      elem.classList[state ? "add" : "remove"](
        "ui-tabs-active",
        "ui-state-active"
      );
      elem.setAttribute("aria-selected", state ? "true" : "false");
      elem.setAttribute("aria-expanded", state ? "true" : "false");
    }
    function setVisualTabContent(elem: HTMLDivElement, state: boolean) {
      elem.style.display = state ? "" : "none";
      elem.setAttribute("aria-hidden", state ? "false" : "true");
    }
    function getLITabContent(elem: HTMLLIElement | undefined) {
      const tabContentId = elem?.getAttribute("aria-controls");
      if (tabContentId) {
        return (
          tabsContainer.querySelector<HTMLDivElement>(`div#${tabContentId}`) ??
          undefined
        );
      }
      return undefined;
    }

    //TODO: dev
    // onSelectDocsTab();
  })();
} catch (e) {
  console.error("An error occured", e);
}
console.info("ged icare integration loaded");
