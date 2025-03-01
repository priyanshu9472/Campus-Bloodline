import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const BloodGroupAnalytics = ({ apiData }) => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    setDonations(apiData);
  }, [apiData]);

  // Prepare data for the chart
  const labels = donations?.map(d => d.bloodgroup);
  const dataValues = donations?.map(d => d.totalBloodQuantity);

  // Dynamically generate background and border colors based on the number of blood groups
  const generateColors = (count, opacity) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = Math.floor((i * 360) / count); // Spread hues across the color spectrum
      colors.push(`hsla(${hue}, 70%, 50%, ${opacity})`);
    }
    return colors;
  };

  const backgroundColors = generateColors(labels.length, 0.6);
  const borderColors = generateColors(labels.length, 1);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Total Donated (Units)',
        data: dataValues,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Blood Donation Analytics by Blood Group',
      },
    },
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 text-danger">Global Blood Donation Analytics</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BloodGroupAnalytics;
