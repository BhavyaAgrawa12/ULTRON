export const zIndex = {
  deep: -1,
  base: 0,
  card: 10,
  sticky: 100,
  overlay: 200,
  modal: 300,
  popover: 400,
  toast: 500,
} as const;

export type ZIndexToken = typeof zIndex;
