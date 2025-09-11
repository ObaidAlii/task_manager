import { createTheme } from "@mui/material";

export const getDesignToken = (mode: "light" | "dark") => ({
  palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: { main: "#37474F" }, // Blue Gray 800
            secondary: { main: "#00BCD4" }, // Cyan 500
            background: { default: "#f5f5f5", paper: "#ffffff" },
            text: { primary: "#212121", secondary: "#616161" },
          }
        : {
            primary: { main: "#37474F" },
            secondary: { main: "#00BCD4" },
            background: { default: "#121212", paper: "#1e1e1e" },
            text: { primary: "#ffffff", secondary: "#b0bec5" },
          }),
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "#37474F", // unify header/footer
          },
        },
      }
    },
});

export const createAppTheme = (mode : "light" | "dark") => createTheme(getDesignToken(mode));