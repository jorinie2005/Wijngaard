/* ================================
   NAVIGATIE - SCROLL EFFECT
================================ */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    updateActiveLink();
});

/* ================================
   HAMBURGER MENU
================================ */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = 
        navMenu.classList.contains('active') ? 'hidden' : '';
});

// Sluit menu bij klikken op link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Sluit menu bij klikken buiten menu
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

/* ================================
   ACTIEVE NAVIGATIE LINK
================================ */
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (correspondingLink) {
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                correspondingLink.classList.add('active');
            }
        }
    });
}

/* ================================
   SCROLL ANIMATIES
================================ */
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Voeg animatie klassen toe aan elementen
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(`
        .process-card,
        .wine-card,
        .info-card,
        .visit-option,
        .contact-item,
        .gallery-item,
        .section-text,
        .section-image,
        .intro-item
    `);

    animateElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index * 0.08}s`;
        observer.observe(el);
    });
});

/* ================================
   CONTACTFORMULIER
================================ */
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Haal formulierwaarden op
    const naam = document.getElementById('naam').value.trim();
    const email = document.getElementById('email').value.trim();
    const onderwerp = document.getElementById('onderwerp').value;
    const bericht = document.getElementById('bericht').value.trim();

    // Validatie
    if (!naam || !email || !onderwerp || !bericht) {
        showNotification('Vul alle verplichte velden in.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Vul een geldig e-mailadres in.', 'error');
        return;
    }

    // Simuleer verzending
    // [NIEUWE INFO NODIG: Koppel hier een echte mail service aan
    // zoals Formspree, EmailJS of een eigen backend]
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Versturen...';
    submitBtn.disabled = true;

    setTimeout(() => {
        showNotification('Bedankt voor uw bericht! We nemen zo snel mogelijk contact op.', 'success');
        contactForm.reset();
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Verstuur bericht';
        submitBtn.disabled = false;
    }, 1500);
});

/* ================================
   EMAIL VALIDATIE
================================ */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/* ================================
   NOTIFICATIE SYSTEEM
================================ */
function showNotification(message, type) {
    // Verwijder bestaande notificaties
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.body.appendChild(notification);

    // Automatisch verwijderen na 5 seconden
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/* ================================
   SMOOTH SCROLL VOOR ALLE LINKS
================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            const navHeight = navbar.offsetHeight;
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
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const placeholder = item.querySelector('.image-placeholder small');
        const imagePath = placeholder ? placeholder.textContent : '';

        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-content">
                <button class="lightbox-close">
                    <i class="fas fa-times"></i>
                </button>
                <div class="lightbox-image">
                    <i class="fas fa-image"></i>
                    <p>${imagePath}</p>
                </div>
            </div>
        `;

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        setTimeout(() => lightbox.classList.add('active'), 10);

        // Sluit lightbox
        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);

        function closeLightbox() {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightbox.remove();
                document.body.style.overflow = '';
            }, 300);
        }

        // Sluit met escape toets
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    });
});