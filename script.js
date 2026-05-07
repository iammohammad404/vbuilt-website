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

    // Modal Logic
    const serviceModal = document.getElementById('serviceModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalServiceName = document.getElementById('modalServiceName');
    const modalServiceInput = document.getElementById('modalServiceInput');
    const openModalBtns = document.querySelectorAll('.open-service-modal');

    function openModal(service) {
        if (serviceModal) {
            modalServiceName.textContent = service;
            modalServiceInput.value = service;
            serviceModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // prevent background scrolling
        }
    }

    function closeModal() {
        if (serviceModal) {
            serviceModal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset form inside modal slightly after closing animation
            setTimeout(() => {
                const form = document.getElementById('modalForm');
                if(form) form.reset();
                const result = document.getElementById('modalFormResult');
                if(result) result.style.display = 'none';
                const btn = document.getElementById('modalSubmitBtn');
                if(btn) {
                    btn.innerHTML = 'Confirm Booking';
                    btn.classList.remove('bg-success');
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }
            }, 300);
        }
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const service = btn.getAttribute('data-service');
            openModal(service);
        });
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal on outside click
    if (serviceModal) {
        serviceModal.addEventListener('click', (e) => {
            if (e.target === serviceModal) {
                closeModal();
            }
        });
    }

    // Modal Form Submission (Web3Forms)
    const modalForm = document.getElementById('modalForm');
    const modalFormResult = document.getElementById('modalFormResult');
    
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = document.getElementById('modalSubmitBtn');
            const originalText = 'Confirm Booking';
            
            btn.innerHTML = '<span class="material-icons-round" style="font-size:18px;vertical-align:middle;animation:spin 1s linear infinite;">autorenew</span> Processing...';
            btn.style.opacity = '0.8';
            modalFormResult.style.display = "none";
            
            const formData = new FormData(modalForm);
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
                    btn.innerHTML = '<span class="material-icons-round" style="font-size:18px;vertical-align:middle;">check_circle</span> Request Submitted Successfully';
                    btn.classList.add('bg-success');
                    btn.style.backgroundColor = '#10b981';
                    btn.style.color = 'white';
                    
                    modalFormResult.style.display = "block";
                    modalFormResult.innerHTML = "✅ Request Submitted Successfully. Our team will contact you within 15 minutes.";
                    modalFormResult.style.color = "#10b981";
                    
                    setTimeout(() => {
                        closeModal();
                    }, 3000);
                } else {
                    modalFormResult.style.display = "block";
                    modalFormResult.innerHTML = jsonResponse.message || "Something went wrong. Please try again.";
                    modalFormResult.style.color = "#ef4444";
                    btn.innerHTML = originalText;
                    btn.style.opacity = '1';
                }
            })
            .catch(error => {
                modalFormResult.style.display = "block";
                modalFormResult.innerHTML = "Something went wrong! Please check your connection.";
                modalFormResult.style.color = "#ef4444";
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
            });
        });
    }

    // Worker Registration Modal Logic
    const workerModal = document.getElementById('workerModal');
    const closeWorkerModalBtn = document.getElementById('closeWorkerModalBtn');
    const openWorkerModalBtns = document.querySelectorAll('.open-worker-modal');

    function openWorkerModal() {
        if (workerModal) {
            workerModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // If opened from mobile menu, close mobile menu first
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }
        }
    }

    function closeWorkerModal() {
        if (workerModal) {
            workerModal.classList.remove('active');
            document.body.style.overflow = '';
            
            setTimeout(() => {
                const form = document.getElementById('workerForm');
                if(form) form.reset();
                const result = document.getElementById('workerFormResult');
                if(result) result.style.display = 'none';
                const btn = document.getElementById('workerSubmitBtn');
                if(btn) {
                    btn.innerHTML = 'Submit Registration';
                    btn.classList.remove('bg-success');
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }
            }, 300);
        }
    }

    openWorkerModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openWorkerModal();
        });
    });

    if (closeWorkerModalBtn) closeWorkerModalBtn.addEventListener('click', closeWorkerModal);
    
    if (workerModal) {
        workerModal.addEventListener('click', (e) => {
            if (e.target === workerModal) {
                closeWorkerModal();
            }
        });
    }

    // Worker Form Submission (Web3Forms)
    const workerForm = document.getElementById('workerForm');
    const workerFormResult = document.getElementById('workerFormResult');
    
    if (workerForm) {
        workerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = document.getElementById('workerSubmitBtn');
            const originalText = 'Submit Registration';
            
            btn.innerHTML = '<span class="material-icons-round" style="font-size:18px;vertical-align:middle;animation:spin 1s linear infinite;">autorenew</span> Processing...';
            btn.style.opacity = '0.8';
            workerFormResult.style.display = "none";
            
            const formData = new FormData(workerForm);
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
                    btn.innerHTML = '<span class="material-icons-round" style="font-size:18px;vertical-align:middle;">check_circle</span> Registered Successfully';
                    btn.classList.add('bg-success');
                    btn.style.backgroundColor = '#10b981';
                    btn.style.color = 'white';
                    
                    workerFormResult.style.display = "block";
                    workerFormResult.innerHTML = "✅ Registration Submitted Successfully. Our team will contact you shortly.";
                    workerFormResult.style.color = "#10b981";
                    
                    setTimeout(() => {
                        closeWorkerModal();
                    }, 3500);
                } else {
                    workerFormResult.style.display = "block";
                    workerFormResult.innerHTML = jsonResponse.message || "Something went wrong. Please try again.";
                    workerFormResult.style.color = "#ef4444";
                    btn.innerHTML = originalText;
                    btn.style.opacity = '1';
                }
            })
            .catch(error => {
                workerFormResult.style.display = "block";
                workerFormResult.innerHTML = "Something went wrong! Please check your connection.";
                workerFormResult.style.color = "#ef4444";
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
            });
        });
    }

    // Language Switcher Logic
    const langOptions = document.querySelectorAll('.lang-option');
    
    // Auto-detect browser language initially or load from localStorage
    let currentLang = localStorage.getItem('vbuilt_lang');
    if (!currentLang) {
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.toLowerCase().includes('hi')) {
            currentLang = 'hi';
        } else {
            currentLang = 'en';
        }
    }
    
    function setLanguage(lang) {
        if (!window.translations || !window.translations[lang]) return;
        
        currentLang = lang;
        localStorage.setItem('vbuilt_lang', lang);
        
        // Update active class on switchers
        langOptions.forEach(opt => {
            if (opt.getAttribute('data-lang') === lang) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
        
        // Apply translations
        const dict = window.translations[lang];
        
        // Translate elements
        const translatableElements = document.querySelectorAll('[data-translate]');
        translatableElements.forEach(el => {
            const key = el.getAttribute('data-translate');
            if (dict[key]) {
                if(dict[key].includes('<')) {
                    el.innerHTML = dict[key];
                } else {
                    el.textContent = dict[key];
                }
            }
        });
        
        // Translate placeholders
        const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
        placeholderElements.forEach(el => {
            const key = el.getAttribute('data-translate-placeholder');
            if (dict[key]) {
                el.placeholder = dict[key];
            }
        });
        
        // Smooth transition effect
        document.body.style.transition = 'opacity 0.2s ease';
        document.body.style.opacity = '0.8';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 150);
    }
    
    // Bind click events
    langOptions.forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const lang = opt.getAttribute('data-lang');
            if (lang !== currentLang) {
                setLanguage(lang);
            }
        });
    });
    
    // Initialize Language
    // Small delay to ensure all DOM elements are parsed if needed, though we are in DOMContentLoaded
    setTimeout(() => {
        setLanguage(currentLang);
    }, 50);

});
