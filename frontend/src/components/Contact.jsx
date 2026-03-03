// d:\Projects\Art Portfolio\frontend\src\components\Contact.jsx

import React, { useEffect, useState } from 'react';
import Footer from './Footer';
import PageHeader from './PageHeader';
import Navbar from './Navbar';

 const Contact = () => {
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formResponse, setFormResponse] = useState({ type: '', message: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const spinner = document.getElementById('spinner');
    // Hide spinner
    if (spinner) {
        spinner.classList.remove('show');
    }
  }, []); // Empty dependency array ensures this runs once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setFormResponse({ type: '', message: '' });
    try {
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (res.ok) {
            setFormResponse({ type: 'success', message: data.message });
            setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
        } else {
            setFormResponse({ type: 'error', message: data.message || 'An error occurred.' });
        }
    } catch (err) {
        setFormResponse({ type: 'error', message: 'Could not connect to the server. Please try again later.' });
    } finally {
        setSending(false);
        // Hide message after 5 seconds
        setTimeout(() => {
            setFormResponse({ type: '', message: '' });
        }, 5000);
    }
  };

  return (
    <>
      <style>
        {`
          .breadcrumb-item.active {
            background: linear-gradient(to right, #0078D7, #00BCF2, #35C759);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent !important;
          }
        `}
      </style>
      <Navbar />
      <PageHeader title="Contact Me" pageName="contact" />
      <div className="container-fluid py-5">
        <div className="container">
            <div className="row g-5 justify-content-center">
                <div className="col-lg-10">
                    <div className="section-title text-center position-relative pb-3 mb-5">
                        <h5 className="fw-bold text-uppercase" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>Get In Touch</h5>
                        <h1 className="mb-0">Let's Create Something Together</h1>
                    </div>
                    <div className="d-flex justify-content-center mb-5">
                        <div className="d-flex align-items-center bg-secondary p-4 rounded me-4">
                            <div className="bg-dark d-flex align-items-center justify-content-center rounded" style={{width: '60px', height: '60px'}}>
                                <i className="fa fa-envelope-open" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}></i>
                            </div>
                            <div className="ps-4">
                                <h5 className="mb-2">Email</h5>
                                <h4 className="mb-0" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>info@iramali.com</h4>
                            </div>
                        </div>
                        <div className="d-flex align-items-center bg-secondary p-4 rounded">
                            <div className="bg-dark d-flex align-items-center justify-content-center rounded" style={{width: '60px', height: '60px'}}>
                                <i className="fa fa-phone-alt" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}></i>
                            </div>
                            <div className="ps-4">
                                <h5 className="mb-2">Call</h5>
                                <h4 className="mb-0" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>+012 345 6789</h4>
                            </div>
                        </div>
                    </div>
                    <div className="bg-secondary rounded p-5">
                        {formResponse.message && (
                            <div className={`alert ${formResponse.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                                {formResponse.message}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-control border-0 bg-dark text-white py-3 px-4" placeholder="Your Name" style={{height: '55px'}} required />
                                </div>
                                <div className="col-md-6">
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-control border-0 bg-dark text-white py-3 px-4" placeholder="Your Email" style={{height: '55px'}} required />
                                </div>
                                <div className="col-12">
                                    <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} className="form-control border-0 bg-dark text-white py-3 px-4" placeholder="Subject" style={{height: '55px'}} required />
                                </div>
                                <div className="col-12">
                                    <textarea name="message" value={formData.message} onChange={handleInputChange} className="form-control border-0 bg-dark text-white py-3 px-4" rows="5" placeholder="Message" required></textarea>
                                </div>
                                <div className="col-12">
                                    <button className="btn w-100 py-3 text-white" type="submit" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', boxShadow: '0 0 15px rgba(0, 188, 242, 0.5)', border: 'none' }} disabled={sending}>
                                        {sending ? 'Sending...' : 'Send Message'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
