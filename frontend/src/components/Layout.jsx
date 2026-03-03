import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import AuthContext from '../context/AuthContext';
import Footer from './Footer';

const Layout = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // If the user is an admin, they should not access user-facing pages.
        // Redirect them to the admin dashboard immediately.
        if (user && user.isAdmin) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [user, navigate]);

    // To prevent a "flash" of the user page before redirection,
    // we can render a loading state while the check is happening.
    if (user && user.isAdmin) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#121212' }}>
                <div className="spinner-border" role="status" style={{ color: '#00BCF2' }}>
                    <span className="visually-hidden">Redirecting...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </>
    );
};

export default Layout;