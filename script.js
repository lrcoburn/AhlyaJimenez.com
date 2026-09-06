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

    // Build the portfolio data from the grid so content stays in sync,
    // ordering entries by each item's data-index attribute (not DOM order)
    // so navigation stays correct even if the markup order ever changes.
    const orderedEntries = portfolioItems
        .map((item) => {
            const rawIndex = item.dataset.index;
            const index = rawIndex !== undefined ? parseInt(rawIndex, 10) : NaN;
            if (Number.isNaN(index)) {
                console.warn('Portfolio item is missing a valid data-index attribute and will be skipped in the lightbox.', item);
                return null;
            }

            const img = item.querySelector('.portfolio-image img');
            const placeholder = item.querySelector('.placeholder-image');
            return {
                index,
                element: item,
                imgSrc: img ? img.getAttribute('src') : null,
                imgAlt: img ? img.getAttribute('alt') : '',
                placeholderText: placeholder ? placeholder.textContent : '',
                title: item.querySelector('h3') ? item.querySelector('h3').textContent : '',
                description: item.querySelector('p') ? item.querySelector('p').textContent : ''
            };
        })
        .filter(Boolean)
        .sort((a, b) => a.index - b.index);

    if (orderedEntries.length === 0) {
        return;
    }

    let currentPosition = 0;

    function showItem(position) {
        currentPosition = (position + orderedEntries.length) % orderedEntries.length;
        const data = orderedEntries[currentPosition];

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
        lightboxCounter.textContent = (currentPosition + 1) + ' of ' + orderedEntries.length;
    }

    function openLightboxAt(position) {
        showItem(position);
        overlay.classList.add('active');
        document.body.classList.add('lightbox-open');
    }

    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.classList.remove('lightbox-open');
    }

    orderedEntries.forEach((entry, position) => {
        entry.element.addEventListener('click', () => openLightboxAt(position));
        entry.element.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightboxAt(position);
            }
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => showItem(currentPosition - 1));
    nextBtn.addEventListener('click', () => showItem(currentPosition + 1));

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
            showItem(currentPosition - 1);
        } else if (event.key === 'ArrowRight') {
            showItem(currentPosition + 1);
        }
    });
});
