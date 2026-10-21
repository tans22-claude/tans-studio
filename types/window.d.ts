export {};

interface LenisLike {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { duration?: number; offset?: number }
  ) => void;
  stop: () => void;
  start: () => void;
}

declare global {
  interface Window {
    __lenis?: LenisLike | null;
  }
}
