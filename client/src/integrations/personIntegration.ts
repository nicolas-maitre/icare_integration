import { IntegrateProps, IntegrationBase } from "./integrations";

export type PersonIntegration = IntegrationBase & {
  personId: number;
};

export async function integratePerson({
  renderApp,
}: IntegrateProps): Promise<void | PersonIntegration> {
  const kindForm = document.querySelector<HTMLFormElement>(
    "form[name=KindForm]"
  );
  if (kindForm) {
    return await integrateChild(kindForm);
  }
}

export async function integrateChild(
  form: HTMLFormElement
): Promise<void | PersonIntegration> {
  const tab2 = document.getElementById("tabs0head1");
}
