import React from "react";
import { useThemeContext } from "./ThemeContextProvider";
import { Button, IconButton, Tooltip, Typography } from "@mui/material";
import { MoonStarIcon, SunIcon } from "lucide-react";

const ThemeToggler = () => {
  const { theme, toggleTheme } = useThemeContext();

  const styles = {
    main: {
      cursor: "pointer"
    },
    icon: {
      cursor: "pointer",
    }
  }

  return (
    <div>
      <Tooltip title="Toggle Light & Dark Theme">
        <IconButton onClick={toggleTheme}>
          {theme === "light" ? <SunIcon style={styles.icon}/> : <MoonStarIcon style={styles.icon} />}
        </IconButton>
      </Tooltip>
      
    </div>
  );
};

export default ThemeToggler;
