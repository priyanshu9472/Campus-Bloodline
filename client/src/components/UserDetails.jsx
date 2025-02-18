import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner'; // Assuming you have a LoadingSpinner component
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const UserDetails = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeDonation, setActiveDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const showNotification = useNotification();

  const handleCompletedDrive = async (drive) => {
    const confirmCompletion = window.confirm(`Are you sure that your donation is completed at ${drive?.venue}?`);
    if (confirmCompletion) {
      try {
        const token = localStorage.getItem('jwtToken');
        const data = {
          donor: drive?.acceptedBy?._id,
          bloodQuantity: drive?.bloodQuantity,
          beneficiary: drive?.beneficiary,
          venue: drive?.venue,
          datetime: drive?.datetime
        }
        // console.log(data)
        const response = await axios.post('/api/donations/create', JSON.stringify(data), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status == 201) {
          try {
            const delete_drive_id = drive?._id;
            const token = localStorage.getItem('jwtToken');
            await axios.delete(`/api/donation-event/delete/${drive?.id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            setActiveDonation(activeDonation.filter(drive => drive.id !== delete_drive_id));
            showNotification("Donation Completed Successfully!", "success")
          } catch (error) {
            console.error(error);
          }
        }
      }
      catch (error) {
        console.error(error);
      }
    }
  }

  const handleCancelDrive = async (drive_id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel your acceptance of this donation drive?");
    if (confirmCancel) {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.post('/api/donation-event/cancel', { eventId: drive_id }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 200) {
          setActiveDonation(null);

          showNotification("Your acceptance has been canceled!");
        }
      } catch (error) {
        console.error('Error canceling acceptance:', error.response?.data || error.message);
        alert('Error canceling acceptance: ' + (error.response?.data || error.message));
      }
    }
  };


  useEffect(() => {
    const fetchActiveDonationEvent = async () => {
      try {
        const jwtToken = localStorage.getItem('jwtToken'); // Retrieve the token from local storage
        const response = await axios.get('/api/donation-event/active-event', {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        // console.log(response.data)
        // Set the active donation event data
        setActiveDonation(response.data.event !== 'N/A' ? response.data.event : null);
      } catch (error) {
        console.error('Error fetching active donation event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveDonationEvent();
  }, []);


  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  return (
    
    <div className="container my-4">
      <div className="mb-4">
        <h2 className="text-center text-primary mb-4">User Details</h2>
        <ul className="list-group shadow">
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <strong>Username:</strong> <span>{user?.username}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <strong>Email:</strong> <span>{user?.email}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <strong>Blood Group:</strong> <span>{user?.bloodgroup}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <strong>Address:</strong> <span>{user?.address}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <strong>Phone:</strong> <span>{user?.phone}</span>
          </li>
        </ul>
      </div>

      {/* Active Donation Drive Table */}
      
      { user?.role === 'donor' ? <div className="my-4">
        <h3 className="text-center text-success mb-3">Active Donation Drive</h3>
        <div className="table-responsive">
          <table className="table table-striped table-hover shadow">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Blood Quantity (ml)</th>
                <th scope="col">Beneficiary</th>
                <th scope="col">Venue</th>
                <th scope="col">DateTime</th>
                <th scope="col">Status</th>
                <th colSpan={2}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeDonation ? (
              <tr>
                <td>{activeDonation.bloodQuantity}</td>
                <td>{activeDonation.beneficiary}</td>
                <td>{activeDonation.venue}</td>
                <td>{activeDonation.datetime}</td>
                <td><span className="txt">Accepted</span></td>
                <td>
                  <button className='btn btn-outline-danger' onClick={() => { handleCancelDrive(activeDonation.id) }}>Cancel</button>
                </td>
                <td>
                  <button className="btn btn-outline-success" onClick={() => { handleCompletedDrive(activeDonation) }}>
                    Mark as Completed
                  </button>
                </td>

              </tr>
              ) : (
              <tr>
                <td colSpan="6" className="text-center">No active donation drive</td>
              </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>:  <></>}
    </div>
  );
};

export default UserDetails;
