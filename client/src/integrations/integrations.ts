export type IntegrationBase = {
  container: Element;
  tabNotifContainer?: Element;
};

export type IntegrateProps = {
  renderApp(): void;
};
