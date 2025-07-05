        


        // Dynamic navigation background on scroll
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('nav');
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
                nav.style.borderBottom = '1px solid rgba(0, 0, 0, 0.15)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.85)';
                nav.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
            }
        });

        // Intersection Observer for section animations
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animate cards with delay
                    const cards = entry.target.querySelectorAll('.about-card, .stat-item, .team-member');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);



        // Observe all .sentences elements
        document.querySelectorAll('.sentences').forEach(sentence => {
        sectionObserver.observe(sentence);
        });



        // Observe all sections
        document.querySelectorAll('.section:not(.hero)').forEach(section => {
            sectionObserver.observe(section);
        });

        





        // Parallax effect for subtle movement
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const sections = document.querySelectorAll('.section');
            
            sections.forEach((section, index) => {
                const rate = scrolled * -0.3;
                if (index % 2 === 0) {
                    section.style.transform = `translateY(${rate * 0.1}px)`;
                }
            });
        });

        // Smooth page load animation
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });

        //Add smooth transition to negivations
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-1px)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });