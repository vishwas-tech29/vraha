// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Remove preloader when page is loaded
    window.addEventListener('load', function() {
        const preloader = document.getElementById('preloader');
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // Initialize all components
    initCursorEffects();
    initHeroCanvas();
    initScrollAnimations();
    initMobileNav();
    initHeaderScroll();
    initCounters();
    initPortfolioFilter();
    initTestimonialSlider();
    initContactForm();
});

// Custom Cursor Effects
function initCursorEffects() {
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;
    
    window.addEventListener('mousemove', function(e) {
        const posX = e.clientX;
        const posY = e.clientY;
        
        // Animate cursor dot to follow cursor exactly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        // Animate cursor outline with slight delay for smooth effect
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: 'forwards' });
    });
    
    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .portfolio-card, .filter-btn, .social-link');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.border = '1px solid rgba(255, 255, 255, 0.5)';
            cursorOutline.style.backgroundColor = 'rgba(157, 78, 221, 0.1)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.border = '2px solid var(--color-accent-violet)';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
    });
    
    document.addEventListener('mouseenter', () => {
        cursorDot.style.display = 'block';
        cursorOutline.style.display = 'block';
    });
}

// 3D Hero Canvas with Three.js
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create particle system for digital city grid
    const particleCount = window.innerWidth > 768 ? 2000 : 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Define city grid boundaries
    const gridSize = 100;
    const gridDensity = 10;
    
    // Create grid points with some randomization
    for (let i = 0; i < particleCount; i++) {
        // Position particles in a grid pattern with some randomness
        const i3 = i * 3;
        
        // Create grid-like structure
        if (i < particleCount * 0.7) {
            // 70% of particles form the grid
            const x = (Math.floor(i / gridDensity) % gridDensity - gridDensity / 2) * (gridSize / gridDensity);
            const z = (Math.floor(i / (gridDensity * gridDensity)) - gridDensity / 2) * (gridSize / gridDensity);
            const y = (i % gridDensity - gridDensity / 2) * (gridSize / gridDensity);
            
            positions[i3] = x + (Math.random() - 0.5) * 2;
            positions[i3 + 1] = y + (Math.random() - 0.5) * 2;
            positions[i3 + 2] = z - 50; // Push grid back in z-space
        } else {
            // 30% of particles are randomly distributed for atmosphere
            positions[i3] = (Math.random() - 0.5) * gridSize;
            positions[i3 + 1] = (Math.random() - 0.5) * gridSize;
            positions[i3 + 2] = (Math.random() - 0.5) * gridSize - 50;
        }
        
        // Assign colors based on position (creating a gradient effect)
        const colorIndex = Math.floor(Math.random() * 3);
        if (colorIndex === 0) {
            // Electric blue
            colors[i3] = 0;
            colors[i3 + 1] = 0.9 + Math.random() * 0.1;
            colors[i3 + 2] = 1;
        } else if (colorIndex === 1) {
            // Violet
            colors[i3] = 0.6;
            colors[i3 + 1] = 0.3;
            colors[i3 + 2] = 0.9;
        } else {
            // Pink
            colors[i3] = 1;
            colors[i3 + 1] = 0.2;
            colors[i3 + 2] = 0.4;
        }
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Create particle material
    const particleMaterial = new THREE.PointsMaterial({
        size: window.innerWidth > 768 ? 0.2 : 0.3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    // Create particle system
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    // Add floating glowing elements (small spheres)
    const glowingElements = [];
    const glowCount = window.innerWidth > 768 ? 15 : 8;
    
    for (let i = 0; i < glowCount; i++) {
        const geometry = new THREE.SphereGeometry(Math.random() * 0.5 + 0.2, 16, 16);
        
        // Create glowing material with random color from our palette
        const colorChoice = Math.floor(Math.random() * 3);
        let color;
        
        if (colorChoice === 0) {
            color = new THREE.Color(0x00eeff); // Electric blue
        } else if (colorChoice === 1) {
            color = new THREE.Color(0x9d4edd); // Violet
        } else {
            color = new THREE.Color(0xff2a6d); // Pink
        }
        
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.7
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        
        // Position randomly within the scene
        sphere.position.x = (Math.random() - 0.5) * 40;
        sphere.position.y = (Math.random() - 0.5) * 40;
        sphere.position.z = (Math.random() - 0.5) * 20 - 30;
        
        // Store initial position for animation
        sphere.userData = {
            initialX: sphere.position.x,
            initialY: sphere.position.y,
            initialZ: sphere.position.z,
            speedFactor: Math.random() * 0.5 + 0.5,
            pulseSpeed: Math.random() * 0.02 + 0.01
        };
        
        scene.add(sphere);
        glowingElements.push(sphere);
    }
    
    // Position camera
    camera.position.z = 30;
    
    // Mouse movement effect for parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Smooth camera movement for parallax effect
        targetX = mouseX * 5;
        targetY = mouseY * 5;
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (targetY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        // Rotate particle system slowly
        particleSystem.rotation.y += 0.001;
        particleSystem.rotation.x += 0.0005;
        
        // Animate glowing elements
        const time = Date.now() * 0.001;
        glowingElements.forEach(element => {
            const data = element.userData;
            
            // Floating motion
            element.position.x = data.initialX + Math.sin(time * data.speedFactor) * 2;
            element.position.y = data.initialY + Math.cos(time * data.speedFactor) * 2;
            element.position.z = data.initialZ + Math.sin(time * data.speedFactor * 0.5) * 2;
            
            // Pulse effect
            const pulse = Math.sin(time * data.pulseSpeed * 5) * 0.1 + 0.9;
            element.scale.set(pulse, pulse, pulse);
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Scroll-based animations
function initScrollAnimations() {
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate sections on scroll
    const sections = document.querySelectorAll('section:not(.hero)');
    
    sections.forEach(section => {
        // Animate section headers
        const header = section.querySelector('.section-header');
        if (header) {
            gsap.from(header, {
                y: 50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        }
        
        // Animate about section elements
        if (section.classList.contains('about')) {
            const aboutText = section.querySelector('.about-text');
            const aboutImage = section.querySelector('.about-image');
            const statItems = section.querySelectorAll('.stat-item');
            
            if (aboutText) {
                gsap.from(aboutText, {
                    x: -50,
                    opacity: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: aboutText,
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                        onEnter: () => aboutText.classList.add('animated')
                    }
                });
            }
            
            if (aboutImage) {
                gsap.from(aboutImage, {
                    x: 50,
                    opacity: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: aboutImage,
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                        onEnter: () => aboutImage.classList.add('animated')
                    }
                });
            }
            
            if (statItems.length) {
                gsap.from(statItems, {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: statItems[0],
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                });
            }
        }
        
        // Animate service cards
        if (section.classList.contains('services')) {
            const serviceCards = section.querySelectorAll('.service-card');
            
            if (serviceCards.length) {
                gsap.from(serviceCards, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: serviceCards[0],
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                        onEnter: () => {
                            serviceCards.forEach(card => card.classList.add('animated'));
                        }
                    }
                });
            }
        }
        
        // Animate portfolio items
        if (section.classList.contains('portfolio')) {
            const portfolioItems = section.querySelectorAll('.portfolio-item');
            
            if (portfolioItems.length) {
                gsap.from(portfolioItems, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: portfolioItems[0],
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                        onEnter: () => {
                            portfolioItems.forEach(item => item.classList.add('animated'));
                        }
                    }
                });
            }
        }
        
        // Animate contact section
        if (section.classList.contains('contact')) {
            const contactInfo = section.querySelector('.contact-info');
            const contactForm = section.querySelector('.contact-form');
            
            if (contactInfo) {
                gsap.from(contactInfo, {
                    x: -50,
                    opacity: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: contactInfo,
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                        onEnter: () => contactInfo.classList.add('animated')
                    }
                });
            }
            
            if (contactForm) {
                gsap.from(contactForm, {
                    x: 50,
                    opacity: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: contactForm,
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                        onEnter: () => contactForm.classList.add('animated')
                    }
                });
            }
        }
    });
}

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    
    if (!hamburger || !navLinks) return;
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Animated Counters
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;
    
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                let count = 0;
                const speed = 2000 / target; // Adjust speed based on target value
                
                const updateCount = () => {
                    if (count < target) {
                        count++;
                        counter.textContent = count;
                        setTimeout(updateCount, speed);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Portfolio Filter
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (!filterBtns.length || !portfolioItems.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const categories = item.getAttribute('data-category');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    gsap.to(item, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power2.out',
                        onComplete: () => {
                            item.style.display = 'block';
                        }
                    });
                } else {
                    gsap.to(item, {
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.5,
                        ease: 'power2.out',
                        onComplete: () => {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

// Testimonial Slider
function initTestimonialSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    
    if (!testimonialCards.length || !dots.length) return;
    
    let currentIndex = 0;
    let interval;
    
    // Function to show testimonial by index
    const showTestimonial = (index) => {
        // Hide all testimonials
        testimonialCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current testimonial and activate dot
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentIndex = index;
    };
    
    // Click event for dots
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            showTestimonial(index);
            
            // Reset interval
            clearInterval(interval);
            startInterval();
        });
    });
    
    // Auto-rotate testimonials
    const startInterval = () => {
        interval = setInterval(() => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= testimonialCards.length) {
                nextIndex = 0;
            }
            showTestimonial(nextIndex);
        }, 5000);
    };
    
    // Start auto-rotation
    startInterval();
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send the form data to a server
        // For demo purposes, we'll just log it and show a success message
        console.log('Form submitted:', { name, email, service, message });
        
        // Show success message (in a real app, this would happen after successful API response)
        alert('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
    
    // Add animation to form inputs
    const formInputs = document.querySelectorAll('.form-input');
    
    formInputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            
            // Keep the label up if there's content
            if (input.value.trim() !== '') {
                input.classList.add('has-content');
            } else {
                input.classList.remove('has-content');
            }
        });
        
        // Check for existing content (e.g., on page refresh)
        if (input.value.trim() !== '') {
            input.classList.add('has-content');
        }
    });
}