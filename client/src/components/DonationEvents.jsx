import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import { NotificationProvider, useNotification } from '../contexts/NotificationContext';
import { useFormState } from 'react-hook-form';
import UserPopper from './UserPopper';
import { unitsToMl } from '../utils/bloodQuantity';

const DonationEvents = () => {
  const { user, loading: authLoading } = useAuth();
  const [donationDrives, setDonationDrives] = useState([]);
  const [hasActiveEvent, setHasActiveEvent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptMessage] = useState("Donation Accepted!");
  const [acceptedDonorId, setAcceptedDonorId] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const showNotification = useNotification();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedUser(null);
  };
  const handleUserDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const fetchDonationDrives = async () => {
    setLoading(true); // Ensure loading state is set at the beginning
    try {
      const token = localStorage.getItem('jwtToken');
      const apiEndpoint = location.pathname.includes('/dashboard')
        ? '/api/donation-event/get-all'
        : '/api/donation-event/get-all-unaccepted';

      const headers = location.pathname.includes('/dashboard')
        ? { 'Authorization': `Bearer ${token}` }
        : {};

      const response = await axios.get(apiEndpoint, { headers });
      if(user) {
      (user?.role === 'admin') ? setDonationDrives(response.data.events) : setDonationDrives(response.data.events.filter((item) => {return item.bloodgroup === user.bloodgroup}));

      } else {
        setDonationDrives(response.data.events);
      }

    
      
      setHasActiveEvent(response.data.hasActiveEvent)
      setAcceptedDonorId(() => {
        if (response.data.hasActiveEvent) {
          const activeItem = response.data.events.filter((item, i) => {
            return item.acceptedBy != null;
          })

          return activeItem[0].acceptedBy._id;
        }

      })
    } catch (error) {
      setError(error.response?.data || error.message);
    } finally {
      setLoading(false); // Always set loading to false in the end
    }
  };

  useEffect(() => {
    if (location.pathname.includes('/dashboard') && !authLoading) { // Fetch only if auth loading is complete
      fetchDonationDrives();
    } else { fetchDonationDrives() }
  }, [authLoading, location.pathname]);

  const handleAccept = async (id) => {
    if (!location.pathname.includes('/dashboard')) { navigate('/login'); return }
    setDonationDrives(donationDrives.map(drive =>
      drive._id === id ? { ...drive, status: 'Accepted', acceptedBy: { _id: user._id, username: user.username } } : drive
    ));

    try {
      const token = localStorage.getItem('jwtToken');
      await axios.post('/api/donation-event/accept', {
        eventId: id,
        userId: user?.id,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      showNotification("You have accepted donation event!", 'success')
      setHasActiveEvent(true)
      setAcceptedDonorId(user?.id);
    } catch (error) {
      setDonationDrives(donationDrives.map(drive =>
        drive._id === id ? { ...drive, status: null, acceptedBy: null } : drive
      ));
      console.error('Error accepting donation event:', error.response?.data || error.message);
      alert('Error accepting donation event: ' + (error.response?.data || error.message));
    }
  };

  const handleDelete = async (id, venue) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this donation from ${venue}?`);
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('jwtToken');
        await axios.delete(`/api/donation-event/delete/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setDonationDrives(donationDrives.filter(drive => drive._id !== id));
        showNotification('Donation event deleted successfully!', 'danger');
      } catch (error) {
        console.error(error);
        alert('Error deleting donation event: ' + (error.response?.data || error.message));
      }
    }
  };

  const handleCompletedDrive = async (drive) => {
    const confirmCompletion = window.confirm(`Are you sure that your donation is completed at ${drive?.venue}?`);
    if (confirmCompletion) {
      try {
        const token = localStorage.getItem('jwtToken');
        const data = {
          donor: user?._id,
          bloodQuantity: drive?.bloodQuantity,
          beneficiary: drive?.beneficiary,
          venue: drive?.venue,
          datetime: drive?.datetime
        };
        data.donor = user?.id;

        const response = await axios.post('/api/donations/create', JSON.stringify(data), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 201) {
          await axios.delete(`/api/donation-event/delete/${drive._id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setDonationDrives(donationDrives.filter(d => d._id !== drive._id));
          showNotification("Donation Completed Successfully!", 'success');
          navigate('/dashboard/donation-history');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleCancelDrive = async (drive_id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel your acceptance of this donation drive?");
    if (confirmCancel) {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.post('/api/donation-event/cancel', { eventId: drive_id }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 200) {
          setDonationDrives(donationDrives.map(drive =>
            drive._id === drive_id ? { ...drive, status: null, acceptedBy: null } : drive
          ));
          showNotification("Your acceptance has been canceled!");
          setHasActiveEvent(false)
        }
      } catch (error) {
        console.error('Error canceling acceptance:', error.response?.data || error.message);
        alert('Error canceling acceptance: ' + (error.response?.data || error.message));
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error fetching donation drives: {error}</div>;
  }

  return (
    <div className="container my-5" id='upcoming-drives'>
      {donationDrives.length != 0 ?
        <h2 className="text-center mb-4 text-danger display-4">Available Donation Drives</h2> : <p className='text-center'>{user && user?.role != 'admin' ? `No Donation Events Available for ${user.bloodgroup} blood group` : "No Donation Events Available"}</p>
      }<div className="row justify-content-center">
        <div className="col-md-10">
          {donationDrives.map((drive) => (
            <div key={drive._id} className="card donation-card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">
                  <span className="badge bg-primary me-2">{drive.bloodQuantity} Units</span>
                  <span className="badge bg-primary me-2">{unitsToMl(drive.bloodQuantity)} ml</span>
                  Beneficiary: <strong>{drive.beneficiary}</strong>
                </h5>
                <p className="card-text">
                  <i className="fas fa-tint me-2 text-danger"></i> <strong>Blood Group:</strong> {drive.bloodgroup} <br />
                  <i className="fas fa-tint me-2 text-danger"></i> <strong>Blood Quantity:</strong> {drive.bloodQuantity} units <br />
                  <i className="fas fa-map-marker-alt me-2 text-danger"></i> <strong>Venue:</strong> {drive.venue} <br />
                  <i className="fas fa-calendar-alt me-2 text-danger"></i> <strong>Date & Time:</strong> {new Date(drive.datetime).toLocaleString()}
                </p>
                <p className="card-text">
                  <strong>Message:</strong> {drive.message}
                </p>
                {drive.status !== 'Accepted' ? (
                  user?.role === 'admin' ? (
                    <div className="d-flex justify-content-evenly">
                      <div>
                        <i className="fas fa-circle-exclamation text-warning me-2" style={{ fontSize: '1.5rem' }}></i>
                        <span className="text-warning fs-5">Not Accepted</span>
                      </div>
                      <div>
                        <Link to={`/dashboard/update-drive/${drive._id}`} className='btn btn-secondary mx-4'>Update</Link>
                        <button className='btn btn-danger' onClick={() => handleDelete(drive._id, drive.venue)}>
                          Delete
                        </button>
                      </div>
                    </div>

                  ) : (
                    <button
                      className="btn btn-success btn-lg w-100"
                      onClick={() => handleAccept(drive._id)}
                      disabled={hasActiveEvent}
                    >
                      Accept Donation Drive
                    </button>
                  )
                ) : (
                  <div className="d-flex justify-content-evenly">
                    <div className='d-flex justify-content-evenly'>
                      <i className="fas fa-check-circle text-success me-2" style={{ fontSize: '1.5rem' }}></i>
                      <span className="text-success fs-5">{acceptMessage}</span>
                      {user?.id === acceptedDonorId && (
                        <div className='mx-4' >
                          <button className='btn btn-danger' onClick={() => handleCancelDrive(drive._id)}>Cancel</button>
                          <button className='btn btn-primary mx-4' onClick={() => handleCompletedDrive(drive)}>Mark As Completed</button>
                        </div>
                      )}
                    </div>
                    {user?.role === 'admin' && (
                      <Link className='text-dark' onClick={() => handleUserDetails(drive.acceptedBy)}><strong>Accepted By: </strong> {drive.acceptedBy?.username}</Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* User Details Modal */}
      {selectedUser && (
        <UserPopper
          show={showModal}
          handleClose={handleModalClose}
          user={selectedUser}
        />
      )}
    </div>

  );
};



export default DonationEvents;
