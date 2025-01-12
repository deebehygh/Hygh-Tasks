import React, { useState, useEffect } from 'react'
import { useTheme } from '@mui/material/styles';
import ThemeSidebar from './SettingSidebar';
import Footer from '../Home/components/Footer';

const Settings = ({ 
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
    newCategory,
    setNewCategory
}) => {
    const theme = useTheme();

    const styles = {
        mainContainer: {
            maxWidth: "60em",
            width: "auto",
            textAlign: "center",
            margin: "20px auto",
            color: theme.palette.text.primary
        },
        mainSettingsContainer: {
            height: "100%",
            borderRaidus: "5px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.4)",
            justifyContent: "center"
        }
    }

    return (
        <>
        <div style={styles.mainContainer}>
            <h3>Settings</h3>
            <div style={styles.mainSettingsContainer}>
                <ThemeSidebar 
                    categories={categories}
                    setCategories={setCategories}
                    taskOnTop={taskOnTop} 
                    setTaskOnTop={setTaskOnTop} 
                    menuItems={menuItems} 
                    setSelectedMenu={setSelectedMenu}
                    completeSound={completeSound}
                    setCompleteSound={setCompleteSound}
                    deleteConfirm={deleteConfirm}
                    setDeleteConfirm={setDeleteConfirm}
                    showDates={showDates}
                    setShowDates={setShowDates} 
                />
            </div>
            
        </div>
        </>
    );
};

export default Settings;