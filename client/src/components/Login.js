import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../API/axiosInstance';
import './Login.css';
import '../Style.css';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showNextButton, setShowNextButton] = useState(false);
  const [emailReadOnly, setEmailReadOnly] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Create a ref for the password input
  const passwordInputRef = useRef(null);

  const handleEmailChange = (e) => {
    const enteredEmail = e.target.value;
    setEmail(enteredEmail);
    setShowNextButton(enteredEmail.includes('@'));
    setError(''); // Clear error when user starts typing
  };

  const handleNext = () => {
    setEmailReadOnly(true);
    if (passwordInputRef.current) {
      passwordInputRef.current.focus(); // Set focus to the password input using the ref
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password && !loading) {
      setLoading(true);
      setError(''); // Clear previous errors
      try {
        console.log('Attempting login with:', { email, password });

        const response = await axiosInstance.post('/api/users/login', { email, password });

        console.log('Login response:', response.data);

        const { token, id } = response.data;
        setUser({ id, email, token });
        localStorage.setItem('accessToken', token);

        setMessage('User logged in successfully');
        setTimeout(() => setMessage(''), 5000); // Clear message after 5 seconds
        navigate('/dashboard');
      } catch (error) {
        console.error('Login error:', error);
        const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEmailKeyDown = (e) => {
    if (e.key === 'Enter' && showNextButton) {
      handleNext();
    }
  };

  return (
    <div className="login-page">
      <div className="login-hero-image"></div>
      <div className="login-form-container">
        <div className="login-box">
          <h2>Login</h2>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="email"
              placeholder="Email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              onKeyDown={handleEmailKeyDown}
              readOnly={emailReadOnly}
              required
              aria-label="Email"
            />
            {!emailReadOnly && showNextButton && (
              <button type="button" className="continue-button" onClick={handleNext}>Continue</button>
            )}
            {emailReadOnly && (
              <>
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  ref={passwordInputRef}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label="Password"
                />
                <button type="submit" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </>
            )}
          </form>
          <div className="register-link">
            <span>Don't have an account?</span>
            <Link to="/signup" className="register-button">Register</Link>
          </div>
          <div className="reset-password-link">
            <Link to="/reset-password" className="reset-password-button">Forgot Password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
