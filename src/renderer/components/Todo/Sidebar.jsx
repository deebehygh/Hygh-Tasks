import React, { useState, useEffect } from 'react';
import { useTheme, themes } from "../Settings/Themes";

export const Sidebar = ({ setFilter }) => {
    const { currentTheme } = useTheme();
    return (
        <div className='sidebar'>
            <label className={`${themes[currentTheme].text}`}>Sort By:</label>
            <select onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
            </select>
        </div>
    );
}