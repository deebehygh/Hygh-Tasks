import React, { useState, useEffect } from 'react';
import { useTheme, themes } from './Themes';
import { Check } from 'lucide-react';

const Settings = () => {
    const { currentTheme, setCurrentTheme } = useTheme();
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setSaved(true)
    }, []);

    const themeOptions = [
        { id: 'light', name: 'Light' },
        { id: 'dark', name: 'Dark' },
        { id: 'darkPurple', name: 'Purple' },
        { id: 'darkPastelBlue', name: 'Dark Blue' },
        { id: 'darkPastelGreen', name: 'Pine' },
        { id: 'solarizedLight', name: 'Solarized Light' },
        { id: 'solarizedDark', name: 'Solarized Dark' },
        { id: 'monochrome', name: 'Monochrome' }
    ];

    return (
        <div className={`flex-1 ${themes[currentTheme].bg} p-6 overflow-auto custom-scrollbar`}>
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-2xl font-bold ${themes[currentTheme].text}`}>
                        Settings
                    </h2>
                    {saved && (
                        <div className="flex items-center gap-2 text-green-500">
                            <Check size={20} />
                            <span>Settings saved</span>
                        </div>
                    )}
                </div>
                <div className={`bg-opacity-50 rounded-lg p-6 mb-6 ${themes[currentTheme].card}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${themes[currentTheme].text}`}>
                        Theme
                    </h3>
                    <div className="grid gap-4">
                        {themeOptions.map(theme => (
                            <div
                                key={theme.id}
                                onClick={() => setCurrentTheme(theme.id)}
                                className={`relative cursor-pointer p-4 rounded-lg transition-all duration-200 
                                           ${currentTheme === theme.id ? `ring-2 ring-${themes[theme.id].button.split('bg-')[1]}` : 'hover:bg-opacity-80'}
                                           ${themes[theme.id].card} ${themes[theme.id].text}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">{theme.name}</h3>
                                    </div>
                                    {currentTheme === theme.id && (
                                        <Check size={20} className={themes[theme.id].button.replace('bg-', 'text-')} />
                                    )}
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <div className={`w-6 h-6 rounded ${themes[theme.id].sidebar}`}></div>
                                    <div className={`flex-1 h-6 rounded ${themes[theme.id].bg}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> 
            </div>
        </div>
    );
};

export default Settings;