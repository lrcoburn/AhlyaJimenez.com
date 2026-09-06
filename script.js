// Portfolio Lightbox
document.addEventListener('DOMContentLoaded', function () {
    const portfolioItems = Array.from(document.querySelectorAll('.portfolio-item'));
    const overlay = document.getElementById('lightboxOverlay');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxPlaceholder = document.getElementById('lightboxPlaceholder');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxCounter = document.getElementById('lightboxCounter');

    if (!overlay || portfolioItems.length === 0) {
        return;
    }

    // Build the portfolio data from the grid so content stays in sync.
    const items = portfolioItems.map((item) => {
        const img = item.querySelector('.portfolio-image img');
        const placeholder = item.querySelector('.placeholder-image');
        return {
            imgSrc: img ? img.getAttribute('src') : null,
            imgAlt: img ? img.getAttribute('alt') : '',
            placeholderText: placeholder ? placeholder.textContent : '',
            title: item.querySelector('h3') ? item.querySelector('h3').textContent : '',
            description: item.querySelector('p') ? item.querySelector('p').textContent : ''
        };
    });

    let currentIndex = 0;

    function showItem(index) {
        currentIndex = (index + items.length) % items.length;
        const data = items[currentIndex];

        if (data.imgSrc) {
            lightboxImg.src = data.imgSrc;
            lightboxImg.alt = data.imgAlt;
            lightboxImg.style.display = 'block';
            lightboxPlaceholder.style.display = 'none';
        } else {
            lightboxImg.style.display = 'none';
            lightboxPlaceholder.style.display = 'flex';
            lightboxPlaceholder.textContent = data.placeholderText;
        }

        lightboxTitle.textContent = data.title;
        lightboxDesc.textContent = data.description;
        lightboxCounter.textContent = (currentIndex + 1) + ' of ' + items.length;
    }

    function openLightbox(index) {
        showItem(index);
        overlay.classList.add('active');
        document.body.classList.add('lightbox-open');
    }

    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.classList.remove('lightbox-open');
    }

    portfolioItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightbox(index);
            }
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => showItem(currentIndex - 1));
    nextBtn.addEventListener('click', () => showItem(currentIndex + 1));

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (!overlay.classList.contains('active')) {
            return;
        }
        if (event.key === 'Escape') {
            closeLightbox();
        } else if (event.key === 'ArrowLeft') {
            showItem(currentIndex - 1);
        } else if (event.key === 'ArrowRight') {
            showItem(currentIndex + 1);
        }
    });
});
