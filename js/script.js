document.addEventListener('DOMContentLoaded', function() {
    // 1. Footer Year
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 2. Scroll Reveal Animation
    const revealObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Smart Navbar
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (!navbar) return;
        const currentScrollY = window.scrollY;

        if (currentScrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (currentScrollY > 200 && currentScrollY > lastScrollY) {
            // Scrolling down
            navbar.classList.add('hidden');
        } else {
            // Scrolling up
            navbar.classList.remove('hidden');
        }

        lastScrollY = currentScrollY;
    });

    // 4. Active Nav Link Tracking
    const sections = ['home', 'projects', 'gallery', 'skills', 'about', 'contact'].map(id => document.getElementById(id)).filter(Boolean);
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 150; // offset

        sections.forEach(section => {
            if (section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // 5. Mobile Menu Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navItems.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // 6. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                const offsetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 7. Project Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = '';
                    // Trigger animation
                    card.style.animation = 'none';
                    card.offsetHeight; /* trigger reflow */
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 8. Gallery System
    const galleryData = [
        { id: 1, title: 'Graduation', description: 'Informatics Engineering graduation moment, marking the start of my IT career.', image: 'img/DSC01736.jpg' },
        { id: 2, title: 'Graduation', description: 'Informatics Engineering graduation moment, marking the start of my IT career.', image: 'img/DSC01705.jpg' },
        { id: 3, title: 'Graduation', description: 'Informatics Engineering graduation moment, marking the start of my IT career.', image: 'img/DSC01731.jpg' },
        { id: 4, title: 'Relaxed Photo', description: 'Cool casual photos', image: 'img/1.jpg' },
        { id: 5, title: 'Organization Photo', description: 'Personal portrait while active in campus organizations.', image: 'img/7.jpg' },
        { id: 6, title: 'Graduation', description: 'Informatics Engineering graduation moment, marking the start of my IT career.', image: 'img/DSC01681.jpg' },
        { id: 7, title: 'Organization Photo', description: 'Personal portrait while active in campus organizations.', image: 'img/3.jpg' },
        { id: 8, title: 'Graduation', description: 'Informatics Engineering graduation moment, marking the start of my IT career.', image: 'img/OPA00044.jpg' }
    ];

    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) {
        galleryData.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item reveal';
            galleryItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="gallery-overlay">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            
            galleryItem.addEventListener('click', () => openLightbox(item.id));
            galleryGrid.appendChild(galleryItem);
            revealObserver.observe(galleryItem);
        });
    }

    // 9. Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentLightboxIndex = 0;

    function openLightbox(id) {
        const itemIndex = galleryData.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            currentLightboxIndex = itemIndex;
            updateLightboxContent();
            if (lightbox) {
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function navigateLightbox(direction) {
        if (direction === 'prev') {
            currentLightboxIndex = (currentLightboxIndex - 1 + galleryData.length) % galleryData.length;
        } else {
            currentLightboxIndex = (currentLightboxIndex + 1) % galleryData.length;
        }
        updateLightboxContent();
    }

    function updateLightboxContent() {
        const item = galleryData[currentLightboxIndex];
        if (lightboxImg && item) {
            lightboxImg.src = item.image;
            lightboxImg.alt = item.title;
            lightboxImg.setAttribute('data-id', item.id);
        }
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
    if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox('next'));
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox('prev');
        if (e.key === 'ArrowRight') navigateLightbox('next');
    });

    // 10. Skill Bars Animation
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillFills = entry.target.querySelectorAll('.skill-fill');
                    skillFills.forEach(fill => {
                        const item = fill.closest('.skill-item');
                        const level = item ? item.getAttribute('data-level') : null;
                        if (level) {
                            fill.style.width = level + '%';
                        }
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        skillsObserver.observe(skillsGrid);
    }

    // 11. Project Modal
    const projectModal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalBody = document.getElementById('modalBody');

    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;

            const img = card.querySelector('img');
            const title = card.querySelector('h3');
            const desc = card.querySelector('p');
            const techWrap = card.querySelector('.project-tags');
            const linksWrap = card.querySelector('.project-links');

            if (modalBody) {
                modalBody.innerHTML = `
                    <img src="${img ? img.src : ''}" alt="${title ? title.textContent : ''}" class="modal-img">
                    <h3 class="modal-title">${title ? title.textContent : ''}</h3>
                    <p class="modal-description">${desc ? desc.textContent : ''}</p>
                    <div class="modal-tech">${techWrap ? techWrap.innerHTML : ''}</div>
                    <div class="modal-links">${linksWrap ? linksWrap.innerHTML : ''}</div>
                `;
            }

            if (projectModal) {
                projectModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            if (projectModal) {
                projectModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
            projectModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // 12. Contact Form
    const myForm = document.getElementById('my-form');
    if (myForm) {
        myForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(myForm);
            const action = myForm.getAttribute('action');

            if (action) {
                fetch(action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(response => {
                    if (response.ok) {
                        alert('Message Sent!');
                        myForm.reset();
                    } else {
                        alert('Failed to send message. Please try again.');
                    }
                }).catch(error => {
                    alert('Failed to send message. Please try again.');
                });
            }
        });
    }
});