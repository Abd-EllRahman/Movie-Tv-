import React from 'react';
import { Link } from 'react-router-dom';
import image from './AAA.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import './Footer.css'; 

export default function Footer() {
  return (
    <footer className="text-light py-4" style={{ backgroundColor: 'transparent' }}>
      <div className="container">
        <div className="row">
          {/* Logo Section */}
          <div className="col-md-12 text-center">
            <img 
              src={image}  
              alt="logo"
              className="img-fluid d-block mx-auto"
            />
          </div>

          {/* Contact Information Section */}
          <div className="col-md-6 text-center">
            <h5 style={{ color: '#D98236' }}>Contact Us</h5>
            <ul className="list-unstyled">
              <li><FontAwesomeIcon icon={faEnvelope} className='contact-icon'/> : abdelrhmansalah131@gmail.com</li>
              <li><FontAwesomeIcon icon={faPhone} className='contact-icon'/> : 01090482440</li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="col-md-6 text-center">
            <h5 style={{ color: '#D98236' }}>Follow Us</h5>
            <div>
              <Link className="social-icon" to="https://www.facebook.com/profile.php?id=Pskncze19t08jb" target="_blank">
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </Link>
              <Link className="social-icon" to="https://www.instagram.com/abdelrhmansalah131/" target="_blank">
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </Link>
            </div>
          </div>
        </div> 
      </div>
    </footer>
  );
}
