import { sliceNum } from "../../common/numToAutoFixed";
import { exactValue, nearestOpacity, nearestValue } from "../conversionTables";

/**
 * https://tailwindcss.com/docs/opacity/
 * default is [0, 25, 50, 75, 100], but '100' will be ignored:
 * if opacity was changed, let it be visible. Therefore, 98% => 75
 * node.opacity is between [0, 1]; output will be [0, 100]
 */
export const tailwindOpacity = (node: BlendMixin): string => {
  // [when testing] node.opacity can be undefined
  if (node.opacity !== undefined && node.opacity !== 1) {
    return `opacity-${nearestOpacity(node.opacity)}`;
  }
  return "";
};

/**
 * https://tailwindcss.com/docs/visibility/
 * example: invisible
 */
export const tailwindVisibility = (node: SceneNodeMixin): string => {
  // [when testing] node.visible can be undefined

  // When something is invisible in Figma, it isn't gone. Groups can make use of it.
  // Therefore, instead of changing the visibility (which causes bugs in nested divs),
  // this plugin is going to ignore color and stroke
  if (node.visible !== undefined && !node.visible) {
    return "invisible";
  }
  return "";
};

/**
 * https://tailwindcss.com/docs/rotate/
 * default is [-180, -90, -45, 0, 45, 90, 180], but '0' will be ignored:
 * if rotation was changed, let it be perceived. Therefore, 1 => 45
 */
export const tailwindRotation = (node: LayoutMixin): string => {
  // that's how you convert angles to clockwise radians: angle * -pi/180
  // using 3.14159 as Pi for enough precision and to avoid importing math lib.
  if (node.rotation !== undefined && Math.round(node.rotation) !== 0) {
    const allowedValues = [
      -180, -90, -45, -12, -6, -3, -2, -1, 1, 2, 3, 6, 12, 45, 90, 180,
    ];
    let nearest = exactValue(-node.rotation, allowedValues);
    if (nearest) {
      let minusIfNegative = "";
      if (nearest < 0) {
        minusIfNegative = "-";
        nearest = -nearest;
      }

      return `origin-top-left ${minusIfNegative}rotate-${nearest}`;
    } else {
      return `origin-top-left rotate-[${sliceNum(-node.rotation)}deg]`;
    }
  }
  return "";
};
