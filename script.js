document.addEventListener('DOMContentLoaded', () => {
    const portfolioItems = [
        {
            type: 'image',
            src: 'images/Acrylic.jpeg',
            alt: 'Acrylic Portrait',
            title: 'Acrylic Portrait',
            desc: 'Acrylic'
        },
        {
            type: 'image',
            src: 'images/Graphite:Black and white.jpg',
            alt: 'Graphite/Black and White Portrait',
            title: 'Graphite/Black and White Portrait',
            desc: 'Graphite & Ink'
        },
        {
            type: 'image',
            src: 'images/Mixed media image.jpeg',
            alt: 'Mixed Media Portrait',
            title: 'Mixed Media Portrait',
            desc: 'Mixed Media'
        },
        {
            type: 'image',
            src: 'images/Digital.jpg',
            alt: 'Digital Portrait',
            title: 'Digital Portrait',
            desc: 'Digital'
        },
        {
            type: 'placeholder',
            text: 'Add-Ons',
            title: 'Additional Upgrades',
            desc: 'Custom Options'
        }
    ];

    let currentIndex = 0;

    const modal = document.getElementById('portfolio-lightbox');
    const overlay = document.getElementById('lightbox-overlay');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const counterEl = document.getElementById('lightbox-counter');
    const imageContainer = document.getElementById('lightbox-image-container');
    const titleEl = document.getElementById('lightbox-title');
    const descEl = document.getElementById('lightbox-desc');
    const gridItems = document.querySelectorAll('.portfolio-item');

    let previousActiveElement = null;

    function renderCurrentItem() {
        const item = portfolioItems[currentIndex];
        if (!item) return;

        counterEl.textContent = `${currentIndex + 1} of ${portfolioItems.length}`;
        titleEl.textContent = item.title;
        descEl.textContent = item.desc;

        if (item.type === 'image') {
            imageContainer.innerHTML = `<img src="${item.src}" alt="${item.alt}">`;
        } else {
            imageContainer.innerHTML = `<div class="placeholder-image lightbox-placeholder">${item.text}</div>`;
        }
    }

    function openLightbox(index) {
        currentIndex = index;
        previousActiveElement = document.activeElement;
        renderCurrentItem();
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }

    function closeLightbox() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
            previousActiveElement.focus();
        }
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % portfolioItems.length;
        renderCurrentItem();
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + portfolioItems.length) % portfolioItems.length;
        renderCurrentItem();
    }

    gridItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });

        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (overlay) overlay.addEventListener('click', closeLightbox);
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrev();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showNext();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!modal || !modal.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        } else if (e.key === 'ArrowRight') {
            showNext();
        }
    });

    let touchStartX = 0;
    let touchEndX = 0;

    if (modal) {
        modal.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        modal.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            showNext();
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            showPrev();
        }
    }
});
