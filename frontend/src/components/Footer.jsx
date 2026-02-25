// d:\Projects\Art Portfolio\frontend\src\components\Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="container-fluid bg-dark text-light footer py-5 wow fadeIn" data-wow-delay="0.1s" style={{ backgroundImage: 'url(/img/footer-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <style>
                {`
                    .footer .border-bottom, .footer a:hover {
                        background: linear-gradient(to right, #0078D7, #00BCF2, #35C759);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        color: transparent !important;
                    }
                `}
            </style>
            <div className="container text-center py-5">
                <Link to="/">
                    <h1 className="display-4 mb-3 text-uppercase" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}><i className="fa-solid fa-palette me-1"></i>Iram Ali</h1>
                </Link>
                <div className="d-flex justify-content-center mb-4">
                    <a className="btn btn-lg-square m-1 text-white" href="#!" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', boxShadow: '0 0 15px rgba(0, 188, 242, 0.5)', border: 'none' }}><i
                        className="fab fa-x-twitter"></i></a>
                    <a className="btn btn-lg-square m-1 text-white" href="#!" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', boxShadow: '0 0 15px rgba(0, 188, 242, 0.5)', border: 'none' }}><i
                        className="fab fa-facebook-f"></i></a>
                    <a className="btn btn-lg-square m-1 text-white" href="#!" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', boxShadow: '0 0 15px rgba(0, 188, 242, 0.5)', border: 'none' }}><i
                        className="fab fa-instagram"></i></a>
                </div>
                <p>&copy; <a className="border-bottom" href="#">Iram Ali </a>, All Right Reserved.</p>
            </div>
        </div>
    );
};

export default Footer;
