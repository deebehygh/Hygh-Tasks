import React, { useState, useEffect } from 'react';

export const DesktopNotification = () => {
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const showNotification = (title, message) => {
    if (isPermissionGranted) {
      new Notification(title, {
        body: message,
        tag: 'by DeeBeHygh'
      });
    }
  };
  useEffect(() => {
    if (Notification.permission === 'granted') {
      setIsPermissionGranted(true);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setIsPermissionGranted(true);
        }
      });
    }
  }, []);
  return { showNotification }
}
