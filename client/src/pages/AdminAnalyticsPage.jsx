import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BloodGroupAnalytics from '../components/BloodGroupAnalytics';
import TopDonors from '../components/TopDonors';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const jwtToken = localStorage.getItem('jwtToken'); // Get the token from local storage
        const response = await axios.get('/api/donations/analytics', {
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Set the Authorization header
          },
        });
        setAnalyticsData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div className="text-danger text-center">{error}</div>;
  }

  return (
    <>
      <BloodGroupAnalytics apiData={analyticsData.bloodGroupStats} />
      <TopDonors data={analyticsData.topDonors} />
    </>
  );
}
