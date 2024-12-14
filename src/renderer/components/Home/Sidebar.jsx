// src/renderer/components/Sidebar.jsx
import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Gamepad, Download, Home, Settings, UserIcon } from 'lucide-react';
import { useTheme, themes } from '../Settings/Themes.jsx';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const { currentTheme } = useTheme();

    return (
        <div
            className={`w-[30px] ${themes[currentTheme].sidebar} flex flex-col items-center py-4 space-y-4`}
            style={{ WebkitAppRegion: 'no-drag' }} 
        >
            <div style={{ width: '100%', height: '30px', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
            <Tooltip.Provider>
                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        <div onClick={() => setActiveTab('home')}
                            className={`text-gray-300 hover:text-white cursor-pointer ${activeTab === 'home' ? 'text-white' : ''}`}>
                            <Home size={20} />
                        </div>
                    </Tooltip.Trigger>
                    <Tooltip.Content side="right" className="tooltip-content">
                        <div className={`${themes[currentTheme].card} text-white px-2 py-1 rounded shadow-lg`}>
                            Home
                        </div>
                    </Tooltip.Content>
                </Tooltip.Root>

                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        <div
                            className={`text-gray-300 hover:text-white cursor-pointer ${activeTab === 'settings' ? 'text-white' : ''
                                }`}
                            onClick={() => setActiveTab('settings')}
                        >
                            <Settings size={20} />
                        </div>
                    </Tooltip.Trigger>
                    <Tooltip.Content side="right" className="tooltip-content">
                        <div className={`${themes[currentTheme].card} text-white px-2 py-1 rounded shadow-lg`}>
                            Options
                        </div>
                    </Tooltip.Content>
                </Tooltip.Root>
            </Tooltip.Provider>
        </div>
    );
};

export default Sidebar;