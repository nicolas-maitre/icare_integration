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

import { createRoot } from "react-dom/client";
import { createElement as reactCreateElement } from "react";
import { createElem } from "./helpers/elements";
import { urlCheck } from "./helpers/url";
import { App } from "./components/App";
import {
  ContractIntegration,
  integrateContractPage,
} from "./integrations/contractPageIntegration";

try {
  await (async () => {
    const isContractPage = urlCheck([
      "/icare/Be/VertragEdit.do",
      "/icare/Ad/WartelisteToPlatzierung.do",
      "/icare/Ad/WartelisteToPlatzierungPrepare.do",
      "/icare/Be/PlatzierungVertragKopieren.do",
    ]);

    //if no supported page
    if (!isContractPage) return;

    //setup react into an element that isn't displayed, we use portals for the different parts
    const dummyElement = createElem("div");
    const root = createRoot(dummyElement);

    //create integrations
    let contractIntegration: ContractIntegration | undefined;
    if (isContractPage) {
      contractIntegration = await integrateContractPage({ renderApp });
    }

    //render
    function renderApp() {
      root.render(reactCreateElement(App, { contractIntegration }));
    }
    renderApp();
  })();
} catch (e) {
  console.error("An error occured", e);
}
console.info("ged icare integration loaded");
