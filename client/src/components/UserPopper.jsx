import React from 'react';

const UserPopper = ({ show, handleClose, user }) => {
  return (
    <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-labelledby="userDetailsModalLabel" aria-hidden={!show}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="userDetailsModalLabel">User Details</h5>
          
          </div>
          <div className="modal-body">
            <table className="table table-striped table-bordered">
              <tbody>
                <tr>
                  <td><strong>ID</strong></td>
                  <td>{user._id}</td>
                </tr>
                <tr>
                  <td><strong>Username</strong></td>
                  <td>{user.username}</td>
                </tr>
                <tr>
                  <td><strong>Email</strong></td>
                  <td>{user.email}</td>
                </tr>
              
                <tr>
                  <td><strong>Blood Group</strong></td>
                  <td>{user.bloodgroup}</td>
                </tr>
                <tr>
                  <td><strong>Address</strong></td>
                  <td>{user.address}</td>
                </tr>
                <tr>
                  <td><strong>Phone</strong></td>
                  <td>{user.phone}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPopper;
