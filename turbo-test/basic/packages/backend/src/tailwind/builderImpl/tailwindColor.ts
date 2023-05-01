import { nearestColorFrom } from "../../nearest-color/nearestColor";
import { retrieveTopFill } from "../../common/retrieveFill";
import { gradientAngle } from "../../common/color";
import { nearestOpacity, nearestValue } from "../conversionTables";

// retrieve the SOLID color for tailwind
export const tailwindColorFromFills = (
  fills: ReadonlyArray<Paint> | PluginAPI["mixed"],
  kind: string
): string => {
  // kind can be text, bg, border...
  // [when testing] fills can be undefined

  const fill = retrieveTopFill(fills);
  if (fill?.type === "SOLID") {
    // don't set text color when color is black (default) and opacity is 100%
    return tailwindSolidColor(fill, kind);
  }

  return "";
};

export const tailwindSolidColor = (fill: SolidPaint, kind: string): string => {
  // don't set text color when color is black (default) and opacity is 100%
  if (
    kind === "text" &&
    fill.color.r === 0.0 &&
    fill.color.g === 0.0 &&
    fill.color.b === 0.0 &&
    fill.opacity === 1.0
  ) {
    return "";
  }

  const opacity = fill.opacity ?? 1.0;

  // example: text-opacity-50
  // ignore the 100. If opacity was changed, let it be visible.
  const opacityProp =
    opacity !== 1.0 ? `${kind}-opacity-${nearestOpacity(opacity)} ` : "";

  // example: text-red-500
  const colorProp = `${kind}-${getTailwindFromFigmaRGB(fill.color)} `;

  // if fill isn't visible, it shouldn't be painted.
  return `${colorProp}${opacityProp}`;
};

/**
 * https://tailwindcss.com/docs/box-shadow/
 * example: shadow
 */
export const tailwindGradientFromFills = (
  fills: ReadonlyArray<Paint> | PluginAPI["mixed"]
): string => {
  // [when testing] node.effects can be undefined

  const fill = retrieveTopFill(fills);

  if (fill?.type === "GRADIENT_LINEAR") {
    return tailwindGradient(fill);
  }

  return "";
};

export const tailwindGradient = (fill: GradientPaint): string => {
  const direction = gradientDirection(gradientAngle(fill));

  if (fill.gradientStops.length === 1) {
    const fromColor = getTailwindFromFigmaRGB(fill.gradientStops[0].color);

    return `${direction} from-${fromColor} `;
  } else if (fill.gradientStops.length === 2) {
    const fromColor = getTailwindFromFigmaRGB(fill.gradientStops[0].color);
    const toColor = getTailwindFromFigmaRGB(fill.gradientStops[1].color);

    return `${direction} from-${fromColor} to-${toColor} `;
  } else {
    const fromColor = getTailwindFromFigmaRGB(fill.gradientStops[0].color);

    // middle (second color)
    const viaColor = getTailwindFromFigmaRGB(fill.gradientStops[1].color);

    // last
    const toColor = getTailwindFromFigmaRGB(
      fill.gradientStops[fill.gradientStops.length - 1].color
    );

    return `${direction} from-${fromColor} via-${viaColor} to-${toColor} `;
  }
};

const gradientDirection = (angle: number): string => {
  switch (nearestValue(angle, [-180, -135, -90, -45, 0, 45, 90, 135, 180])) {
    case 0:
      return "bg-gradient-to-r";
    case 45:
      return "bg-gradient-to-br";
    case 90:
      return "bg-gradient-to-b";
    case 135:
      return "bg-gradient-to-bl";
    case -45:
      return "bg-gradient-to-tr";
    case -90:
      return "bg-gradient-to-t";
    case -135:
      return "bg-gradient-to-tl";
    default:
      // 180 and -180
      return "bg-gradient-to-l";
  }
};

// AutoGenerated for Tailwind 2 via [convert_tailwind_colors.js]
export const tailwindColorsFull: Record<string, string> = {
  "#000000": "black",
  "#ffffff": "white",

  "#fff1f2": "rose-50",
  "#ffe4e6": "rose-100",
  "#fecdd3": "rose-200",
  "#fda4af": "rose-300",
  "#fb7185": "rose-400",
  "#f43f5e": "rose-500",
  "#e11d48": "rose-600",
  "#be123c": "rose-700",
  "#9f1239": "rose-800",
  "#881337": "rose-900",
  "#fdf2f8": "pink-50",
  "#fce7f3": "pink-100",
  "#fbcfe8": "pink-200",
  "#f9a8d4": "pink-300",
  "#f472b6": "pink-400",
  "#ec4899": "pink-500",
  "#db2777": "pink-600",
  "#be185d": "pink-700",
  "#9d174d": "pink-800",
  "#831843": "pink-900",
  "#fdf4ff": "fuchsia-50",
  "#fae8ff": "fuchsia-100",
  "#f5d0fe": "fuchsia-200",
  "#f0abfc": "fuchsia-300",
  "#e879f9": "fuchsia-400",
  "#d946ef": "fuchsia-500",
  "#c026d3": "fuchsia-600",
  "#a21caf": "fuchsia-700",
  "#86198f": "fuchsia-800",
  "#701a75": "fuchsia-900",
  "#faf5ff": "purple-50",
  "#f3e8ff": "purple-100",
  "#e9d5ff": "purple-200",
  "#d8b4fe": "purple-300",
  "#c084fc": "purple-400",
  "#a855f7": "purple-500",
  "#9333ea": "purple-600",
  "#7e22ce": "purple-700",
  "#6b21a8": "purple-800",
  "#581c87": "purple-900",
  "#f5f3ff": "violet-50",
  "#ede9fe": "violet-100",
  "#ddd6fe": "violet-200",
  "#c4b5fd": "violet-300",
  "#a78bfa": "violet-400",
  "#8b5cf6": "violet-500",
  "#7c3aed": "violet-600",
  "#6d28d9": "violet-700",
  "#5b21b6": "violet-800",
  "#4c1d95": "violet-900",
  "#eef2ff": "indigo-50",
  "#e0e7ff": "indigo-100",
  "#c7d2fe": "indigo-200",
  "#a5b4fc": "indigo-300",
  "#818cf8": "indigo-400",
  "#6366f1": "indigo-500",
  "#4f46e5": "indigo-600",
  "#4338ca": "indigo-700",
  "#3730a3": "indigo-800",
  "#312e81": "indigo-900",
  "#eff6ff": "blue-50",
  "#dbeafe": "blue-100",
  "#bfdbfe": "blue-200",
  "#93c5fd": "blue-300",
  "#60a5fa": "blue-400",
  "#3b82f6": "blue-500",
  "#2563eb": "blue-600",
  "#1d4ed8": "blue-700",
  "#1e40af": "blue-800",
  "#1e3a8a": "blue-900",
  "#f0f9ff": "lightBlue-50",
  "#e0f2fe": "lightBlue-100",
  "#bae6fd": "lightBlue-200",
  "#7dd3fc": "lightBlue-300",
  "#38bdf8": "lightBlue-400",
  "#0ea5e9": "lightBlue-500",
  "#0284c7": "lightBlue-600",
  "#0369a1": "lightBlue-700",
  "#075985": "lightBlue-800",
  "#0c4a6e": "lightBlue-900",
  "#ecfeff": "cyan-50",
  "#cffafe": "cyan-100",
  "#a5f3fc": "cyan-200",
  "#67e8f9": "cyan-300",
  "#22d3ee": "cyan-400",
  "#06b6d4": "cyan-500",
  "#0891b2": "cyan-600",
  "#0e7490": "cyan-700",
  "#155e75": "cyan-800",
  "#164e63": "cyan-900",
  "#f0fdfa": "teal-50",
  "#ccfbf1": "teal-100",
  "#99f6e4": "teal-200",
  "#5eead4": "teal-300",
  "#2dd4bf": "teal-400",
  "#14b8a6": "teal-500",
  "#0d9488": "teal-600",
  "#0f766e": "teal-700",
  "#115e59": "teal-800",
  "#134e4a": "teal-900",
  "#ecfdf5": "emerald-50",
  "#d1fae5": "emerald-100",
  "#a7f3d0": "emerald-200",
  "#6ee7b7": "emerald-300",
  "#34d399": "emerald-400",
  "#10b981": "emerald-500",
  "#059669": "emerald-600",
  "#047857": "emerald-700",
  "#065f46": "emerald-800",
  "#064e3b": "emerald-900",
  "#f0fdf4": "green-50",
  "#dcfce7": "green-100",
  "#bbf7d0": "green-200",
  "#86efac": "green-300",
  "#4ade80": "green-400",
  "#22c55e": "green-500",
  "#16a34a": "green-600",
  "#15803d": "green-700",
  "#166534": "green-800",
  "#14532d": "green-900",
  "#f7fee7": "lime-50",
  "#ecfccb": "lime-100",
  "#d9f99d": "lime-200",
  "#bef264": "lime-300",
  "#a3e635": "lime-400",
  "#84cc16": "lime-500",
  "#65a30d": "lime-600",
  "#4d7c0f": "lime-700",
  "#3f6212": "lime-800",
  "#365314": "lime-900",
  "#fefce8": "yellow-50",
  "#fef9c3": "yellow-100",
  "#fef08a": "yellow-200",
  "#fde047": "yellow-300",
  "#facc15": "yellow-400",
  "#eab308": "yellow-500",
  "#ca8a04": "yellow-600",
  "#a16207": "yellow-700",
  "#854d0e": "yellow-800",
  "#713f12": "yellow-900",
  "#fffbeb": "amber-50",
  "#fef3c7": "amber-100",
  "#fde68a": "amber-200",
  "#fcd34d": "amber-300",
  "#fbbf24": "amber-400",
  "#f59e0b": "amber-500",
  "#d97706": "amber-600",
  "#b45309": "amber-700",
  "#92400e": "amber-800",
  "#78350f": "amber-900",
  "#fff7ed": "orange-50",
  "#ffedd5": "orange-100",
  "#fed7aa": "orange-200",
  "#fdba74": "orange-300",
  "#fb923c": "orange-400",
  "#f97316": "orange-500",
  "#ea580c": "orange-600",
  "#c2410c": "orange-700",
  "#9a3412": "orange-800",
  "#7c2d12": "orange-900",
  "#fef2f2": "red-50",
  "#fee2e2": "red-100",
  "#fecaca": "red-200",
  "#fca5a5": "red-300",
  "#f87171": "red-400",
  "#ef4444": "red-500",
  "#dc2626": "red-600",
  "#b91c1c": "red-700",
  "#991b1b": "red-800",
  "#7f1d1d": "red-900",
  "#fafaf9": "warmGray-50",
  "#f5f5f4": "warmGray-100",
  "#e7e5e4": "warmGray-200",
  "#d6d3d1": "warmGray-300",
  "#a8a29e": "warmGray-400",
  "#78716c": "warmGray-500",
  "#57534e": "warmGray-600",
  "#44403c": "warmGray-700",
  "#292524": "warmGray-800",
  "#1c1917": "warmGray-900",
  "#fafafa": "gray-50",
  "#f5f5f5": "trueGray-100",
  "#e5e5e5": "trueGray-200",
  "#d4d4d4": "trueGray-300",
  "#a3a3a3": "trueGray-400",
  "#737373": "trueGray-500",
  "#525252": "trueGray-600",
  "#404040": "trueGray-700",
  "#262626": "trueGray-800",
  "#171717": "trueGray-900",
  "#f4f4f5": "gray-100",
  "#e4e4e7": "gray-200",
  "#d4d4d8": "gray-300",
  "#a1a1aa": "gray-400",
  "#71717a": "gray-500",
  "#52525b": "gray-600",
  "#3f3f46": "gray-700",
  "#27272a": "gray-800",
  "#18181b": "gray-900",
  "#f9fafb": "coolGray-50",
  "#f3f4f6": "coolGray-100",
  "#e5e7eb": "coolGray-200",
  "#d1d5db": "coolGray-300",
  "#9ca3af": "coolGray-400",
  "#6b7280": "coolGray-500",
  "#4b5563": "coolGray-600",
  "#374151": "coolGray-700",
  "#1f2937": "coolGray-800",
  "#111827": "coolGray-900",
  "#f8fafc": "blueGray-50",
  "#f1f5f9": "blueGray-100",
  "#e2e8f0": "blueGray-200",
  "#cbd5e1": "blueGray-300",
  "#94a3b8": "blueGray-400",
  "#64748b": "blueGray-500",
  "#475569": "blueGray-600",
  "#334155": "blueGray-700",
  "#1e293b": "blueGray-800",
  "#0f172a": "blueGray-900",
};

// Basic Tailwind Colors
export const tailwindColors: Record<string, string> = {
  "#000000": "black",
  "#ffffff": "white",

  "#fdf2f8": "pink-50",
  "#fce7f3": "pink-100",
  "#fbcfe8": "pink-200",
  "#f9a8d4": "pink-300",
  "#f472b6": "pink-400",
  "#ec4899": "pink-500",
  "#db2777": "pink-600",
  "#be185d": "pink-700",
  "#9d174d": "pink-800",
  "#831843": "pink-900",
  "#f5f3ff": "purple-50",
  "#ede9fe": "purple-100",
  "#ddd6fe": "purple-200",
  "#c4b5fd": "purple-300",
  "#a78bfa": "purple-400",
  "#8b5cf6": "purple-500",
  "#7c3aed": "purple-600",
  "#6d28d9": "purple-700",
  "#5b21b6": "purple-800",
  "#4c1d95": "purple-900",
  "#eef2ff": "indigo-50",
  "#e0e7ff": "indigo-100",
  "#c7d2fe": "indigo-200",
  "#a5b4fc": "indigo-300",
  "#818cf8": "indigo-400",
  "#6366f1": "indigo-500",
  "#4f46e5": "indigo-600",
  "#4338ca": "indigo-700",
  "#3730a3": "indigo-800",
  "#312e81": "indigo-900",
  "#eff6ff": "blue-50",
  "#dbeafe": "blue-100",
  "#bfdbfe": "blue-200",
  "#93c5fd": "blue-300",
  "#60a5fa": "blue-400",
  "#3b82f6": "blue-500",
  "#2563eb": "blue-600",
  "#1d4ed8": "blue-700",
  "#1e40af": "blue-800",
  "#1e3a8a": "blue-900",
  "#ecfdf5": "green-50",
  "#d1fae5": "green-100",
  "#a7f3d0": "green-200",
  "#6ee7b7": "green-300",
  "#34d399": "green-400",
  "#10b981": "green-500",
  "#059669": "green-600",
  "#047857": "green-700",
  "#065f46": "green-800",
  "#064e3b": "green-900",
  "#fffbeb": "yellow-50",
  "#fef3c7": "yellow-100",
  "#fde68a": "yellow-200",
  "#fcd34d": "yellow-300",
  "#fbbf24": "yellow-400",
  "#f59e0b": "yellow-500",
  "#d97706": "yellow-600",
  "#b45309": "yellow-700",
  "#92400e": "yellow-800",
  "#78350f": "yellow-900",
  "#fef2f2": "red-50",
  "#fee2e2": "red-100",
  "#fecaca": "red-200",
  "#fca5a5": "red-300",
  "#f87171": "red-400",
  "#ef4444": "red-500",
  "#dc2626": "red-600",
  "#b91c1c": "red-700",
  "#991b1b": "red-800",
  "#7f1d1d": "red-900",
  "#f9fafb": "gray-50",
  "#f3f4f6": "gray-100",
  "#e5e7eb": "gray-200",
  "#d1d5db": "gray-300",
  "#9ca3af": "gray-400",
  "#6b7280": "gray-500",
  "#4b5563": "gray-600",
  "#374151": "gray-700",
  "#1f2937": "gray-800",
  "#111827": "gray-900",
};

export const tailwindNearestColor = nearestColorFrom(
  Object.keys(tailwindColors)
);

// figma uses r,g,b in [0, 1], while nearestColor uses it in [0, 255]
export const getTailwindFromFigmaRGB = (color: RGB): string => {
  const colorMultiplied = {
    r: color.r * 255,
    g: color.g * 255,
    b: color.b * 255,
  };

  return tailwindColors[tailwindNearestColor(colorMultiplied)];
};

export const getTailwindColor = (color: string | RGB): string => {
  return tailwindColors[tailwindNearestColor(color)];
};
