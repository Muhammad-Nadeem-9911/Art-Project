import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Home() {

    const [loading, setLoading] = useState(true);
    const [slides, setSlides] = useState([]);
    const [services, setServices] = useState([]);


    const fetchCarouselSlides = async () => {
        try {
            const response = await fetch(`/api/content/carousel`);
            if (response.ok) {
                const data = await response.json();
                setSlides(data);
                setLoading(false);

            }
        } catch (error) {
            console.error("Failed to fetch carousel slides:", error);
        }
    };

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
    useEffect(() => {

        fetchServices();
       fetchCarouselSlides();
    }, []);
     // This effect runs the template's JavaScript after the components are rendered.
    useEffect(() => {
        // Re-initialize WOW.js animations
        if (window.WOW) {
            new window.WOW().init();
        }

        // Re-initialize Owl Carousel for testimonials
        if (window.jQuery && window.jQuery.fn.owlCarousel) {
            window.jQuery('.testimonial-carousel').owlCarousel({
                autoplay: true,
                smartSpeed: 1000,
                loop: true,
                nav: false,
                dots: true,
                items: 1,
                dotsData: true,
            });
        }

        // Hide spinner
        const spinner = document.getElementById('spinner');
        if (spinner) {
            spinner.classList.remove('show');
        }
    }, []);

    return (
        <>
            <style>
                {`
                    .carousel-image-responsive {
                        object-fit: cover;
                        width: 100%;
                        height: 95vh;
                    }
                    .carousel-caption h1.display-1 {
                        font-size: 6rem;
                    }
                    .about-section-responsive {
                        padding-top: 3rem;
                        padding-bottom: 3rem;
                    }

                    @media (max-width: 992px) {
                        .about-section-responsive {
                            padding-top: 1rem;
                            padding-bottom: 1rem;
                        }
                    }

                    @media (max-width: 768px) {
                        .carousel-image-responsive {
                            height: 55vh;
                        }
                        .carousel-caption h1.display-1 {
                            font-size: 3rem;
                        }
                    }
                `}
            </style>
            {/* Header & Navbar */}
            <div className="container-fluid p-0">
                <Navbar />

                <div id="header-carousel" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        {slides.length > 0 ? (
                            slides.map((slide, index) => (
                                <div key={slide._id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <img className="d-block w-100 carousel-image-responsive" src={slide.imageUrl} alt={slide.title} />
                                    <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                                        <div className="title mx-5 px-5 animated slideInDown">
                                            <div className="title-center">
                                                <h5>Portfolio</h5>
                                                <h1 className="display-1">{slide.title}</h1>
                                            </div>
                                        </div>
                                        <p className="fs-5 mb-5 animated slideInDown">{slide.subtitle}</p>
                                        <a href="#gallery" className="btn border-0 py-3 px-5 animated slideInDown text-white" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', boxShadow: '0 0 15px rgba(0, 188, 242, 0.5)' }}>Explore More</a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="carousel-item active">
                                <img className="d-block w-100 carousel-image-responsive" src="/img/carousel-1.jpg" alt="Default" />
                                <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                                    <div className="title mx-5 px-5 animated slideInDown">
                                        <div className="title-center">
                                            <h5>Portfolio</h5>
                                            <h1 className="display-1">Digital Art & Oil</h1>
                                        </div>
                                    </div>
                                    <p className="fs-5 mb-5 animated slideInDown">A collection of visual stories told through color and light.</p>
                                    <a href="#gallery" className="btn border-0 py-3 px-5 animated slideInDown text-white" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', boxShadow: '0 0 15px rgba(0, 188, 242, 0.5)' }}>Explore More</a>
                                </div>
                            </div>
                        )}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#header-carousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            {/* About Section */}
            <div className="container-fluid bg-secondary">
                <div className="container">
                    <div className="row g-5 align-items-center about-section-responsive">
                        <div className="col-lg-7 pb-0 pb-lg-5 py-5">
                            <div className="pb-0 pb-lg-5 py-5">
                                <div className="title wow fadeInUp" data-wow-delay="0.1s">
                                    <div className="title-left">
                                        <h5 style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>About Me</h5>
                                        <h1>My Artistic Journey</h1>

                                    </div>
                                </div>
                                <p className="mb-4 wow fadeInUp" data-wow-delay="0.2s">Immerse yourself in a gallery of words—where art meets insight, and inspiration flows like ink on paper.</p>
                                <p className="mb-4 wow fadeInUp" data-wow-delay="0.3s">For years, the dance of my brush was a secret symphony—an intimate dialogue between ink and silence, unfolding behind the closed doors of my studio. Each stroke carried whispers of devotion, weaving visual stories shared only with a cherished circle.</p>
                                <p className="mb-4 wow fadeInUp" data-wow-delay="0.4s">Yet, art is a language that longs for a listener. The serenity captured in these lines grew too vast to remain hidden, too luminous to be confined.</p>
                                <p className="mb-4 wow fadeInUp" data-wow-delay="0.5s">Today, I open that dialogue to you. I bring these pieces out of the shadows and into the light of your home, hoping they breathe the same peace into your heart that they once breathed into mine.</p>
                                <p className="mb-4 wow fadeInUp" data-wow-delay="0.6s">This journey is more than aesthetics—it is an offering. As you welcome these pieces, I invite you to pause, to pray—for yourself and for the world. Each piece is a vessel of healing, carrying energy that transcends canvas and ink. And with every artwork embraced, you are also supporting a cause that serves humanity, extending tangible help to those in need.</p>


                            </div>
                        </div>
                        <div className="col-lg-5 wow fadeInUp" data-wow-delay="0.5s">
                            <img className="img-fluid" src="/img/about.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>

           {/* Services Section */}
            <div className="container-fluid py-5">
                <div className="container">
                    <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
                        <h5 className="text-uppercase" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>What I Offer</h5>
                        <h1 className="display-5 text-uppercase mb-4">Artistic Services</h1>
                    </div>
                    <div className="row g-5">
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
            </div>


            {/* Testimonial Section */}
            <div className="container-fluid py-5 bg-secondary">
                <div className="container py-5">
                    <div className="text-center">
                        <div className="title wow fadeInUp" data-wow-delay="0.1s">
                            <div className="title-center">
                                <h5 style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>Testimonial</h5>
                                <h1 className="display-5">Collector's Say</h1>
                            </div>
                        </div>
                    </div>
                    <div className="owl-carousel testimonial-carousel wow fadeInUp" data-wow-delay="0.3s">
                        <div className="testimonial-item text-center"
                            data-dot="<img class='img-fluid' src='/img/testimonial-1.jpg' alt=''>">
                            <p className="fs-5">"Iram's artwork brings such life to my living room. The attention to detail in the oil paintings is simply mesmerizing. Highly recommended for anyone looking for unique art."</p>
                            <h5 className="text-uppercase">Sarah Jenkins</h5>
                            <span style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Art Collector</span>
                        </div>
                        <div className="testimonial-item text-center"
                            data-dot="<img class='img-fluid' src='/img/testimonial-2.jpg' alt=''>">
                            <p className="fs-5">"I commissioned a digital portrait and was blown away by the result. Iram captured the essence perfectly. A truly talented artist with a unique vision."</p>
                            <h5 className="text-uppercase">Michael Chen</h5>
                            <span style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Gallery Owner</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />

            {/* Back to Top */}
            <a href="#" className="btn btn-lg-square back-to-top text-white" style={{ background: 'linear-gradient(to right, #0078D7, #00BCF2, #35C759)', boxShadow: '0 0 15px rgba(0, 188, 242, 0.5)', border: 'none' }}><i className="bi bi-arrow-up"></i></a>
        </>
    );
}

export default Home;