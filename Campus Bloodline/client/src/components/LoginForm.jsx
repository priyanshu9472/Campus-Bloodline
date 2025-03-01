import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { useNotification } from '../contexts/NotificationContext';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginError, setLoginError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Initialize useLocation to get the current path
  const showNotification = useNotification();
  useEffect(() => {
    if (location.pathname.includes('admin')) {
      setIsAdmin(true);
    }
  }, [])

  const onSubmit = async (data) => {
    try {
      // Check the location pathname to determine the endpoint
      const endpoint = location.pathname.includes("admin")
        ? '/api/users/login-admin'
        : '/api/users/login';

      const response = await axios.post(endpoint, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        login(token);
        showNotification("Login Successful!", "success");

        // Navigate to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      setLoginError('Invalid email or password. Please try again.');
      console.error("Error during login: ", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4 text-danger">{isAdmin ? 'Admin Login' : 'Login to Campus Bloodline'}</h2>
          {loginError && <div className="alert alert-danger">{loginError}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="border p-4 shadow-sm bg-white">
            {/* Email Field */}
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                id="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Enter a valid email address',
                  }
                })}
              />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>

            {/* Password Field */}
            <div className="form-group mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters long',
                  }
                })}
              />
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>

            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-danger">Login</button>
            </div>

            <div className="d-flex justify-content-between mt-3">
              <Link to="/forgot-password" className="text-danger">Forgot Password?</Link>
              {isAdmin ? <></> :

                <Link to="/register" className="text-danger">Register here</Link>
              }
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
