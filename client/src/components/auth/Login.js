import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { email, password } = formData;
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, role } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      if (role === 'student') {
        history.push('/student/dashboard');
      } else if (role === 'teacher') {
        history.push('/teacher/dashboard');
      }
    }
  }, [isAuthenticated, role, history]);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const result = await login(formData);
    
    if (!result.success) {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <p className="lead">Sign in to access your account</p>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <button type="submit" disabled={isLoading} style={{opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'}} className="btn btn-primary">Login</button>
      </form>
      
      <div className="demo-credentials">
        <h3>Demo Credentials</h3>
        <div className="credential-group">
          <h4>Teacher Logins:</h4>
          <p>Email: sarah.johnson@example.com<br/>Password: password123</p>
          <p>Email: michael.chen@example.com<br/>Password: password123</p>
        </div>
        <div className="credential-group">
          <h4>Student Logins:</h4>
          <p>Email: student1@example.com<br/>Password: password123</p>
          <p>Email: student5@example.com<br/>Password: password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;