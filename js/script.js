document.addEventListener('DOMContentLoaded', function() {
    // Current year for footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-times');
    });
    
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                }
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.glass-nav');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Project filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Gallery functionality
    const galleryData = [
        {
            id: 1,
            title: "Graduation",
            description: "Informatics Engineering graduation moment, marking the start of my IT career.",
            image: "img/DSC01736.jpg",
            category: "design"
        },
        {
            id: 2,
            title: "Graduation",
            description: "Informatics Engineering graduation moment, marking the start of my IT career.",
            image: "img/DSC01705.jpg",
            category: "design"
        },
        {
            id: 3,
            title: "Graduation",
            description: "Informatics Engineering graduation moment, marking the start of my IT career.",
            image: "img/DSC01731.jpg",
            category: "development"
        },
        {
            id: 4,
            title: "Relaxed Photo",
            description: "cool casual photos",
            image: "img/1.jpg",
            category: "design"
        },
        {
            id: 5,
            title: "Organization Photo",
            description: "Personal portrait while active in campus organizations.",
            image: "img/7.jpg",
            category: "photography"
        },
        {
            id: 6,
            title: "Graduation",
            description: "Informatics Engineering graduation moment, marking the start of my IT career.",
            image: "img/DSC01681.jpg",
            category: "development"
        },
        {
            id: 7,
            title: "Organization Photo",
            description: "Personal portrait while active in campus organizations.",
            image: "img/3.jpg",
            category: "photography"
        },
        {
            id: 8,
            title: "Graduation",
            description: "Informatics Engineering graduation moment, marking the start of my IT career.",
            image: "img/OPA00044.jpg",
            category: "development"
        }
    ];

    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    // Render gallery items
    function renderGallery(items) {
        galleryGrid.innerHTML = '';
        items.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-category', item.category);
            galleryItem.setAttribute('data-id', item.id);
            galleryItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="gallery-img">
                <div class="gallery-overlay">
                    <h3 class="gallery-title">${item.title}</h3>
                    <p class="gallery-description">${item.description}</p>
                </div>
            `;
            galleryGrid.appendChild(galleryItem);

            // Add click event to open lightbox
            galleryItem.addEventListener('click', () => {
                openLightbox(item.id);
            });
        });
    }

    // Filter gallery items
    galleryFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            galleryFilterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter gallery items
            if (filter === 'all') {
                renderGallery(galleryData);
            } else {
                const filteredItems = galleryData.filter(item => item.category === filter);
                renderGallery(filteredItems);
            }
        });
    });

    // Lightbox functionality
    function openLightbox(id) {
        const item = galleryData.find(item => item.id == id);
        if (item) {
            lightboxImg.src = item.image;
            lightboxImg.alt = item.title;
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    function navigateLightbox(direction) {
        const currentId = parseInt(lightboxImg.getAttribute('data-id') || galleryData[0].id);
        let currentIndex = galleryData.findIndex(item => item.id === currentId);
        
        if (direction === 'prev') {
            currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
        } else {
            currentIndex = (currentIndex + 1) % galleryData.length;
        }
        
        const item = galleryData[currentIndex];
        lightboxImg.src = item.image;
        lightboxImg.alt = item.title;
        lightboxImg.setAttribute('data-id', item.id);
    }

    lightboxClose.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateLightbox('prev'));
    nextBtn.addEventListener('click', () => navigateLightbox('next'));

    // Close lightbox when clicking outside
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('show')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox('prev');
            } else if (e.key === 'ArrowRight') {
                navigateLightbox('next');
            }
        }
    });

    // Initialize gallery
    renderGallery(galleryData);

    // Animate skill bars when section is in view
    const skillBars = document.querySelectorAll('.bar-fill');
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const skillLevel = bar.parentElement.getAttribute('data-level');
            bar.style.width = skillLevel + '%';
        });
    }
    
    // Intersection Observer for skill bars animation
    const skillsSection = document.querySelector('.skills');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(skillsSection);
    
    // Project modal functionality
    const projectModal = document.getElementById('projectModal');
    const closeModal = document.querySelector('.close-modal');
    
    // Close modal when clicking X
    closeModal.addEventListener('click', function() {
        projectModal.classList.remove('show');
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === projectModal) {
            projectModal.classList.remove('show');
        }
    });
    
    // Sample project data (replace with your actual projects)
    const projects = [
        {
            id: 1,
            title: "E-commerce Website",
            description: "A fully responsive e-commerce platform with cart functionality and payment integration. Built with React, Node.js, and MongoDB. Features include product filtering, user authentication, and order tracking.",
            image: "https://via.placeholder.com/800x500",
            tags: ["React", "Node.js", "MongoDB", "Redux"],
            liveLink: "#",
            codeLink: "#",
            category: "web"
        },
        {
            id: 2,
            title: "Fitness Tracker App",
            description: "Mobile application for tracking workouts and nutrition with personalized recommendations. Includes features like workout logging, progress tracking, and meal planning.",
            image: "https://via.placeholder.com/800x500",
            tags: ["React Native", "Firebase", "Expo"],
            liveLink: "#",
            codeLink: "#",
            category: "mobile"
        }
    ];
    
    // Add click event to project cards to open modal
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.getAttribute('data-id');
            const project = projects.find(p => p.id == projectId);
            
            if (project) {
                const modalBody = document.querySelector('.modal-body');
                modalBody.innerHTML = `
                    <img src="${project.image}" alt="${project.title}" class="modal-img">
                    <h3 class="modal-title">${project.title}</h3>
                    <p class="modal-description">${project.description}</p>
                    <div class="modal-tech">
                        ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                    </div>
                    <div class="modal-links">
                        <a href="${project.liveLink}" class="live" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                        <a href="${project.codeLink}" class="code" target="_blank"><i class="fab fa-github"></i> View Code</a>
                    </div>
                `;
                
                projectModal.classList.add('show');
            }
        });
    });
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send the form data to a server
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }
});