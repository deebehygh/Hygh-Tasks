import React from "react";
import { Typography, Paper, Card, CardContent, Container, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Footer from "./components/Footer";
import TaskForm from "../Task/TaskForm";
const Home = ({ category, tasks, setTasks }) => {
    const theme = useTheme();

    const styles = {
        main: {
            maxWidth: "1440px",
            textAlign: "center",
            margin: "0 auto",
            color: theme.palette.text.primary
        }
    }
    
    return (
        <Box style={styles.main}>
            <h1>Today</h1>
            <TaskForm category={category} setTasks={setTasks} />
        </Box>
    );
};

export default Home;