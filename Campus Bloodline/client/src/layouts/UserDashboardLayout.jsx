import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import { useAuth } from '../contexts/AuthContext';

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768); // Default open on larger screens
  const { user } = useAuth();
  const navigate = useNavigate();
  const getGreeting = () => {
    const date = new Date();
    const hours = date.getHours();
    if (hours >= 5 && hours < 12) {
      return "Good Morning";
    }
    else if (hours >= 12 && hours < 17) {
      return "Good Afternoon";
    }

    else {
      return "Good Evening";
    }
  }
  const toggleSidebar = () => {
    // Toggle sidebar only on screens smaller than 768px
    if (window.innerWidth < 768) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  // Close sidebar on resize if switching to larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLinkClick = () => {
    // Close sidebar when a link is clicked
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`sidebar bg-light ${isSidebarOpen ? 'open' : ''}`}
        style={{
          width: '250px',
          minHeight: '100vh',
          position: 'fixed',
          left: isSidebarOpen ? '0' : '-250px',
          top: '0',
          transition: 'left 0.3s',
          zIndex: 1000,
        }}
      >
        {/* Campus Bloodline text only on large screens */}
        <h2 className="text-center text-danger d-none d-md-block" style={{ fontSize: '1.5rem', padding: '10px' }}>SXCMT Campus Bloodline</h2>
        {/* Blank rectangle for small screens */}
        <div className="d-md-none" style={{ width: '100%', height: '50px', backgroundColor: 'white' }} />

        <ul className="list-group">
          {user?.role === 'admin' && (
            <>
              <li className="list-group-item" style={{ border: 'none' }}>
                <Link to="/dashboard/analytics" onClick={handleLinkClick} className="text-dark" style={{ textDecoration: 'none', fontSize: '0.9rem', display: 'block', padding: '10px' }}>Analytics</Link>
              </li>

              <li className="list-group-item" style={{ border: 'none' }}>
                <Link to="/dashboard/admin-register" onClick={handleLinkClick} className="text-dark" style={{ textDecoration: 'none', fontSize: '0.9rem', display: 'block', padding: '10px' }}>Register New Admin</Link>
              </li>

              <li className="list-group-item d-md-none" style={{ border: 'none' }}>
                <Link to="/dashboard/create-donation-event" onClick={handleLinkClick} className="text-dark" style={{ textDecoration: 'none', fontSize: '0.9rem', display: 'block', padding: '10px' }}>Create Donation Event</Link>
              </li>


            </>
          )}
          <li className="list-group-item" style={{ border: 'none' }}>
            <Link to="/dashboard/user-details" onClick={handleLinkClick} className="text-dark" style={{ textDecoration: 'none', fontSize: '0.9rem', display: 'block', padding: '10px' }}>User Details</Link>
          </li>
          <li className="list-group-item" style={{ border: 'none' }}>
            <Link to="/dashboard/donation-history" onClick={handleLinkClick} className="text-dark" style={{ textDecoration: 'none', fontSize: '0.9rem', display: 'block', padding: '10px' }}>Donation History</Link>
          </li>
          <li className="list-group-item" style={{ border: 'none' }}>
            <Link to="/dashboard/donation-events" onClick={handleLinkClick} className="text-dark" style={{ textDecoration: 'none', fontSize: '0.9rem', display: 'block', padding: '10px' }}>Donation Events </Link>
          </li>


        </ul>
      </div>

      {/* Content Area */}
      <div className="content" style={{ marginLeft: isSidebarOpen ? '250px' : '0', padding: '20px', width: '100%' }}>
        {/* Fixed Sidebar Toggle Button */}
        <button
          className="btn btn-light d-md-none"
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            left: '10px',
            top: '10px',
            zIndex: 1100,
            fontSize: '1.2rem',
          }}
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>

        <header className="header d-flex justify-content-between align-items-center" style={{ padding: '10px 20px', zIndex: 900 }}>
          <h1 className="text-danger mx-4 d-md-none" style={{ fontSize: '1.5rem', margin: 0 }}>{getGreeting()}, {user?.username}</h1>
          <h1 className="text-danger d-none d-md-block" style={{ fontSize: '1.5rem', margin: 0 }}>{getGreeting()}, {user?.username}</h1>

          <div className="d-flex align-items-center">
            {user?.role === 'admin' && (
              <button
                className="btn btn-primary me-3 d-none d-md-block"
                onClick={() => navigate('/dashboard/create-donation-event')}
                style={{ fontSize: '1rem' }}
              >
                Create Donation Event
              </button>
            )}
            <LogoutButton />
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
};

export default UserDashboard;
