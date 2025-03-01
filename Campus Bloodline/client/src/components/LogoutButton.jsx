import React from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { logout, user } = useAuth();
  const showNotification =  useNotification()
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/users/logout', {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (response.status === 200) {
        // Handle successful logout response
        logout();
        if (user?.role === 'admin') navigate("/admin-login");
        else navigate("/login")
        showNotification("Logout Successful!", 'success')
      }
    } catch (error) {
      console.error("Error during logout: ", error.response ? error.response.data : error.message);
    } finally {
      // Clear the token from local storage
      localStorage.removeItem('jwtToken');
      // Optionally, redirect to the login page
      
    }
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      Logout
    </button>
  );
};

export default LogoutButton;
