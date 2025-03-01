import React, { useEffect, useState } from 'react';
import { unitsToMl } from '../utils/bloodQuantity';

const TopDonors = ({data}) => {
  // Dummy data for top donors (You can replace this with real data from your API)
  const [topDonors, setTopDonors] = useState([]);

  useEffect(() => {
    setTopDonors(data);
  }) 

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 text-danger">Top Donors</h2>
      <table className="table table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Username</th>
            <th scope="col">Total Donated (units)</th>
            <th scope="col">Total Donated (ml)</th>
          </tr>
        </thead>
        <tbody>
          {topDonors.map((donor, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{donor.username}</td>
              <td>{donor.totalBloodQuantity} mL</td>
              <td>{unitsToMl(donor.totalBloodQuantity)} mL</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopDonors;
