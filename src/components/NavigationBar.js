import React from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css';

function NavigationBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          <img src="logo.png" alt="Logo" className="logo-image" />
        </Link>
      </div>
      <div className="navbar-buttons">
        <Link to="/register">
          <button className="btn btn-register">Register</button>
        </Link>
        <Link to="/login">
          <button className="btn btn-login">Login</button>
        </Link>
        <Link to="/admission-form">
          <button className="btn btn-admission-form">Admission Form</button>
        </Link>
      </div>
    </nav>
  );
}

export default NavigationBar;
