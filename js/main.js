/* ================================
   NAVIGATIE – SCROLL EFFECT
================================ */
const navbar = document.getElementById('navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveLink();
    });
}

/* ================================
   HAMBURGER MENU
================================ */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');

if (hamburger && navMenu) {

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow =
            navMenu.classList.contains('active') ? 'hidden' : '';
    });

    /* Sluit menu bij klikken op link */
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    /* Sluit menu bij klikken buiten menu */
    document.addEventListener('click', (e) => {
        if (navbar && !navbar.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ================================
   ACTIEVE NAVIGATIE LINK
   (alleen op homepage met anchors)
================================ */
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    if (sections.length === 0) return;

    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
        const sectionTop    = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId     = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (link) {
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

/* ================================
   SCROLL ANIMATIES
================================ */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {

    /* Elementen die animeren bij scrollen */
    const animateSelectors = [
        '.nature-card',
        '.wine-card',
        '.wine-detail-card',
        '.druif-card',
        '.process-card',
        '.visit-card',
        '.contact-card',
        '.gallery-item',
        '.section-text',
        '.section-image',
        '.intro-item',
        '.bereikbaarheid-item'
    ].join(', ');

    document.querySelectorAll(animateSelectors).forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

/* ================================
   SMOOTH SCROLL
   (alleen voor anchor links op homepage)
================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        const target   = document.querySelector(targetId);

        if (target) {
            e.preventDefault();
            const navHeight      = navbar ? navbar.offsetHeight : 0;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/* ================================
   GALERIJ LIGHTBOX
================================ */
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {

        /* Probeer echte afbeelding te pakken */
        const realImg = item.querySelector('.gallery-img');
        const src     = realImg ? realImg.src : null;
        const alt     = realImg ? realImg.alt : 'Afbeelding';

        /* Maak lightbox aan */
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');

        if (src && !src.includes('undefined')) {
            lightbox.innerHTML = `
                <div class="lightbox-overlay"></div>
                <div class="lightbox-content">
                    <button class="lightbox-close" aria-label="Sluiten">
                        <i class="fas fa-times"></i>
                    </button>
                    <img src="${src}" alt="${alt}" class="lightbox-img-real">
                </div>
            `;
        } else {
            /* Fallback als er geen echte afbeelding is */
            const placeholder = item.querySelector('small');
            const label = placeholder ? placeholder.textContent : 'Afbeelding';
            lightbox.innerHTML = `
                <div class="lightbox-overlay"></div>
                <div class="lightbox-content">
                    <button class="lightbox-close" aria-label="Sluiten">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="lightbox-image">
                        <i class="fas fa-image"></i>
                        <p>${label}</p>
                    </div>
                </div>
            `;
        }

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        /* Activeer met kleine vertraging voor animatie */
        setTimeout(() => lightbox.classList.add('active'), 10);

        /* Sluitfuncties */
        function closeLightbox() {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightbox.remove();
                document.body.style.overflow = '';
            }, 300);
        }

        lightbox.querySelector('.lightbox-close')
            .addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-overlay')
            .addEventListener('click', closeLightbox);

        /* Sluit met Escape toets */
        function handleKeydown(e) {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', handleKeydown);
            }
        }
        document.addEventListener('keydown', handleKeydown);
    });
});

/* ================================
   NOTIFICATIE SYSTEEM
   (herbruikbaar voor toekomstige functies)
================================ */
function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" aria-label="Sluiten">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}