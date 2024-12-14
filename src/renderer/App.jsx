// src/renderer/App.jsx
import React, { useState } from 'react';
import { ThemeProvider, useTheme, themes } from './components/Settings/Themes';
import Sidebar from './components/Home/Sidebar';
import Settings from './components/Settings/Settings';
import { Home } from './components/Home/Home';

const AppContent = () => {
    const [activeTab, setActiveTab] = useState('home');
    const { currentTheme } = useTheme();

    return (
        <>
          <div className={`${themes[currentTheme].bg}`}>
              <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
              {activeTab === 'home' && <Home />}
              {activeTab === 'settings' && <Settings />}
          </div>
        </>
    );
};

const App = () => {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
};

export default App;