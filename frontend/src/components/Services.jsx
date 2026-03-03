// d:\Projects\Art Portfolio\frontend\src\components\Services.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
 import PageHeader from './PageHeader';

const Services = () => {
  const [services, setServices] = useState([]);
  useEffect(() => {
    const spinner = document.getElementById('spinner');
    if (spinner) {
        spinner.classList.remove('show');
    }
    // Re-initialize WOW.js animations
    if (window.WOW) {
        new window.WOW().init();
    }

    const fetchServices = async () => {
        try {
            const response = await fetch(`/api/content/services`);
            if (response.ok) {
                const data = await response.json();
                setServices(data);
            }
        } catch (error) {
            console.error("Failed to fetch services:", error);
        }
    };
    fetchServices();
  }, []);

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
      <div className="container-fluid p-0">
        <Navbar />
        <PageHeader title="Services" pageName="services" />
      </div>

      <div className="container-fluid py-5">
        <div className="container">
            <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{maxWidth: '600px'}}>
                <h5 className="text-uppercase" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>What I Offer</h5>
                <h1 className="display-5 text-uppercase mb-4">Artistic Services</h1>
            </div>
            {services.map((service, index) => {
                const isLeft = index % 2 === 0;
                const itemClass = isLeft ? 'service-item-left' : 'service-item-right';
                const imageOrderClass = isLeft ? '' : 'order-md-1';
                const textAlignClass = isLeft ? '' : 'text-md-end';
                const animation = isLeft ? 'fadeInRight' : 'fadeInLeft';

                return (
                   
                    <div key={service._id} className={`service-item ${itemClass}`}>
                        <div className="row g-0 align-items-center">
                            <div className={`col-md-5 col-lg-3 ${imageOrderClass}`}>
                                <div className={`service-img p-5 wow ${animation}`} data-wow-delay="0.2s">
                                    <img className="img-fluid rounded-circle" src={service.imageUrl} alt={service.title} />
                                </div>
                            </div>
                            <div className="col-md-7 col-lg-9">
                                <div className={`service-text px-5 px-md-0 py-md-5 py-lg-3 ${textAlignClass} wow ${animation}`} data-wow-delay="0.5s">
                                    <h3 className="text-uppercase">{service.title}</h3>
                                    <p className="mb-4">{service.description}</p>
                                    <Link
                                        to={`/category/${service._id}`}
                                        className="btn text-white"
                                        style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', boxShadow: '0 0 15px rgba(0, 188, 242, 0.5)', border: 'none' }}
                                    >View Artworks</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                   
                );
            })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Services;
