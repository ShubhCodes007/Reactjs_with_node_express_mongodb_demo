import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navigation = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
    window.location.href = "/login"; // Reload to clear session
  };

  return (
    <nav>
      <ul>
        {isAuthenticated ? (
          <>
            <li><Link to="/admission">Admission Form</Link></li>
            <li><Link to="/report">Report</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
