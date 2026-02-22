export {};

declare global {
  type LkMaterial = "flat" | "glass" | "rubber";

  /** LKMatProps is an object of any of the given types. Each material type has different unique props. */
  type LkMatProps = LkMatProps_Glass | LkMatProps_Flat;

  type LkMatProps_Glass = {
    thickness?: "thick" | "normal" | "thin";
    tint?: LkColor;
    tintOpacity?: number;
    light?: boolean;
    lightExpression?: string;
  };

  type LkMatProps_Flat = {
    color?: LkColor;
    opacity?: number;
  };
}
