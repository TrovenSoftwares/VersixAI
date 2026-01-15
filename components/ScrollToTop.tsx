import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Reset window scroll
        window.scrollTo(0, 0);

        // Reset main content container scroll (where overflow happens)
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, [pathname]);

    return null;
};

export default ScrollToTop;
