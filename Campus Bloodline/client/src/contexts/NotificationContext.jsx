// src/components/NotificationContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Create Notification Context
const NotificationContext = createContext();

// Provider Component
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const location = useLocation();

  // Show Notification with type
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });

    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Clear notification on route change
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, location]);

  // Font Awesome icons for each notification type
  const iconMap = {
    success: <i className="fas fa-check-circle"></i>,
    info: <i className="fas fa-info-circle"></i>,
    warning: <i className="fas fa-exclamation-triangle"></i>,
    danger: <i className="fas fa-times-circle"></i>,
  };

  // Background color gradient based on notification type
  const gradientMap = {
    success: 'linear-gradient(45deg, #4caf50, #81c784)',
    info: 'linear-gradient(45deg, #2196f3, #64b5f6)',
    warning: 'linear-gradient(45deg, #ff9800, #ffb74d)',
    danger: 'linear-gradient(45deg, #f44336, #e57373)',
  };

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      {notification && (
        <div
          className={`alert alert-dismissible fade show`}
          role="alert"
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            minWidth: '300px',
            maxWidth: '400px',
            zIndex: 1100,
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            background: gradientMap[notification.type] || gradientMap.info,
            color: '#fff',
            borderRadius: '8px',
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
            animation: 'slideIn 0.5s ease-out',
          }}
        >
          <div style={{ fontSize: '1.5rem', marginRight: '1rem' }}>
            {iconMap[notification.type] || iconMap.info}
          </div>
          <div style={{ flex: 1 }}>
            <strong style={{ textTransform: 'capitalize' }}>
              {notification.type}:
            </strong>{' '}
            {notification.message}
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            style={{ marginLeft: '1rem' }}
            onClick={() => setNotification(null)}
            aria-label="Close"
          ></button>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

// Hook to use the Notification Context
export const useNotification = () => useContext(NotificationContext);
