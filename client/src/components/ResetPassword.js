import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../API/axiosInstance';
import './ResetPassword.css'; // Create this CSS file for styling

const ResetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setError(''); // Clear error when user starts typing
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (email && !loading) {
            setLoading(true);
            setError(''); // Clear previous errors
            try {
                const response = await axiosInstance.post('/api/users/reset-password', { email });
                setMessage('Check your email for further instructions to reset your password.');
                setTimeout(() => setMessage(''), 5000); // Clear message after 5 seconds
                navigate('/login'); // Redirect to login after initiating reset
            } catch (error) {
                console.error('Reset password error:', error);
                const errorMessage = error.response?.data?.message || 'Failed to send reset password email. Please try again.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="reset-password-page">
            <h2>Reset Password</h2>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
            <form onSubmit={handleResetPassword}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    aria-label="Email"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
            <div className="login-link">
                <span>Remember your password?</span>
                <Link to="/login" className="login-button">Login</Link>
            </div>
        </div>
    );
};

export default ResetPassword;
