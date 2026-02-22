export {};

declare global {
  /**
   * The base units of measurement in LiftKit. Uses `em` units where 'md' = 1em.
   */
  type LkSizeUnit =
    | "3xs"
    | "2xs"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl";

  /**
   * The maximum width of container elements.
   */
  type LkContainerWidth = "xs" | "sm" | "md" | "lg" | "xl" | "none" | "auto";
}
