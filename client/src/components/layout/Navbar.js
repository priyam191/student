import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, role, logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          Attendance System
        </Link>
      </div>
      
      <ul className="navbar-menu">
        {!isAuthenticated ? (
          <>
            <li className="navbar-item">
              <Link to="/">Home</Link>
            </li>
            <li className="navbar-item">
              <Link to="/login">Login</Link>
            </li>
          </>
        ) : (
          <>
            <li className="navbar-item">
              <Link to={role === 'student' ? '/student/dashboard' : '/teacher/dashboard'}>
                Dashboard
              </Link>
            </li>
            <li className="navbar-item user-info">
              <span>{user && user.name}</span>
              <span className="role-badge">{role}</span>
            </li>
            <li className="navbar-item">
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
