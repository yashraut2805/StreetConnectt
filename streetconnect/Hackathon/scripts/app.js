// StreetConnect Main Application JavaScript

class StreetConnectApp {
    constructor() {
        this.currentLanguage = 'en';
        this.isAuthenticated = false;
        this.currentUser = null;
        this.cart = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserPreferences();
        this.checkAuthentication();
        this.initializeComponents();
    }

    setupEventListeners() {
        // Mobile navigation toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Language switcher
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.changeLanguage(lang);
            });
        });

        // Voice search button
        const voiceBtn = document.getElementById('voice-btn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                this.startVoiceSearch();
            });
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Form submissions
        this.setupFormHandlers();
    }

    setupFormHandlers() {
        // Search form
        const searchForm = document.getElementById('search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSearch();
            });
        }

        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Registration form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration();
            });
        }
    }

    initializeComponents() {
        // Initialize cart
        this.loadCart();
        
        // Initialize notifications
        this.setupNotifications();
        
        // Initialize analytics
        this.initializeAnalytics();
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        
        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            }
        });

        // Load translations
        this.loadTranslations(lang);
        
        // Save preference
        localStorage.setItem('preferredLanguage', lang);
        
        // Show notification
        this.showNotification(`Language changed to ${this.getLanguageName(lang)}`, 'success');
    }

    getLanguageName(lang) {
        const languages = {
            'en': 'English',
            'hi': 'हिंदी',
            'mr': 'मराठी',
            'ta': 'தமிழ்',
            'te': 'తెలుగు'
        };
        return languages[lang] || lang;
    }

    loadTranslations(lang) {
        // This would load translations from a JSON file or API
        // For now, we'll use a simple object
        const translations = {
            'en': {
                'home': 'Home',
                'marketplace': 'Marketplace',
                'inventory': 'Inventory',
                'community': 'Community',
                'analytics': 'Analytics',
                'login': 'Login'
            },
            'hi': {
                'home': 'होम',
                'marketplace': 'बाजार',
                'inventory': 'सामग्री',
                'community': 'समुदाय',
                'analytics': 'विश्लेषण',
                'login': 'लॉगिन'
            }
            // Add more languages as needed
        };

        const currentTranslations = translations[lang] || translations['en'];
        
        // Update navigation
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            if (currentTranslations[key]) {
                element.textContent = currentTranslations[key];
            }
        });
    }

    startVoiceSearch() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.lang = this.getSpeechLanguage();
            recognition.continuous = false;
            recognition.interimResults = false;
            
            recognition.onstart = () => {
                this.showNotification('Listening... Speak now!', 'info');
                document.getElementById('voice-btn').innerHTML = '<i class="fas fa-stop"></i>';
            };
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('voice-search').value = transcript;
                this.handleVoiceSearch(transcript);
            };
            
            recognition.onerror = (event) => {
                this.showNotification('Voice recognition error: ' + event.error, 'error');
                document.getElementById('voice-btn').innerHTML = '<i class="fas fa-microphone"></i>';
            };
            
            recognition.onend = () => {
                document.getElementById('voice-btn').innerHTML = '<i class="fas fa-microphone"></i>';
            };
            
            recognition.start();
        } else {
            this.showNotification('Voice recognition not supported in this browser', 'error');
        }
    }

    getSpeechLanguage() {
        const speechLanguages = {
            'en': 'en-IN',
            'hi': 'hi-IN',
            'mr': 'mr-IN',
            'ta': 'ta-IN',
            'te': 'te-IN'
        };
        return speechLanguages[this.currentLanguage] || 'en-IN';
    }

    handleVoiceSearch(query) {
        // Process voice search query
        console.log('Voice search query:', query);
        
        // Redirect to marketplace with search
        if (window.location.pathname.includes('marketplace')) {
            this.searchProducts(query);
        } else {
            window.location.href = `pages/marketplace.html?search=${encodeURIComponent(query)}`;
        }
    }

    handleSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            const query = searchInput.value.trim();
            if (query) {
                this.searchProducts(query);
            }
        }
    }

    searchProducts(query) {
        // Implement product search functionality
        console.log('Searching for:', query);
        
        // For now, just show a notification
        this.showNotification(`Searching for: ${query}`, 'info');
    }

    handleLogin() {
        const formData = new FormData(document.getElementById('login-form'));
        const email = formData.get('email');
        const password = formData.get('password');
        
        // Implement login logic
        this.loginUser(email, password);
    }

    handleRegistration() {
        const formData = new FormData(document.getElementById('register-form'));
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            vendorType: formData.get('vendor-type')
        };
        
        // Implement registration logic
        this.registerUser(userData);
    }

    async loginUser(email, password) {
        try {
            // Show loading state
            this.showNotification('Logging in...', 'info');
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // For demo purposes, accept any login
            this.isAuthenticated = true;
            this.currentUser = {
                id: 'user123',
                name: 'Demo Vendor',
                email: email,
                vendorType: 'street-food'
            };
            
            // Save user data
            localStorage.setItem('user', JSON.stringify(this.currentUser));
            
            this.showNotification('Login successful!', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'pages/dashboard.html';
            }, 1000);
            
        } catch (error) {
            this.showNotification('Login failed: ' + error.message, 'error');
        }
    }

    async registerUser(userData) {
        try {
            this.showNotification('Creating account...', 'info');
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.showNotification('Account created successfully!', 'success');
            
            // Auto-login after registration
            this.currentUser = {
                id: 'user' + Date.now(),
                ...userData
            };
            
            localStorage.setItem('user', JSON.stringify(this.currentUser));
            
            setTimeout(() => {
                window.location.href = 'pages/dashboard.html';
            }, 1000);
            
        } catch (error) {
            this.showNotification('Registration failed: ' + error.message, 'error');
        }
    }

    checkAuthentication() {
        const userData = localStorage.getItem('user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.isAuthenticated = true;
            this.updateUIForAuthenticatedUser();
        }
    }

    updateUIForAuthenticatedUser() {
        const loginLink = document.querySelector('a[href*="login"]');
        if (loginLink && this.isAuthenticated) {
            loginLink.textContent = this.currentUser.name;
            loginLink.href = 'pages/dashboard.html';
        }
    }

    loadUserPreferences() {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage) {
            this.changeLanguage(savedLanguage);
        }
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${product.name} added to cart`, 'success');
    }

    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    setupNotifications() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        
        notification.className = `message ${type}`;
        notification.style.cssText = `
            margin-bottom: 10px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        
        // Set background color based on type
        const colors = {
            'success': '#4CAF50',
            'error': '#F44336',
            'warning': '#FF9800',
            'info': '#2196F3'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    initializeAnalytics() {
        // Initialize analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID');
        }
    }

    // Utility methods
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.streetConnectApp = new StreetConnectApp();
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 