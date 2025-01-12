import React, { createContext, useState, useMemo, useContext } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const muiTheme = useMemo(
        () =>
          createTheme({
            palette: {
              mode: theme,
              primary: { main: theme === "light" ? "#1976d2" : "#bb86fc" },
              secondary: { main: theme === "light" ? "#dc004e" : "#03dac6" },
              background: {
                default: theme === "light" ? "#ffffff" : "#121212",
                paper: theme === "light" ? "#FAF0E6" : "#352F44",
                sidebar: theme === "light" ? "#e1d8cf" : "#5C5470",
              },
              text: {
                primary: theme === "light" ? "#352F44" : "#FAF0E6", // Custom primary text color
                secondary: theme === "light" ? "#555555" : "#aaaaaa", // Custom secondary text color
                disabled: theme === "light" ? "#cccccc" : "#666666", // Disabled text color
              },
            },
          }),
        [theme]
      );

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => useContext(ThemeContext);
