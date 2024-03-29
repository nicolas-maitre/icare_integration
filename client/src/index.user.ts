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
  integrateContract,
} from "./integrations/contractIntegration";
import {
  FamilyIntegration,
  integrateFamily,
} from "./integrations/familyIntegration";
import {
  PersonIntegration,
  integratePerson,
} from "./integrations/personIntegration";

try {
  await (async () => {
    const isContractPage = urlCheck([
      "/icare/Be/VertragEdit.do",
      "/icare/Ad/WartelisteToPlatzierung.do",
      "/icare/Ad/WartelisteToPlatzierungPrepare.do",
      "/icare/Be/PlatzierungVertragKopieren.do",
    ]);
    const isPersonPage = urlCheck([
      "/icare/Be/PersonEdit.do",
      "/icare/Ad/PersonSpeichern.do",
    ]);

    //if no supported page (optimisation)
    if (!isContractPage && !isPersonPage) return;

    //setup react into an element that isn't displayed, we use portals for the different parts
    const dummyElement = createElem("div");
    const root = createRoot(dummyElement);

    //create integrations
    let contractIntegration: ContractIntegration | null = null;
    if (isContractPage) {
      contractIntegration = await integrateContract({ renderApp });
    }
    let familyIntegration: FamilyIntegration | null = null;
    // let personIntegration: PersonIntegration | null = null;
    if (isPersonPage) {
      familyIntegration = await integrateFamily({ renderApp });
      // personIntegration = await integratePerson({ renderApp });
    }

    //render
    function renderApp() {
      root.render(
        reactCreateElement(App, { contractIntegration, familyIntegration })
      );
    }
    renderApp();
  })();
} catch (e) {
  console.error("An error occured", e);
}
console.info("ged icare integration loaded");
