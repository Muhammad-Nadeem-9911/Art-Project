import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

const EmailVerificationScreen = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('Verifying your email, please wait...');
    const verificationAttempted = useRef(false);

    useEffect(() => {
        // In React's Strict Mode (in development), effects run twice.
        // This ref ensures the verification API is only called once.
        if (verificationAttempted.current) {
            return;
        }
        verificationAttempted.current = true;

        const verifyEmail = async () => {
            try {
                const res = await fetch(`/api/users/verifyemail/${token}`);
                const data = await res.json();

                if (res.ok) {
                    setStatus('success');
                    setMessage(data.message || 'Your email has been successfully verified!');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Verification failed. The link may be invalid or expired.');
                }
            } catch (err) {
                setStatus('error');
                setMessage('A server error occurred. Please try again later.');
            }
        };

        if (token) {
            verifyEmail();
        } else {
            setStatus('error');
            setMessage('No verification token provided.');
        }
    }, [token]);

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
        <div className="container-fluid bg-dark pb-5 d-flex align-items-center" style={{ minHeight: '100vh', paddingTop: '80px' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card bg-dark text-light border-secondary shadow-lg text-center">
                            <div className="card-body p-4 p-sm-5">
                                {status === 'verifying' && <div className="spinner-border mb-4" style={{ color: '#00BCF2', width: '3rem', height: '3rem' }} role="status"></div>}
                                {status === 'success' && <i className="far fa-check-circle fa-4x mb-4 text-success"></i>}
                                {status === 'error' && <i className="far fa-times-circle fa-4x mb-4 text-danger"></i>}
                                
                                <h2 className="mb-4 fw-bold text-uppercase" style={gradientTextStyle}>
                                    {status === 'verifying' ? 'Verifying...' : status === 'success' ? 'Success!' : 'Verification Failed'}
                                </h2>
                                
                                <p className="fs-5">{message}</p>

                                {status !== 'verifying' && (
                                    <Link to="/login" className="btn mt-4" style={gradientButtonStyle}>Proceed to Login</Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerificationScreen;