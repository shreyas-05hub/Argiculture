// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="bg-dark text-light p-4 ">
      <div className="container">
        <div className="row gy-4">
          {/* Logo & Description */}
          <div className="col-md-4">
            <h5 className="fw-bold text-success">AgriBuyAI</h5>
            <p className="small">
              Empowering farmers with AI-driven insights, fair pricing, and smarter marketplaces.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4">
            <h6 className="fw-bold">Quick Links</h6>
            <ul className="list-unstyled small">
              <li><Link to="/" className="text-light text-decoration-none">Home</Link></li>
              <li><Link to="/about" className="text-light text-decoration-none">About</Link></li>
              {/* <li><Link to="/marketplace" className="text-light text-decoration-none">Marketplace</Link></li> */}
              {/* <li><Link to="/modelhub" className="text-light text-decoration-none">AI Models</Link></li> */}
              <li><Link to="/contact" className="text-light text-decoration-none">Contact</Link></li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="col-md-4">
            <h6 className="fw-bold">Connect with Us</h6>
            <p className="small mb-1">📍 Pune, Maharashtra, India</p>
            <p className="small mb-1">📧 support@agribuyai.in</p>
            <p className="small">📞 +91 98765 43210</p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-light fs-5"><FaFacebook /></a>
              <a href="#" className="text-light fs-5"><FaInstagram /></a>
              <a href="#" className="text-light fs-5"><FaTwitter /></a>
              <a href="#" className="text-light fs-5"><FaLinkedin /></a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <hr className="mt-4 mb-2 text-secondary" />
        <div className="text-center small pb-3">
          © {new Date().getFullYear()} AgriBuyAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
