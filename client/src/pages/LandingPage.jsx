import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { useAuth } from '../contexts/AuthContext'; // Adjust the import based on your file structure
import Header from '../components/Header';
import Hero from '../components/Hero';
import Encouragement from '../components/Encouragement';
import DonationProcess from '../components/DonationProcess';
import FAQs from '../components/FAQs';
import Footer from '../components/Footer';
import DonationEvents from '../components/DonationEvents';
// Import other components as needed

export default function LandingPage() {
  const navigate = useNavigate(); // Use useNavigate for redirection
  const { user } = useAuth(); // Get the user state from the context

  useEffect(() => {
    // Check if the user is signed in
    if (user) {
      // Redirect to the dashboard if the user is signed in
      navigate('/dashboard'); // Use navigate instead of history.push
    }
  }, [user, navigate]); // Run the effect whenever user changes

  return (
    <>
      {/* Render the landing page content only if the user is not signed in */}
      {!user && (
        <>
          <Hero />
          <DonationEvents />
          <Encouragement />
          <DonationProcess />
          <FAQs />
        </>
      )}
    </>
  );
}
