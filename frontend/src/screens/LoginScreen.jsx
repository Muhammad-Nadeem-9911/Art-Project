import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showResend, setShowResend] = useState(false);
    const [resendMessage, setResendMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.isAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        }
    }, [user, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        setShowResend(false);
        setResendMessage('');
        try {
            await login(email, password);
        } catch (err) {
            // Check for unverified user error from backend
            if (err.message.includes('Please verify your email')) {
                setError(err.message);
                setShowResend(true);
            } else {
                setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendVerification = async () => {
        setIsLoading(true);
        setError('');
        setResendMessage('');
        try {
            const res = await fetch('/api/users/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                setResendMessage(data.message);
            } else {
                setError(data.message || 'Failed to resend email.');
            }
        } catch (err) {
            setError('Server error. Could not resend email.');
        } finally {
            setIsLoading(false);
        }
    };

    const gradientTextStyle = {
        background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    };

    const gradientButtonStyle = {
        background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)',
        boxShadow: '0 0 15px rgba(0, 188, 242, 0.5)',
        border: 'none',
        color: 'white'
    };

    return (
        <div className="container-fluid bg-dark pb-5" style={{ minHeight: '100vh', paddingTop: '120px' }}>
            <style>
                {`
                    .form-control-dark {
                        background-color: #212529;
                        border-color: #495057;
                        color: #fff;
                    }
                    .form-control-dark:focus {
                        background-color: #212529;
                        border-color: #00BCF2;
                        color: #fff;
                        box-shadow: 0 0 0 0.25rem rgba(0, 188, 242, 0.25);
                    }
                    .form-control-dark::placeholder {
                        color: #6c757d;
                    }
                    .gradient-link {
                        background: linear-gradient(to right, #0078D7, #00BCF2, #35C759);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        text-decoration: none;
                        font-weight: bold;
                    }
                `}
            </style>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5 col-xl-4">
                        <div className="card bg-dark text-light border-secondary shadow-lg">
                            <div className="card-body p-4 p-sm-5">
                                <h2 className="text-center mb-4 fw-bold text-uppercase" style={gradientTextStyle}>Sign In</h2>
                                {error && <div className="alert alert-danger">{error}</div>}
                                {resendMessage && <div className="alert alert-success">{resendMessage}</div>}
                                {showResend && (
                                    <div className="d-grid mb-3">
                                        <button className="btn btn-outline-warning" onClick={handleResendVerification} disabled={isLoading}>Resend Verification Email</button>
                                    </div>
                                )}
                                <form onSubmit={submitHandler}>
                                    <div className="mb-3">
                                        <label className="form-label">Email Address</label>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-control form-control-dark" placeholder="name@example.com" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Password</label>
                                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-control form-control-dark" placeholder="Password" />
                                    </div>
                                    <button type="submit" className="btn w-100 fw-bold" style={gradientButtonStyle} disabled={isLoading}>
                                        {isLoading ? 'Signing In...' : 'Sign In'}
                                    </button>
                                </form>
                                <p className="text-center mt-3 mb-0">
                                    <Link to="/forgotpassword" style={{ color: '#00BCF2', textDecoration: 'none' }}>Forgot Password?</Link>
                                </p>
                                <p className="text-center mt-4 mb-0">
                                    New Customer? <Link to="/register" className="gradient-link">Register</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;