import React from 'react'

export default function Footer() {
  return (

<footer className="bg-danger text-white py-5">
  <div className="container">
    <div className="row">
      <div className="col-md-4 mb-4">
        <h5 className="font-weight-bold">About Campus Bloodline</h5>
        <p>Your go-to platform for organizing blood donations, connecting donors with those in need, and making a difference in our community.</p>
      </div>
      <div className="col-md-4 mb-4">
        <h5 className="font-weight-bold">Quick Links</h5>
        <ul className="list-unstyled">
          <li><a href="/" className="text-white">Home</a></li>
          <li><a href="#how-to-donate" className="text-white">How to Donate</a></li>
          <li><a href="#upcoming-drives" className="text-white">Upcoming Drives</a></li>
          <li><a href="#faqs" className="text-white">FAQs</a></li>
        </ul>
      </div>
      <div className="col-md-4 mb-4">
        <h5 className="font-weight-bold">Contact Us</h5>
        <p>Email: <a href="mailto:campusbloodline@gmail.com" className="text-white">campusbloodline@gmail.com</a></p>
        <p>Phone: <a href="tel:+1234567890" className="text-white">+1 234 567 890</a></p>
        <p>Follow us on social media:</p>
        <div style={{display:"flex", gap: "1.5em"}}>
          <a href="#" className="text-white mr-3"><i className="fab fa-facebook-f"></i></a>
          <a href="#" className="text-white mr-3"><i className="fab fa-twitter"></i></a>
          <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
    </div>
    <div className="text-center mt-4">
      <small>&copy; 2024 Campus Bloodline. All Rights Reserved.</small>
    </div>
  </div>
</footer>



  )
}
