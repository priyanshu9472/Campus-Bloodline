import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './layouts/layouts.css';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import UserDashboardLayout from './layouts/UserDashboardLayout';
import UserDetails from './components/UserDetails';
import DonationHistory from './components/DonationHistory';
import './components/components.css';
import WebsiteLayout from './layouts/WebsiteLayout';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegisterForm';
import ForgotPassword from './components/ForgotPassword';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import DonationEvents from './components/DonationEvents';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import DonationDriveForm from './components/DonationDriveForm';
import ResetPassword from './components/ResetPassword';

const AppRoutes = () => {
  const { user, adminExistance } = useAuth(); // Get the user state from the context
  return (
    <Routes>
      {/* Public Routes (Website Layout) */}
      <Route path="/" element={<WebsiteLayout />}>
        {/* Redirect to dashboard if user is signed in */}
        <Route index element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginForm />} />
        <Route path="/admin-login" element={user ? <Navigate to="/dashboard" replace /> : <LoginForm />} />
        <Route path="/logout" element={user ? <Navigate to="/dashboard" replace /> : <LoginForm />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegistrationForm userRole="donor" />} />

        {/* Conditionally display the admin registration route */}
        {!adminExistance ? (
          <Route path="/admin-register" element={user ? <Navigate to="/dashboard" replace /> : <RegistrationForm userRole="admin" />} />
        ) : null}

        <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} />
        <Route path="/reset-password/:token" element={user ? <Navigate to="/dashboard" replace /> : <ResetPassword />} />
      </Route>

      {/* Protected Routes (Dashboard) */}
      <Route path="/dashboard" element={user ? <UserDashboardLayout /> : <Navigate to="/login" replace />}>
        {/* Default route for admin: Redirect to AdminAnalyticsPage */}
        <Route
          index
          element={
            user?.role === "admin" ? (
              <Navigate to="/dashboard/admin-analytics" replace />
            ) : (
              <UserDetails />
            )
          }
        />

        {/* Admin Analytics Page (for admin only) */}
        <Route path="/dashboard/admin-analytics" element={user?.role === "admin" ? <AdminAnalyticsPage /> : <Navigate to="/dashboard" replace />} />

        {/* Admin registration route within the dashboard (for admin access only) */}
        {adminExistance && user?.role === "admin" ? (
          <Route path="/dashboard/admin-register" element={<RegistrationForm userRole={"admin"} />} />
        ) : null}

        {/* User Details Page */}
        <Route path="/dashboard/user-details" element={<UserDetails />} />
        {/* Donation History */}
        <Route path="/dashboard/donation-history" element={<DonationHistory />} />
        {/* Donation Events */}
        <Route path="/dashboard/donation-events" element={<DonationEvents />} />
        <Route path="/dashboard/create-donation-event" element={<DonationDriveForm />} />
        <Route path="/dashboard/update-drive/:id" element={<DonationDriveForm />} />
      </Route>

      {/* Fallback route for undefined paths */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <NotificationProvider>
          <AppRoutes /> {/* Use the AppRoutes component */}
        </NotificationProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
