import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { General } from "./General/General";
import CategoryList from "../Category/CategoryList";
import { useTheme } from "@mui/material/styles";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ width: "100%" }}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function ThemeSidebar({
  categories,
  setCategories,
  menuItems,
  setSelectedMenu,
  taskOnTop,
  setTaskOnTop,
  completeSound,
  setCompleteSound,
  deleteConfirm,
  setDeleteConfirm,
  showDates,
  setShowDates,
}) {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        bgcolor: "background.sidebar",
        width: "100%",
      }}
    >
      {/* Sidebar Tabs */}
      <Box
        sx={{
          flex: "0 0 240px",
          bgcolor: theme.palette.background.sidebar,
          borderRight: 1,
          borderColor: "divider",
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ height: "100%" }}
        >
          <Tab label="General" {...a11yProps(0)} />
          <Tab label="Category Manager" {...a11yProps(1)} />
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box
        sx={{
          flex: 1,
          padding: "20px",
          overflow: "auto",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <TabPanel value={value} index={0}>
          <General
            taskOnTop={taskOnTop}
            setTaskOnTop={setTaskOnTop}
            completeSound={completeSound}
            setCompleteSound={setCompleteSound}
            deleteConfirm={deleteConfirm}
            setDeleteConfirm={setDeleteConfirm}
            menuItems={menuItems}
            setSelectedMenu={setSelectedMenu}
            showDates={showDates}
            setShowDates={setShowDates}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <CategoryList categories={categories} setCategories={setCategories} />
        </TabPanel>
      </Box>
    </Box>
  );
}
