export const theme = {
  colors: {
    background: "#fbf9f8",
    primary: "#02021a",
    secondary: "#864e5a",
    surface: "#fbf9f8",
    outline: "#77767e",
  },
} as const;

export type Theme = typeof theme;