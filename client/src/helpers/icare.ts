export async function getFamilyTreeData(memberId: number) {
  const res = await fetch(
    "https://icare.lausanne.ch/icare/NavigationSystem.do?method=tree&id=110374"
  );
  const txtRes = await res.text();
  const parser = new DOMParser();
  const dom = parser.parseFromString(txtRes, "text/html");
  const sections = [...dom.querySelectorAll<HTMLLIElement>("body > ul > li")];
  return sections;
}
