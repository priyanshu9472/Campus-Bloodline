import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';

const DonationDriveForm = () => {
  const { id } = useParams();
  const showNotification = useNotification();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  useEffect(() => {
    const fetchDonationDrive = async () => {
      if (id) {
        try {
          const token = localStorage.getItem('jwtToken');
          const response = await axios.get(`/api/donation-event/get/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          // Populate the form fields with the fetched data
          // console.log(response.data);
          const { bloodQuantity, message, beneficiary, venue, datetime, bloodgroup } = response.data.event;

          // Set values for the form fields
          setValue('bloodQuantity', bloodQuantity);
          setValue('bloodgroup', bloodgroup);
          setValue('message', message);
          setValue('beneficiary', beneficiary);
          setValue('venue', venue);
          setValue('datetime', formatdatetime(datetime)); // Format datetime before setting
        } catch (error) {
          console.error('Error fetching donation drive:', error.response?.data || error.message);
        }
      }
    };

    fetchDonationDrive();
  }, [id, setValue]);

  // Function to format the datetime for input
  const formatdatetime = (datetime) => {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Return formatted datetime string
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const url = id ? `/api/donation-event/update/${id}` : '/api/donation-event/create';
      const method = id ? 'put' : 'post';
      // console.log(data);
      const response = await axios({
        method,
        url,
        data: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // console.log('Donation Drive', id ? 'updated' : 'created', 'successfully:', response.data);
      reset();
      navigate('/dashboard/donation-events');
      showNotification(`Donation Event ${id ? 'updated': 'created'} successfully! `, 'success')
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    }
  };

  return (
    <div className="container my-5" >
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="text-center mb-4 text-danger">{id ? 'Update' : 'Add'} Donation Drive Details</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="border p-4 shadow-sm bg-white">

            {/* Blood Group Selector */}
            <div className="form-group mb-3">
              <label htmlFor="bloodgroup" className="form-label">Blood Group</label>
              <select
                id="bloodgroup"
                className={`form-control ${errors.bloodgroup ? 'is-invalid' : ''}`}
                {...register('bloodgroup', { required: 'Blood group is required' })}
              >
                <option value="">Select blood group</option>
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

            {/* Blood in ML Field */}
            <div className="form-group mb-3">
              <label htmlFor="bloodQuantity" className="form-label">Required Blood (in Units)</label>
              <input
                type="number"
                id="bloodQuantity"
                className={`form-control ${errors.bloodQuantity ? 'is-invalid' : ''}`}
                placeholder="Enter the required blood in units"
                {...register('bloodQuantity', { required: 'Blood amount is required' })}
              />
              {errors.bloodQuantity && <div className="invalid-feedback">{errors.bloodQuantity.message}</div>}
            </div>

            {/* Message Field */}
            <div className="form-group mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                id="message"
                className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                placeholder="Enter a message for the donation drive"
                rows="3"
                {...register('message', { required: 'Message is required' })}
              ></textarea>
              {errors.message && <div className="invalid-feedback">{errors.message.message}</div>}
            </div>

            {/* Beneficiary Field */}
            <div className="form-group mb-3">
              <label htmlFor="beneficiary" className="form-label">Beneficiary</label>
              <input
                type="text"
                id="beneficiary"
                className={`form-control ${errors.beneficiary ? 'is-invalid' : ''}`}
                placeholder="Enter the beneficiary's name"
                {...register('beneficiary', { required: 'Beneficiary is required' })}
              />
              {errors.beneficiary && <div className="invalid-feedback">{errors.beneficiary.message}</div>}
            </div>

            {/* Venue Field */}
            <div className="form-group mb-3">
              <label htmlFor="venue" className="form-label">Venue</label>
              <input
                type="text"
                id="venue"
                className={`form-control ${errors.venue ? 'is-invalid' : ''}`}
                placeholder="Enter the venue for the donation drive"
                {...register('venue', { required: 'Venue is required' })}
              />
              {errors.venue && <div className="invalid-feedback">{errors.venue.message}</div>}
            </div>

            {/* Date and Time Field */}
            <div className="form-group mb-3">
              <label htmlFor="datetime" className="form-label">Date and Time</label>
              <input
                type="datetime-local"
                id="datetime"
                className={`form-control ${errors.datetime ? 'is-invalid' : ''}`}
                {...register('datetime', { required: 'Date and time are required' })}
              />
              {errors.datetime && <div className="invalid-feedback">{errors.datetime.message}</div>}
            </div>

            {/* Submit Button */}
            <div className="d-flex justify-content-end mt-4">
              {id && <button className='btn btn-danger mx-4' onClick={() => { navigate('/dashboard/donation-events') }}>Cancel</button>}
              <button type="submit" className="btn btn-primary">{id ? 'Update' : 'Add'} Donation Drive</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default DonationDriveForm;
