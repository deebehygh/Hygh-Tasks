import React, { useState } from 'react';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import { useThemeContext } from '../Theme/ThemeContextProvider';
import { Typography } from '@mui/material';
import { NotificationType, useNotifications } from '../../Misc/Notifications';

export function General({
    taskOnTop,
    setTaskOnTop,
    completeSound,
    setCompleteSound,
    deleteConfirm,
    setDeleteConfirm,
    showDates,
    setShowDates
}) {
    const { theme, toggleTheme } = useThemeContext();
    const [state, setState] = useState({
        newtasks: JSON.parse(localStorage.getItem("taskOnTop")) || taskOnTop,
        sound: JSON.parse(localStorage.getItem("completeSound")) || completeSound,
        confirm: JSON.parse(localStorage.getItem("deleteConfirm")) || deleteConfirm,
        dates: JSON.parse(localStorage.getItem("showDates")) || showDates,
        dark: theme === "dark",
    });
    const { addNotification } = useNotifications();

    const styles = {
        option: {
            display: "flex",
            margin: "10px"
        },
        optionSwitch: {
            margin: "-5px 20px"
        }
    }

    const handleTaskOnTop = (checked) => {
        setTaskOnTop(checked);
        localStorage.setItem('taskOnTop', checked);
        addNotification(NotificationType.SUCCESS, `New Tasks on Top: ${checked ? "Enabled" : "Disabled"}`)
    }

    const handlePlayCompleteSound = (checked) => {
        setCompleteSound(checked);
        localStorage.setItem('completeSound', checked);
        addNotification(NotificationType.SUCCESS, `Editting Complete Sound: ${checked ? "Enabled" : "Disabled"}`)
    }

    const handleDeleteConfirm = (checked) => {
        setDeleteConfirm(checked);
        localStorage.setItem('deleteConfirm', checked);
        addNotification(NotificationType.SUCCESS, `Confirm Deletion: ${checked ? "Enabled" : "Disabled"}`)
    }

    const handleShowDates = (checked) => {
        setShowDates(checked);
        localStorage.setItem('showDates', checked);
        addNotification(NotificationType.SUCCESS, `Show Due Dates: ${checked ? "Enabled" : "Disabled"}`)
    }

    const handleChange = (event) => {
        const { name, checked } = event.target;
        setState((prevState) => ({ ...prevState, [name]: checked, }));

        switch (name) {
            case 'dark':
                toggleTheme();
                addNotification(NotificationType.SUCCESS, `Theme: ${theme == "light" ? "Dark Mode Enabled" : "Light Mode Enabled"}`)
                break;
            case 'newtasks':
                handleTaskOnTop(checked);
                break;
            case 'sound':
                handlePlayCompleteSound(checked);
                break;
            case 'confirm':
                handleDeleteConfirm(checked);
                break;
            case 'dates':
                handleShowDates(checked);
                break;
        }
    };

    return (
        <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">General Settings</FormLabel>
            <FormGroup>
                <div style={styles.option}>
                    <Typography>Display new task at the top</Typography>
                    <FormControlLabel style={styles.optionSwitch} control={<Switch checked={state.newtasks} onChange={handleChange} name="newtasks" />} />
                </div>
                <div style={styles.option}>
                    <Typography>Play Complete Sound</Typography>
                    <FormControlLabel style={styles.optionSwitch} control={<Switch checked={state.sound} onChange={handleChange} name="sound" />} />
                </div>
                <div style={styles.option}>
                    <Typography>Confirm before deleting task</Typography>
                    <FormControlLabel style={styles.optionSwitch} control={<Switch checked={state.confirm} onChange={handleChange} name="confirm" />} />
                </div>
                <div style={styles.option}>
                    <Typography>Show dates and time in task container</Typography>
                    <FormControlLabel style={styles.optionSwitch} control={<Switch checked={state.dates} onChange={handleChange} name="dates" />} />
                </div>
                <div style={styles.option}>
                    <Typography>Toggle Dark Mode</Typography>
                    <FormControlLabel style={styles.optionSwitch} control={<Switch checked={state.dark} onChange={handleChange} name="dark" />} />
                </div>
            </FormGroup>
            <FormHelperText>Unfinished Settings Page</FormHelperText>
        </FormControl>
    );
}