// src/components/RegistrationForm.js
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNotification } from '../contexts/NotificationContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const RegistrationForm = ({ userRole }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState(''); // State to hold error messages
  const [isAdmin, setIsAdmin] = useState(false);
  const showNotification = useNotification(); // Get the notification function

  const navigate = useNavigate();

  useEffect(() => {
    if (userRole === 'admin') {
      setIsAdmin(true);
    }
  })
  const onSubmit = async (data) => {

    data.role = userRole; // default role of user for all registration

    // console.log("Registration Data: ", data);
    try {
      const response = await axios.post('/api/users/register', JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle successful registration
      if (response.status === 201) { // Assuming 201 is returned for successful registration
        showNotification("Registration Successful!", "success"); // Show success notification
        // Redirect or perform any further actions here
        if (userRole === 'admin') {
          navigate('/admin-login')
        } else
        navigate('/login'); // Redirect to login page after successful registration
      }
    } catch (error) {
      console.error("Error during registration: ", error.response ? error.response.data : error.message);
      // Set the error message to display to the user
      setErrorMessage(error.response ? error.response.data.message : "Registration failed. Please try again.");
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="text-center mb-4 text-danger">{isAdmin ? "Admin Registration" : "Register for Campus Bloodline"}</h2>

          {/* Display error message if exists */}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="border p-4 shadow-sm bg-white">
            {/* Username Field */}
            <div className="form-group mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                placeholder="Enter your username"
                {...register('username', { required: 'Username is required' })}
              />
              {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
            </div>

            {/* Email Field */}
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">Email</label>
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

            {/* Blood Group Selector */}
            <div className="form-group mb-3">
              <label htmlFor="bloodgroup" className="form-label">Blood Group</label>
              <select
                id="bloodgroup"
                className={`form-control ${errors.bloodgroup ? 'is-invalid' : ''}`}
                {...register('bloodgroup', { required: 'Blood group is required' })}
              >
                <option value="">Select your blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
              {errors.bloodgroup && <div className="invalid-feedback">{errors.bloodgroup.message}</div>}
            </div>

            {/* Address Field */}
            <div className="form-group mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <textarea
                id="address"
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                placeholder="Enter your address"
                rows="3"
                {...register('address', { required: 'Address is required' })}
              ></textarea>
              {errors.address && <div className="invalid-feedback">{errors.address.message}</div>}
            </div>

            {/* Phone Number Field */}
            <div className="form-group mb-3">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                type="tel"
                id="phone"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                placeholder="Enter your phone number"
                {...register('phone', {
        
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Enter a valid 10-digit phone number',
                  }
                })}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
            </div>

            {/* Buttons and Links */}
            <div className="d-flex justify-content-between mt-4">
              {isAdmin ? <></> :
                <Link to="/login" className="text-danger">Already have an account? Login</Link>
              }
              <button type="submit" className="btn btn-danger">Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
