import type { } from '../types/lk-color.d.ts'
import { LkColors } from './debugUtils'

const colorsWithOnTokens = [
  "primary",
  "primarycontainer",
  "secondary",
  "secondarycontainer",
  "tertiary",
  "tertiarycontainer",
  "error",
  "errorcontainer",
  "success",
  "successcontainer",
  "warning",
  "warningcontainer",
  "info",
  "infocontainer",
  "background",
  "surface",
  "surfacevariant",
  "surfacecontainerlowest",
  "surfacecontainerlow",
  "surfacecontainer",
  "surfacecontainerhigh",
  "surfacecontainerhighest",
  "inversesurface",
  "primaryfixed",
  "secondaryfixed",
  "tertiaryfixed",
];

const colorsWithoutOnTokens = [
  "onprimaryfixed",
  "primaryfixeddim",
  "onprimaryfixedvariant",
  "onsecondaryfixed",
  "secondaryfixeddim",
  "onsecondaryfixedvariant",
  "ontertiaryfixed",
  "tertiaryfixeddim",
  "ontertiaryfixedvariant",
  "surfacedim",
  "surfacebright",
  "outline",
  "outlinevariant",
];

export function getColorsWithoutOnTokens(): LkColor[] {
  return LkColors.filter((color) => !colorsWithOnTokens.includes(color as LkColorWithOnToken));
}

export function getOnToken(colorToken: LkColor) {
  const isAlreadyOnToken = colorToken.startsWith("on") || colorToken.startsWith("inverseon");
  const startsWithOn = colorToken.startsWith("on");
  const endsWithFixed = colorToken.endsWith("fixed");
  const endsWithDim = colorToken.endsWith("dim");
  const endsWithVariant = colorToken.endsWith("variant");

  function getFixedColorComplement(color: LkColor) {
    switch (endsWithFixed) {
      case true:
        switch (startsWithOn) {
          case true:
            return color.slice(2);
          case false:
            return `on${color}`;
        }
      case false: {
        switch (endsWithDim) {
          case true:
            const rootColorDim = color.slice(0, -3);
            return `on${rootColorDim}variant`;
          case false: {
            switch (endsWithVariant) {
              case true:
                const rootColorVariant = color.slice(0, -8);
                return `on${rootColorVariant}fixed`;
              case false:
                return `on${color}`;
            }
          }
        }
      }
    }
  }

  var tokenToReturn;

  switch (isAlreadyOnToken) {
    case false:
      switch (colorToken) {
        case "surfacecontainerlowest":
        case "surfacecontainerlow":
        case "surfacecontainer":
        case "surfacecontainerhigh":
        case "surfacecontainerhighest":
        case "surfacedim":
        case "surfacebright":
          tokenToReturn = `onsurface`;
          break;
        case "inversesurface":
          tokenToReturn = `inverseonsurface`;
          break;
        case "inverseprimary":
          tokenToReturn = "onprimarycontainer";
          break;
        case "shadow":
        case "scrim":
          tokenToReturn = "white";
          break;
        case "primaryfixeddim":
        case "secondaryfixeddim":
        case "tertiaryfixeddim":
        case "onprimaryfixed":
        case "onsecondaryfixed":
        case "ontertiaryfixed":
        case "onprimaryfixedvariant":
        case "onsecondaryfixedvariant":
        case "ontertiaryfixedvariant":
          tokenToReturn = getFixedColorComplement(colorToken);
          break;
        case "outline":
        case "outlinevariant":
          tokenToReturn = `onsurfacevariant`;
          break;
        default:
          tokenToReturn = `on${colorToken}`;
          break;
      }
      break;
    default:
      switch (colorToken) {
        case "inverseonsurface":
          tokenToReturn = `inversesurface`;
          break;
        default:
          tokenToReturn = colorToken.slice(2);
      }
  }

  return tokenToReturn;
}
