document.addEventListener('DOMContentLoaded', () => {
    
    // Page Loader
    const loader = document.getElementById('page-loader');
    if (loader) {
        // Hide loader after a short delay for smooth feeling
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 800);
    }

    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const closeMenu = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    if (hamburger && closeMenu && mobileMenu) {
        hamburger.addEventListener('click', toggleMenu);
        closeMenu.addEventListener('click', toggleMenu);

        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }

    // Navbar Scroll Effect (Glassmorphism enhanced)
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
            navbar.style.background = 'rgba(255, 255, 255, 0.9)';
            navbar.style.padding = '0';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.background = 'rgba(255, 255, 255, 0.7)';
        }
    });

    // Scroll Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    };

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Handle Quick Inquiry Form Submission (Web3Forms)
    const inquiryForm = document.getElementById('inquiryForm');
    const formResult = document.getElementById('formResult');
    
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = inquiryForm.querySelector('button');
            const originalText = btn.textContent;
            
            // Loading State
            btn.innerHTML = '<span class="material-icons-round" style="font-size:18px;vertical-align:middle;animation:spin 1s linear infinite;">autorenew</span> Sending...';
            btn.style.opacity = '0.8';
            formResult.style.display = "none";
            
            const formData = new FormData(inquiryForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let jsonResponse = await response.json();
                if (response.status == 200) {
                    // Success UI
                    btn.innerHTML = '<span class="material-icons-round" style="font-size:18px;vertical-align:middle;">check_circle</span> Request Sent!';
                    btn.classList.add('bg-success');
                    btn.style.backgroundColor = '#10b981';
                    btn.style.color = 'white';
                    
                    formResult.style.display = "block";
                    formResult.innerHTML = "Success! We'll call you shortly.";
                    formResult.style.color = "#10b981";
                    inquiryForm.reset();
                } else {
                    // Error UI from API
                    console.log(response);
                    formResult.style.display = "block";
                    formResult.innerHTML = jsonResponse.message || "Something went wrong. Please try again.";
                    formResult.style.color = "#ef4444";
                    btn.innerHTML = originalText;
                }
            })
            .catch(error => {
                // Network Error UI
                console.log(error);
                formResult.style.display = "block";
                formResult.innerHTML = "Something went wrong! Please check your connection.";
                formResult.style.color = "#ef4444";
                btn.innerHTML = originalText;
            })
            .then(function() {
                // Reset State after delay
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = '';
                    btn.classList.remove('bg-success');
                    btn.style.opacity = '1';
                    formResult.style.display = "none";
                }, 4000);
            });
        });
    }
});
