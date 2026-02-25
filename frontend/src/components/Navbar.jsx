import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar = () => {
    const gradientTextStyle = {
        background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block'
    };

    const gradientButtonStyle = {
        background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)',
        boxShadow: '0 0 15px rgba(0, 188, 242, 0.5)',
        border: 'none',
        color: 'white'
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-lg-5">
            <style>
                {`
                    .navbar-dark .navbar-nav .nav-link:hover {
                        background: linear-gradient(to right, #0078D7, #00BCF2, #35C759);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        color: transparent !important;
                    }
                `}
            </style>
            <Link to="/" className="navbar-brand ms-4 ms-lg-0">
                <h2 className="mb-0 text-uppercase" style={gradientTextStyle}><i className="fa-solid fa-palette me-1"></i>Iram Ali</h2>
            </Link>
            <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <div className="navbar-nav mx-auto p-4 p-lg-0">
                    <NavLink to="/" className={({ isActive }) => "nav-item nav-link" + (isActive ? " active" : "")} style={({ isActive }) => isActive ? gradientTextStyle : {}} end>Home</NavLink>
                    <NavLink to="/about" className={({ isActive }) => "nav-item nav-link" + (isActive ? " active" : "")} style={({ isActive }) => isActive ? gradientTextStyle : {}}>About</NavLink>
                    <NavLink to="/services" className={({ isActive }) => "nav-item nav-link" + (isActive ? " active" : "")} style={({ isActive }) => isActive ? gradientTextStyle : {}}>Services</NavLink>
                    <NavLink to="/contact" className={({ isActive }) => "nav-item nav-link" + (isActive ? " active" : "")} style={({ isActive }) => isActive ? gradientTextStyle : {}}>Contact</NavLink>
                </div>
                <div className="d-none d-lg-flex">
                    <Link to="/contact" className="btn" style={gradientButtonStyle}>Inquire Now</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
