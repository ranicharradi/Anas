export type KeyboardDirection = -1 | 1;

export type KeyboardAction =
  | { kind: "slide"; direction: KeyboardDirection }
  | { kind: "inner"; direction: KeyboardDirection }
  | { kind: "home" }
  | { kind: "end" };

export const SLIDE_INNER_NAVIGATION_EVENT = "deck:inner-navigation";

type KeyboardLike = Pick<KeyboardEvent, "key"> &
  Partial<Pick<KeyboardEvent, "altKey" | "ctrlKey" | "metaKey" | "shiftKey">>;

export function getKeyboardAction(event: KeyboardLike): KeyboardAction | null {
  if (event.altKey || event.ctrlKey || event.metaKey) return null;

  switch (event.key) {
    case "ArrowRight":
    case "PageDown":
      return { kind: "slide", direction: 1 };
    case "ArrowLeft":
    case "PageUp":
      return { kind: "slide", direction: -1 };
    case " ":
      return { kind: "slide", direction: event.shiftKey ? -1 : 1 };
    case "ArrowDown":
      return { kind: "inner", direction: 1 };
    case "ArrowUp":
      return { kind: "inner", direction: -1 };
    case "Home":
      return { kind: "home" };
    case "End":
      return { kind: "end" };
    default:
      return null;
  }
}

export function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    target.isContentEditable
  );
}

export function emitSlideInnerNavigation(direction: KeyboardDirection) {
  window.dispatchEvent(
    new CustomEvent<{ direction: KeyboardDirection }>(
      SLIDE_INNER_NAVIGATION_EVENT,
      { detail: { direction } },
    ),
  );
}

export function onSlideInnerNavigation(
  handler: (direction: KeyboardDirection) => void,
) {
  const listener = (event: Event) => {
    handler(
      (event as CustomEvent<{ direction: KeyboardDirection }>).detail.direction,
    );
  };

  window.addEventListener(SLIDE_INNER_NAVIGATION_EVENT, listener);
  return () => window.removeEventListener(SLIDE_INNER_NAVIGATION_EVENT, listener);
}
