import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { unitsToMl } from '../utils/bloodQuantity';

export default function DonationHistory() {
    const [donationHistory, setDonationHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const showNotification = useNotification();

    const handleDeleteDonationHistory = async (donation) => {
        const inp = confirm(`Do you want to delete the donation of ${donation.donor.username} on ${donation.datetime}`);
        const token = localStorage.getItem('jwtToken');
        // console.log(donation)
        if (inp) {
            const response = await axios.delete(`/api/donations/delete/${donation._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setDonationHistory(() => {
                    const updatedHistory = donationHistory.filter((item) => {
                        return item._id != donation._id;
                    })
                    return updatedHistory;
                });
                showNotification("Donation history deleted!", 'danger');
            }
        }

    }

    useEffect(() => {
        const fetchDonationHistory = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get('/api/donations/get-all', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                // console.log(response.data)
                setDonationHistory(() => {
                    if (user.role === 'admin') {
                        return response.data;
                    }
                    else {
                        const list = (response.data.filter((value, index) => {
                            return value.donor._id === user.id
                        }))
                        return list;
                    }
                });
                // Set data from API
                setLoading(false);
            } catch (error) {
                console.error('Error fetching donation history:', error);
                setError(error.response?.data || 'Error fetching donation history');
                setLoading(false);
            }
        };

        fetchDonationHistory();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className='my-4'>
            {donationHistory.length > 0 ? (
                <>
                    <h3 className='txt txt-danger'>Donation History</h3>
                    <table className="table table-bordered table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">#</th><th scope="col">Beneficiary Name</th>
                                <th scope="col">Venue</th>
                                <th scope="col">Scheduled At</th>
                                <th>Blood Group</th>
                                <th scope="col">Blood Quantity (ml)</th>
                                <th scope="col">Blood Quantity (units)</th>
                                <th scope="col">Donor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donationHistory.map((donation, index) => (
                                <tr key={donation._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{donation?.beneficiary}</td>
                                    <td>{donation?.venue}</td>
                                    <td>{new Date(donation.datetime).toLocaleString()}</td>
                                    <td>{donation.donor?.bloodgroup}</td>
                                    <td>{unitsToMl(donation?.bloodQuantity)}</td>
                                    <td>{donation?.bloodQuantity}</td>
                                    <td>{donation.donor.username}</td>
                                    {user?.role === 'admin' ? 
                                    <td onClick={() => { handleDeleteDonationHistory(donation) }} className='bg-danger' style={{ color: 'white', cursor: 'pointer' }}><i className='fa-solid fa-trash'></i></td>
                                    : <></>}
                                    </tr>
                            ))}
                        </tbody>
                    </table>
                </>

            ) : (
                <p className="text-center">No donation history till now.</p>
            )}

        </div>
    );
}
