import React, { useState } from 'react';
import axios from 'axios';
import { useNotification } from '../contexts/NotificationContext.jsx';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const showNotification = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Send POST request to backend endpoint
      const response = await axios.post('/api/users/forgot-password', { email });
      setSubmitted(true);
      if (response.status == 200) {
        showNotification("Link sent at your email!")
      }
      
      setError('');
    } catch (error) {
      console.error('Error sending reset link:', error);
      setError('Failed to send reset link. Please check your email and try again.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2 className="text-center text-danger mb-4">Forgot Password</h2>
      <p className="text-center">
        Enter your email address below, and we'll send you a link to reset your password.
      </p>

      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-danger text-center mt-2">{error}</p>}
          <button type="submit" className="btn btn-danger btn-block mt-3">
            Send Reset Link
          </button>
        </form>
      ) : (
        <p className="text-success text-center mt-4">
          A password reset link has been sent to <strong>{email}</strong>.
        </p>
      )}
    </div>
  );
};

export default ForgotPassword;
