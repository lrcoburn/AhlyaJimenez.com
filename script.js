// Portfolio Lightbox
document.addEventListener('DOMContentLoaded', function () {
    const portfolioGrid = document.querySelector('.portfolio-grid');
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

    if (!overlay || !portfolioGrid || portfolioItems.length === 0) {
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
            const heading = item.querySelector('h3');
            const description = item.querySelector('p');
            return {
                index,
                element: item,
                hasImg: Boolean(img),
                imgSrc: img ? img.getAttribute('src') : null,
                imgAlt: img ? img.getAttribute('alt') : '',
                placeholderText: placeholder ? placeholder.textContent : '',
                title: heading ? heading.textContent : '',
                description: description ? description.textContent : ''
            };
        })
        .filter(Boolean)
        .sort((a, b) => a.index - b.index);

    if (orderedEntries.length === 0) {
        return;
    }

    let currentPosition = 0;
    let triggerElement = null;

    function showItem(position) {
        currentPosition = (position + orderedEntries.length) % orderedEntries.length;
        const data = orderedEntries[currentPosition];

        if (data.hasImg && data.imgSrc) {
            lightboxImg.src = data.imgSrc;
            lightboxImg.alt = data.imgAlt;
            lightboxImg.style.display = 'block';
            lightboxPlaceholder.style.display = 'none';
        } else {
            lightboxImg.removeAttribute('src');
            lightboxImg.style.display = 'none';
            lightboxPlaceholder.style.display = 'flex';
            lightboxPlaceholder.textContent = data.placeholderText;
        }

        lightboxTitle.textContent = data.title;
        lightboxDesc.textContent = data.description;
        lightboxCounter.textContent = (currentPosition + 1) + ' of ' + orderedEntries.length;
    }

    function openLightboxAt(position, invokerElement) {
        triggerElement = invokerElement || null;
        showItem(position);
        overlay.classList.add('active');
        document.body.classList.add('lightbox-open');
        closeBtn.focus();
    }

    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.classList.remove('lightbox-open');
        if (triggerElement) {
            triggerElement.focus();
            triggerElement = null;
        }
    }

    function positionOf(element) {
        return orderedEntries.findIndex((entry) => entry.element === element);
    }

    // Use event delegation on the grid container instead of a listener per item.
    portfolioGrid.addEventListener('click', (event) => {
        const item = event.target.closest('.portfolio-item');
        if (!item) {
            return;
        }
        const position = positionOf(item);
        if (position !== -1) {
            openLightboxAt(position, item);
        }
    });

    portfolioGrid.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }
        const item = event.target.closest('.portfolio-item');
        if (!item) {
            return;
        }
        const position = positionOf(item);
        if (position !== -1) {
            event.preventDefault();
            openLightboxAt(position, item);
        }
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => showItem(currentPosition - 1));
    nextBtn.addEventListener('click', () => showItem(currentPosition + 1));

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeLightbox();
        }
    });

    function getFocusableElements() {
        return Array.from(
            overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        ).filter((el) => !el.disabled);
    }

    function trapFocus(event) {
        if (event.key !== 'Tab') {
            return;
        }
        const focusable = getFocusableElements();
        if (focusable.length === 0) {
            return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

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
        } else if (event.key === 'Tab') {
            trapFocus(event);
        }
    });
});
