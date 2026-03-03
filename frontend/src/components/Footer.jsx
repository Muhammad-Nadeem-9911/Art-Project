import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const gradientTextStyle = {
        background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block'
    };

    return (
        <div className="container-fluid bg-dark text-light footer pt-5 mt-5 wow fadeIn" data-wow-delay="0.1s">
            <div className="container py-5">
                <div className="row g-5">
                    <div className="col-lg-3 col-md-6">
                        <h4 className="text-white mb-3 text-uppercase" style={gradientTextStyle}>Iram Ali</h4>
                        <p>A digital and oil painting artist dedicated to bringing visual stories to life. Explore the gallery and find the perfect piece for your space.</p>
                        <div className="d-flex pt-2">
                            <a className="btn btn-outline-light btn-social" href="#!"><i className="fab fa-x-twitter"></i></a>
                            <a className="btn btn-outline-light btn-social" href="#!"><i className="fab fa-facebook-f"></i></a>
                            <a className="btn btn-outline-light btn-social" href="#!"><i className="fab fa-youtube"></i></a>
                            <a className="btn btn-outline-light btn-social" href="#!"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <h4 className="text-white mb-3 text-uppercase" style={gradientTextStyle}>Address</h4>
                        <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>123 Street, New York, USA</p>
                        <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>+012 345 67890</p>
                        <p className="mb-2"><i className="fa fa-envelope me-3"></i>info@example.com</p>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <h4 className="text-white mb-3 text-uppercase" style={gradientTextStyle}>Quick Links</h4>
                        <Link className="btn btn-link" to="/about">About Us</Link>
                        <Link className="btn btn-link" to="/contact">Contact Us</Link>
                        <Link className="btn btn-link" to="/services">Our Services</Link>
                        <Link className="btn btn-link" to="/terms">Terms & Condition</Link>
                        <Link className="btn btn-link" to="/support">Support</Link>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <h4 className="text-white mb-3 text-uppercase" style={gradientTextStyle}>Newsletter</h4>
                        <p>Subscribe to our newsletter for latest updates and exclusive offers.</p>
                        <div className="position-relative mx-auto" style={{maxWidth: '400px'}}>
                            <input className="form-control border-0 w-100 py-3 ps-4 pe-5" type="text" placeholder="Your email" />
                            <button type="button" className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', border: 'none' }}>SignUp</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="copyright">
                    <div className="row">
                        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                            &copy; <Link className="border-bottom" to="/">Iram Ali</Link>, All Right Reserved.
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <div className="footer-menu">
                                <Link to="/">Home</Link>
                                <Link to="/cookies">Cookies</Link>
                                <Link to="/help">Help</Link>
                                <Link to="/fqas">FQAs</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .footer .btn.btn-social {
                    margin-right: 5px;
                    width: 35px;
                    height: 35px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    border: 1px solid rgba(256, 256, 256, .5);
                    border-radius: 35px;
                    transition: .3s;
                }
                .footer .btn.btn-social:hover {
                    color: #00BCF2;
                    border-color: #00BCF2;
                }
                .footer .btn-link {
                    display: block;
                    margin-bottom: 5px;
                    padding: 0;
                    text-align: left;
                    color: #fff;
                    font-size: 15px;
                    font-weight: normal;
                    text-transform: capitalize;
                    transition: .3s;
                    text-decoration: none;
                }
                .footer .btn-link::before {
                    position: relative;
                    content: "\\f105";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    margin-right: 10px;
                }
                .footer .btn-link:hover {
                    letter-spacing: 1px;
                    box-shadow: none;
                    background: linear-gradient(to right, #0078D7, #00BCF2, #35C759);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .footer .copyright {
                    padding: 25px 0;
                    font-size: 15px;
                    border-top: 1px solid rgba(256, 256, 256, .1);
                }
                .footer .copyright a {
                    color: #fff;
                    text-decoration: none;
                }
                .footer .footer-menu a {
                    margin-right: 15px;
                    padding-right: 15px;
                    border-right: 1px solid rgba(255, 255, 255, .1);
                    text-decoration: none;
                    color: #fff;
                }
                .footer .footer-menu a:last-child {
                    margin-right: 0;
                    padding-right: 0;
                    border-right: none;
                }
                .footer .footer-menu a:hover {
                    color: #00BCF2;
                }
            `}</style>
        </div>
    );
};

export default Footer;
