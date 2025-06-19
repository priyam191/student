import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ component: Component, role: requiredRole, ...rest }) => {
  const { isAuthenticated, loading, role } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props =>
        loading ? (
          <div className="loading">Loading...</div>
        ) : isAuthenticated ? (
          // If role is specified and doesn't match, redirect to dashboard
          requiredRole && role !== requiredRole ? (
            <Redirect 
              to={role === 'student' ? '/student/dashboard' : '/teacher/dashboard'} 
            />
          ) : (
            <Component {...props} />
          )
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;