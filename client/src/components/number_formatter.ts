// TODO: Intl for non-en-US

/** Number formatter for short compact numbers. */
export const NF = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
});
