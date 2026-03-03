import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const ResetPasswordScreen = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { resetToken } = useParams();

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/users/resetpassword/${resetToken}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
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
                `}
            </style>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5 col-xl-4">
                        <div className="card bg-dark text-light border-secondary shadow-lg">
                            <div className="card-body p-4 p-sm-5">
                                <h2 className="text-center mb-4 fw-bold text-uppercase" style={gradientTextStyle}>Reset Password</h2>
                                {error && <div className="alert alert-danger">{error}</div>}
                                {success && <div className="alert alert-success">{success} <Link to="/login">Login</Link></div>}
                                <form onSubmit={submitHandler}>
                                    <div className="mb-3">
                                        <label className="form-label">New Password</label>
                                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-control form-control-dark" placeholder="New Password" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Confirm New Password</label>
                                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="form-control form-control-dark" placeholder="Confirm Password" />
                                    </div>
                                    <button type="submit" className="btn w-100 fw-bold" style={gradientButtonStyle} disabled={isLoading}>
                                        {isLoading ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordScreen;