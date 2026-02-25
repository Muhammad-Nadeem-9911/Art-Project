// useInitializeEffects.js
import { useEffect } from 'react';

const useInitializeEffects = () => {
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
    }, []);
};

export default useInitializeEffects;
