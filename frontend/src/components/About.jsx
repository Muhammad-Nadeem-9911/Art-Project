import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import PageHeader from './PageHeader';

const About = () => {
    useEffect(() => {
        const spinner = document.getElementById('spinner');
        if (spinner) {
            spinner.classList.remove('show');
        }
        if (window.WOW) {
            new window.WOW().init();
        }
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
            <Navbar />
            <PageHeader title="About Me" pageName="about" />
            <div className="container-fluid bg-secondary">
                <div className="container">
                    <div className="row g-5 align-items-center">
                        <div className="col-lg-7 pb-0 pb-lg-5 py-5">
                            <div className="pb-0 pb-lg-5 py-5">
                                <div className="title wow fadeInUp" data-wow-delay="0.1s">
                                    <div className="title-left">
                                        <h5>About Me</h5>
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
            <div className="container-fluid py-5">
                <div className="container">
                    <div className="row g-5 align-items-center">
                        <div className="col-lg-5 wow fadeIn" data-wow-delay="0.1s">
                            <img className="img-fluid rounded" src="/img/about1.png" alt="About Me" />
                        </div>
                        <div className="col-lg-7 wow fadeIn" data-wow-delay="0.5s">
                            <h1 className="display-5 text-uppercase mb-4">The Artist's Note</h1>
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <h3 className="mb-4">
                                "My brush does not merely paint letters; it traces the rhythm of the soul." — Iram Ali
                            </h3>
                            </div>
                    </div>
                </div>
            </div>

            
            <Footer />
        </>
    );
};

export default About;