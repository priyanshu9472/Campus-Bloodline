import React from 'react'
import bloodDrop from '../assets/blood-drop.png';

export default function Hero() {
    return (
   
        <section className="hero d-flex align-items-center text-white bg-danger" style={{minHeight: "90vh"}}>
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h1 className="display-3 font-weight-bold">SXCMT Campus Bloodline</h1>
                <p className="lead mt-3">Track blood donations, save lives, and become a part of a life-saving community at your college. Join us and make a difference today!</p>
                <a href="/login" className="btn btn-light btn-lg mt-4">Become a Donor</a>

                <div className=''></div>
              </div>
              <div className="col-md-5 d-none d-md-block">
             
                <div className="blood-drop">
                  <img src={bloodDrop} alt="Blood Drop" className="img-fluid" />
                </div>
              </div>
            </div>
          </div>
        </section>
    )
}
