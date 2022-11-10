interface BindRef<T> {
  current?: T;
}

type ElemProps<T extends HTMLElement> = Partial<
  Omit<T, "style" | "attributes">
> & {
  // Record<string, any> &
  bindTo?: BindRef<T>;
  style?: Partial<T["style"] & Record<`--${string}`, string>>;
  /**
   * Raw html attributes
   */
  attributes?: Record<string, string>;
};
type ElemRealProps<T extends ElemType> = ElemProps<
  HTMLElementTagNameMap[T]
> | null;

type ElemType = keyof HTMLElementTagNameMap;
type ChildElem = Element | string;

export function createElem<T extends ElemType>(
  type: T,
  props?: ElemRealProps<T>,
  ...children: ChildElem[]
) {
  //:HTMLElementTagNameMap[ElemType]
  const el = document.createElement(type);
  Object.entries(props ?? {}).forEach(([name, val]) => {
    if (name === "dataset") {
      Object.assign(el[name], val);
    } else if (name === "style") {
      Object.entries(val as CSSStyleDeclaration).forEach(([k, v]) => {
        if (el.style[k as any] !== undefined) el.style[k as any] = v;
        else el.style.setProperty(k, v);
      });
    } else if (name === "bindTo") {
      const bindRef = val as BindRef<typeof el>;
      bindRef.current = el;
    } else if (name === "attributes") {
      Object.entries(val as Record<string, string>).forEach(
        ([attrName, attrVal]) => {
          el.setAttribute(attrName, attrVal);
        }
      );
    } else {
      (el as any)[name] = val;
    }
  });

  el.append(...children);

  return el;
}

export function addElement<T extends ElemType>(
  parent: Element,
  type: T,
  props?: ElemRealProps<T>,
  ...children: ChildElem[]
) {
  const el = createElem(type, props, ...children);
  parent.appendChild(el);
  return el;
}

export function e(elem: Element) {
  function addElem<T extends ElemType>(
    type: T,
    props?: ElemRealProps<T>,
    ...children: ChildElem[]
  ) {
    return addElement(elem, type, props, ...children);
  }
  return { elem, addElem };
}

export function waitForSelector<T extends HTMLElement>(
  selector: string | (() => T | null),
  checkInterval = 100,
  maxChecks = 50
): Promise<T> {
  const res: T | null =
    typeof selector === "function"
      ? selector()
      : document.querySelector(selector);

  return new Promise((resolve, reject) => {
    if (res === null) {
      if (maxChecks <= 0) {
        reject(new Error(`can't find element ${selector.toString()}`));
        return;
      }
      setTimeout(
        () =>
          waitForSelector(selector, checkInterval, maxChecks - 1)
            // @ts-ignore because all html elements inherit from HTMLElement anyways
            .then(resolve)
            .catch(reject),
        checkInterval
      );
    } else {
      resolve(res);
    }
  });
}

async function waitForValue<T>(
  getter: () => (T | undefined) | Promise<T | undefined>,
  checkInterval = 100,
  maxChecks = 50
): Promise<T | undefined> {
  const res = await getter();
  return new Promise((resolve) => {
    if (res === undefined) {
      if (maxChecks <= 0) {
        resolve(undefined);
        return;
      }
      setTimeout(
        () => waitForValue(getter, checkInterval, maxChecks - 1).then(resolve),
        checkInterval
      );
    } else {
      resolve(res);
    }
  });
}

/**
 * @param minCount minimum count of returned elements
 */
function waitForSelectorAll(
  selector: string | (() => NodeListOf<Element>),
  minCount = 1,
  checkInterval = 100,
  maxChecks = 50
): Promise<NodeListOf<Element>> {
  console.log("waitForSelectorAll", maxChecks);
  const res =
    typeof selector === "function"
      ? selector()
      : document.querySelectorAll(selector);

  return new Promise((resolve, reject) => {
    if (res.length < minCount) {
      if (maxChecks <= 0) {
        reject(new Error(`can't find elements ${selector.toString()}`));
        return;
      }
      setTimeout(
        () =>
          waitForSelectorAll(selector, minCount, checkInterval, maxChecks - 1)
            .then(resolve)
            .catch(reject),
        checkInterval
      );
    } else {
      resolve(res);
    }
  });
}
