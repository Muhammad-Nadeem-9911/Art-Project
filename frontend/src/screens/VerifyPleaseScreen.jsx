import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const VerifyPleaseScreen = () => {
    const location = useLocation();
    const message = location.state?.message || 'Please check your email to verify your account.';

    const gradientTextStyle = {
        background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    };

    return (
        <div className="container-fluid bg-dark pb-5 d-flex align-items-center" style={{ minHeight: '100vh', paddingTop: '80px' }}>
            <style>
                {`
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
                    <div className="col-md-8 col-lg-6">
                        <div className="card bg-dark text-light border-secondary shadow-lg text-center">
                            <div className="card-body p-4 p-sm-5">
                                <i className="far fa-envelope-open fa-4x mb-4" style={gradientTextStyle}></i>
                                <h2 className="mb-4 fw-bold text-uppercase" style={gradientTextStyle}>Check Your Inbox</h2>
                                <p className="fs-5">{message}</p>
                                <p className="text-muted">
                                    We've sent a verification link to your email address. Please click the link to activate your account.
                                </p>
                                <hr className="border-secondary my-4" />
                                <p className="mb-0">Didn't receive the email? Check your spam folder or <Link to="/login" className="gradient-link">try logging in</Link> to resend it.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyPleaseScreen;