import "./App.css";
import Sidebar from "./components/Home/Sidebar";
import React, { useEffect, useState } from "react";
import TaskList from "./components/Task/TaskList";
import Settings from "./components/Settings/Settings";
import Home from "./components/Home/Home";
import { useTheme } from "@mui/material/styles";

const App = () => {
  const [selectedMenu, setSelectedMenu] = useState({ id: 0, name: "Inbox" });
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskOnTop, setTaskOnTop] = useState(JSON.parse(localStorage.getItem("taskOnTop")) || false); 
  const [completeSound, setCompleteSound] = useState(JSON.parse(localStorage.getItem("completeSound")) || false); 
  const [deleteConfirm, setDeleteConfirm] = useState(JSON.parse(localStorage.getItem("deleteConfirm")) || false); 
  const [showDates, setShowDates] = useState(JSON.parse(localStorage.getItem("showDates")) || false); 
  const theme = useTheme();

  const styles = {
    main: {
      display: "flex",
      backgroundColor: theme.palette.background.paper,
      color: theme === "light" ? "#352F44" : "#FAF0E6",
      minHeight: "100vh", 
    },
    content: {
      width: "100%",
      color: theme === "light" ? "#352F44" : "#FAF0E6",
    }
  }

  const menuItems = {
    home: { id: 0, name: "Inbox" },
    settings: { id: -1, name: "Settings" },
  }

  const menuComponents = {
    Inbox: <Home category={selectedMenu} setTasks={setTasks}/>,
    Settings: 
      <Settings
        taskOnTo={taskOnTop} 
        setTaskOnTop={setTaskOnTop} 
        menuItems={menuItems} 
        setSelectedMenu={setSelectedMenu} 
        completeSound={completeSound} 
        setCompleteSound={setCompleteSound} 
        deleteConfirm={deleteConfirm} 
        setDeleteConfirm={setDeleteConfirm}
        showDates={showDates}
        setShowDates={setShowDates}
        categories={categories}
        setCategories={setCategories}
      />,
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedMenu]);

  const fetchTasks = async () => {
    try {
      if (selectedMenu?.id >= 0) {
        const response = await fetch(`http://localhost:5000/api/tasks/${selectedMenu.id}`);
        const data = await response.json();
        const orderedTasks = taskOnTop ? data.reverse() : data;
        setTasks(orderedTasks);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.log(`Error fetching tasks: ${error}`)
    }
  };

  return (
    <>
      <div style={styles.main}>
        <Sidebar
          menuItems={menuItems}
          categories={categories}
          setCategories={setCategories}
          setSelectedMenu={setSelectedMenu}
        />
        <div style={styles.content}>
          {selectedMenu?.id >= 0 ? (
            <TaskList tasks={tasks} category={selectedMenu} setTasks={setTasks} deleteConfirm={deleteConfirm} setDeleteConfirm={setDeleteConfirm} setShowDates={setShowDates} showDates={showDates}/>
          ) : (
            menuComponents[selectedMenu.name] || <div>Not Found</div>
          )}
        </div>
      </div>
    </>

  );
};

export default App;