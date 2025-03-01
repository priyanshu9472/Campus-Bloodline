import React from 'react'

export default function Encouragement() {
    return (
        <section className="encouragement py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 font-weight-bold text-danger">Why Donate Blood?</h2>
            <p className="lead text-muted">Your contribution can save lives. Every drop counts!</p>
          </div>
      
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm text-center">
                <div className="card-body">
                  <i className="fas fa-heartbeat fa-3x text-danger mb-3"></i>
                  <h5 className="card-title font-weight-bold">Save Lives</h5>
                  <p className="card-text">Just one donation can save up to 3 lives. Blood donation is a selfless act that not only helps those in need but also strengthens our community. By donating blood, you become a vital part of a life-saving process that impacts countless lives.</p>
                </div>
              </div>
            </div>
      
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm text-center">
                <div className="card-body">
                  <i className="fas fa-users fa-3x text-danger mb-3"></i>
                  <h5 className="card-title font-weight-bold">Build a Stronger Community</h5>
                  <p className="card-text">Donating blood strengthens your college community and promotes solidarity. Each donation not only saves lives but also fosters a sense of unity among students, encouraging everyone to come together for a noble cause.</p>
                </div>
              </div>
            </div>
      
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm text-center">
                <div className="card-body">
                  <i className="fas fa-heart fa-3x text-danger mb-3"></i>
                  <h5 className="card-title font-weight-bold">Improve Your Health</h5>
                  <p className="card-text">Donating blood has health benefits for the donor, including better cardiovascular health. It can enhance your fitness by improving blood circulation and promoting the production of new blood cells, making you feel rejuvenated and vital.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}
