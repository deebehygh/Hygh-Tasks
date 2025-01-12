import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeContextProvider } from './components/Settings/Theme/ThemeContextProvider';
import { NotificationProvider } from './components/Misc/Notifications';
import App from './App';

import './index.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode> 
    <NotificationProvider>
    <ThemeContextProvider>
        <App />
    </ThemeContextProvider>,
    </NotificationProvider>
  </React.StrictMode>
);
