// src/renderer/components/Notifications.jsx
import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Info, X } from 'lucide-react';
import { Alert } from '@mui/material';

export const NotificationType = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning'
};

// Create a context for notifications
export const NotificationContext = React.createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = React.useState([]);

    const addNotification = (type, message, duration = 5000) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, type, message }]);

        // Auto remove after duration
        if (duration) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ addNotification, removeNotification }}>
            {children}
            <NotificationContainer notifications={notifications} onRemove={removeNotification} />
        </NotificationContext.Provider>
    );
};

// Hook to use notifications
export const useNotifications = () => {
    const context = React.useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

// Notification container to display notifications
const NotificationContainer = ({ notifications, onRemove }) => {
    const containerStyle = {
      position: "fixed",
      top: "20px",
      right: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      zIndex: 1000,
    };
  
    return (
      <div style={containerStyle}>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onRemove={onRemove}
          />
        ))}
      </div>
    );
  };
  
  // Single notification component with animations
  const Notification = ({ notification, onRemove }) => {
    const [visible, setVisible] = React.useState(false);
  
    React.useEffect(() => {
      // Trigger slide-in animation
      setVisible(true);
  
      // Trigger slide-out animation before removal
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onRemove(notification.id), 350); // Wait for slide-out animation
      }, notification.duration || 5000);
  
      return () => clearTimeout(timer);
    }, [notification, onRemove]);
  
    const notificationStyle = {
      transform: visible ? "translateX(0)" : "translateX(100%)",
      transition: "transform 0.3s ease-in-out",
      backgroundColor: "white",
      border: `1px solid ${getColor(notification.type)}`,
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      padding: "10px 15px",
      color: "#333",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",
    };
  
    return (
      <div style={notificationStyle}>
        {getIcon(notification.type)}
        <span>{notification.message}</span>
        <button
          onClick={() => onRemove(notification.id)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#999",
          }}
        >
          <X size={16} />
        </button>
      </div>
    );
  };
  
  // Helper functions to style notifications
  const getColor = (type) => {
    switch (type) {
      case NotificationType.SUCCESS:
        return "green";
      case NotificationType.ERROR:
        return "red";
      case NotificationType.INFO:
        return "blue";
      case NotificationType.WARNING:
        return "orange";
      default:
        return "#ccc";
    }
  };
  
  const getIcon = (type) => {
    switch (type) {
      case NotificationType.SUCCESS:
        return <CheckCircle color="green" />;
      case NotificationType.ERROR:
        return <XCircle color="red" />;
      case NotificationType.INFO:
        return <Info color="blue" />;
      case NotificationType.WARNING:
        return <AlertCircle color="orange" />;
      default:
        return null;
    }
  };