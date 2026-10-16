(() => {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.setAttribute('aria-label', isOpen ? 'Tutup navigasi' : 'Buka navigasi');
        });
        navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Buka navigasi');
        }));
    }

    const filters = document.querySelectorAll('.filter');
    const projects = document.querySelectorAll('.project-card');
    filters.forEach(button => button.addEventListener('click', () => {
        filters.forEach(filter => filter.classList.toggle('active', filter === button));
        const selected = button.dataset.filter;
        projects.forEach(project => {
            project.hidden = selected !== 'all' && project.dataset.category !== selected;
        });
    }));

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    const revealItems = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach(item => observer.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add('is-visible'));
    }
})();