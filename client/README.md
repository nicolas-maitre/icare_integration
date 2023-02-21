# Icare-integration - client

Userscript adding document interfaces to the iCare UI.

## Usage

1. First off, you need a userscript browser extension. Popular ones are GreaseMonkey (Firefox) and TamperMonkey (Chrome).  
   I recommend using [ViolentMonkey](https://violentmonkey.github.io/).

2. Install the userscript found under `dist/gedIcareIntegration.user.js`.  
   (If it's not there you may need to build it).

## Developpment

In this section I will explain my workflow for the client-side. For a complete environment you should also setup the server (found in `../server`).

- **Setup**

  1. In this directory run `pnpm i`
  2. Copy `src/env.ts.example` to `src/env.ts` and change the api url if needed.
  3. Run `pnpm webpack` to build the userscript.

- **Browser sync**  
   To sync the script with the version in the browser while developping, you need to serve the script using http.

  1. Be sure to use [ViolentMonkey](https://violentmonkey.github.io/) as it supports this feature.
  2. Run `pnpm wepback` in one terminal window, the config should force it to watch for changes.
  3. Run `pnpm serve dist/` in another terminal window. Then open the displayed url in the browser, and open the script.
  4. A ViolentMonkey Window should now be open prompting you to install the script. Be sure to check both checkboxes before confirming the install.
  5. The script should now be synced on save after a browser reload.

- **Non-embedded dev environment**  
   If you just want to work on the UI without iCare, you can use the react-vite project found in `react-dev-project`.
  1. Run `pnpm i` inside the `react-dev-project` directory.
  2. Run `pnpm run dev` in the same directory.
  3. When opening the displayed url, you should now only see the embedded UI. It supports hot-reload and all modern shenanigans.
