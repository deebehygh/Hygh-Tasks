import axios from 'axios';
import React, { useState, useEffect } from "react";
import { FaPlus, FaHome, FaTools, FaStarAndCrescent, FaInbox } from "react-icons/fa";
import { useTheme } from "@mui/material/styles";
import { MenuIcon } from 'lucide-react';
import { IconButton, Tooltip, Typography } from '@mui/material';


const Sidebar = ({ menuItems, categories, setCategories, setSelectedMenu }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const theme = useTheme();

  const styles = {
    sidebar: {
      backgroundColor: theme.palette.background.sidebar,
      color: theme.palette.text.primary,
    },
  }

  function MouseOver(event) {
    event.target.style.background = theme.palette.background.paper;
  }
  function MouseOut(event) {
    event.target.style.background = "";
  }

  // Toggle sidebar collapse
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await axios.get("http://localhost:5000/api/categories")
    const data = await response.data;
    setCategories(data);
  }

  const handleClick = (item) => {
    setSelectedMenu(item); // Update selected menu item
  };

  return (
    <div style={styles.sidebar} className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>


      <button className="toggle-btn" onClick={toggleSidebar}>
        {<Typography className="title">Hygh Tasks</Typography> && <MenuIcon />} {!isCollapsed && <Typography className="title">Hygh Tasks</Typography>}
      </button>


      {/* Menu Items */}
      <ul className="menu">

        <li key={menuItems.home.id} onMouseOver={MouseOver} onMouseOut={MouseOut} onClick={() => handleClick(menuItems.home)}>
          {menuItems.home.name && <FaInbox />} {!isCollapsed && menuItems.home.name}
        </li>

        {/* Categories */}
        {categories.length > 0 &&
          <div>
            <hr className="split-line" />
            <li style={{ cursor: "auto" }}>
              {isCollapsed && ""} {!isCollapsed && <Typography>Categories</Typography>}
            </li>
          </div>
        }

        {categories.map((category) => (
          <li onMouseOver={MouseOver} onMouseOut={MouseOut} onClick={() => handleClick(category)} key={category.id}>
            {category.name && <FaStarAndCrescent />} {!isCollapsed && category.name}
          </li>
        ))
        }

        {/* Split */}
        <hr className="split-line" />

        <li key={menuItems.settings.id} onMouseOver={MouseOver} onMouseOut={MouseOut} onClick={() => handleClick(menuItems.settings)}>
          {menuItems.settings.name && <FaTools />} {!isCollapsed && menuItems.settings.name}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
