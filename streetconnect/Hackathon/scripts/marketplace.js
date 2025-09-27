// Marketplace JavaScript

class Marketplace {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentFilters = {
            category: '',
            priceRange: [0, 5000],
            rating: [],
            delivery: [],
            search: ''
        };
        this.init();
    }

    init() {
        this.loadProducts();
        this.setupEventListeners();
        this.setupFilters();
        this.updateCartUI();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.currentFilters.search = searchInput.value;
                this.filterProducts();
            }, 300));
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.currentFilters.search = searchInput.value;
                this.filterProducts();
            });
        }

        // Cart functionality
        const cartToggle = document.getElementById('cart-toggle');
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartClose = document.getElementById('cart-close');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (cartToggle) {
            cartToggle.addEventListener('click', () => {
                cartSidebar.classList.add('active');
            });
        }

        if (cartClose) {
            cartClose.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
            });
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.openCheckout();
            });
        }

        // Modal functionality
        const productModal = document.getElementById('product-modal');
        const modalClose = document.getElementById('modal-close');
        const checkoutModal = document.getElementById('checkout-modal');
        const checkoutModalClose = document.getElementById('checkout-modal-close');

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                productModal.classList.remove('active');
            });
        }

        if (checkoutModalClose) {
            checkoutModalClose.addEventListener('click', () => {
                checkoutModal.classList.remove('active');
            });
        }

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });

        // Checkout steps
        const nextStepBtns = document.querySelectorAll('.next-step');
        const prevStepBtns = document.querySelectorAll('.prev-step');
        const placeOrderBtn = document.getElementById('place-order-btn');

        nextStepBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const step = e.target.dataset.step;
                this.showCheckoutStep(step);
            });
        });

        prevStepBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const step = e.target.dataset.step;
                this.showCheckoutStep(step);
            });
        });

        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', () => {
                this.placeOrder();
            });
        }

        // Location button
        const locationBtn = document.getElementById('location-btn');
        if (locationBtn) {
            locationBtn.addEventListener('click', () => {
                this.getUserLocation();
            });
        }
    }

    setupFilters() {
        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.filterProducts();
            });
        }

        // Price filter
        const priceFilter = document.getElementById('price-filter');
        if (priceFilter) {
            priceFilter.addEventListener('change', (e) => {
                const value = e.target.value;
                if (value) {
                    const [min, max] = value.split('-').map(Number);
                    this.currentFilters.priceRange = [min, max === 0 ? Infinity : max];
                } else {
                    this.currentFilters.priceRange = [0, 5000];
                }
                this.filterProducts();
            });
        }

        // Rating filter
        const ratingFilter = document.getElementById('rating-filter');
        if (ratingFilter) {
            ratingFilter.addEventListener('change', (e) => {
                const value = e.target.value;
                if (value) {
                    this.currentFilters.rating = [parseInt(value)];
                } else {
                    this.currentFilters.rating = [];
                }
                this.filterProducts();
            });
        }

        // Price slider
        const priceSlider = document.getElementById('price-slider');
        const priceValue = document.getElementById('price-value');
        if (priceSlider && priceValue) {
            priceSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                priceValue.textContent = `₹${value}`;
                this.currentFilters.priceRange = [0, parseInt(value)];
                this.filterProducts();
            });
        }

        // Category list
        const categoryLinks = document.querySelectorAll('.category-list a');
        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.dataset.category;
                
                // Update active state
                categoryLinks.forEach(l => l.classList.remove('active'));
                e.target.classList.add('active');
                
                this.currentFilters.category = category === 'all' ? '' : category;
                this.filterProducts();
            });
        });

        // Rating checkboxes
        const ratingOptions = document.querySelectorAll('.rating-option input');
        ratingOptions.forEach(option => {
            option.addEventListener('change', () => {
                this.updateRatingFilters();
            });
        });

        // Delivery checkboxes
        const deliveryOptions = document.querySelectorAll('.delivery-option input');
        deliveryOptions.forEach(option => {
            option.addEventListener('change', () => {
                this.updateDeliveryFilters();
            });
        });

        // Sort select
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortProducts(e.target.value);
            });
        }
    }

    updateRatingFilters() {
        const ratingOptions = document.querySelectorAll('.rating-option input:checked');
        this.currentFilters.rating = Array.from(ratingOptions).map(option => parseInt(option.value));
        this.filterProducts();
    }

    updateDeliveryFilters() {
        const deliveryOptions = document.querySelectorAll('.delivery-option input:checked');
        this.currentFilters.delivery = Array.from(deliveryOptions).map(option => option.value);
        this.filterProducts();
    }

    loadProducts() {
        // Sample product data - in a real app, this would come from an API
        this.products = [
            {
                id: 1,
                name: "Fresh Tomatoes",
                supplier: "Fresh Farms",
                category: "vegetables",
                price: 45,
                originalPrice: 60,
                rating: 4.5,
                reviewCount: 128,
                image: "../images/tomatos.jpg",
                description: "Fresh, red tomatoes perfect for cooking and salads. Sourced directly from local farms.",
                inStock: true,
                deliveryOptions: ["same-day", "next-day"],
                badge: "Fresh"
            },
            {
                id: 2,
                name: "Premium Basmati Rice",
                supplier: "Grain Masters",
                category: "grains",
                price: 120,
                originalPrice: 150,
                rating: 4.8,
                reviewCount: 89,
                image: "../images/basmati-rice.jpg",
                description: "Premium quality basmati rice, perfect for biryanis and pulao.",
                inStock: true,
                deliveryOptions: ["next-day", "free-delivery"],
                badge: "Premium"
            },
            {
                id: 3,
                name: "Mixed Spices Pack",
                supplier: "Spice Paradise",
                category: "spices",
                price: 85,
                originalPrice: 100,
                rating: 4.3,
                reviewCount: 156,
                image: "../images/mixed-spices.jpg",
                description: "Complete spice pack with all essential spices for Indian cooking.",
                inStock: true,
                deliveryOptions: ["same-day", "next-day", "free-delivery"],
                badge: "Best Seller"
            },
            {
                id: 4,
                name: "Stainless Steel Kadai",
                supplier: "Kitchen Essentials",
                category: "utensils",
                price: 450,
                originalPrice: 600,
                rating: 4.6,
                reviewCount: 67,
                image: "../images/kadai.webp",
                description: "Heavy-duty stainless steel kadai for deep frying and cooking.",
                inStock: true,
                deliveryOptions: ["next-day"],
                badge: "Popular"
            },
            {
                id: 5,
                name: "Onions (1kg)",
                supplier: "Fresh Farms",
                category: "vegetables",
                price: 35,
                originalPrice: 45,
                rating: 4.2,
                reviewCount: 203,
                image: "../images/onion.jpg",
                description: "Fresh onions, perfect for daily cooking needs.",
                inStock: true,
                deliveryOptions: ["same-day", "next-day"],
                badge: "Fresh"
            },
            {
                id: 6,
                name: "Mustard Oil (1L)",
                supplier: "Pure Oils",
                category: "oils",
                price: 180,
                originalPrice: 220,
                rating: 4.4,
                reviewCount: 94,
                image: "../images/oil.avif",
                description: "Pure mustard oil for authentic Indian cooking.",
                inStock: true,
                deliveryOptions: ["next-day", "free-delivery"],
                badge: "Pure"
            },
            {
                id: 7,
                name: "Disposable Plates (100pcs)",
                supplier: "Packaging Plus",
                category: "packaging",
                price: 75,
                originalPrice: 90,
                rating: 4.1,
                reviewCount: 78,
                image: "../images/plates.jpeg",
                description: "Eco-friendly disposable plates for food service.",
                inStock: true,
                deliveryOptions: ["same-day", "next-day"],
                badge: "Eco"
            },
            {
                id: 8,
                name: "Paneer (500g)",
                supplier: "Dairy Delights",
                category: "dairy",
                price: 95,
                originalPrice: 120,
                rating: 4.7,
                reviewCount: 112,
                image: "../images/paneer.webp",
                description: "Fresh homemade paneer for curries and snacks.",
                inStock: true,
                deliveryOptions: ["same-day", "next-day"],
                badge: "Fresh"
            }
        ];

        this.filteredProducts = [...this.products];
        this.renderProducts();
    }

    filterProducts() {
        this.filteredProducts = this.products.filter(product => {
            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search.toLowerCase();
                const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                                    product.supplier.toLowerCase().includes(searchTerm) ||
                                    product.category.toLowerCase().includes(searchTerm);
                if (!matchesSearch) return false;
            }

            // Category filter
            if (this.currentFilters.category && product.category !== this.currentFilters.category) {
                return false;
            }

            // Price filter
            if (product.price < this.currentFilters.priceRange[0] || 
                product.price > this.currentFilters.priceRange[1]) {
                return false;
            }

            // Rating filter
            if (this.currentFilters.rating.length > 0) {
                const meetsRating = this.currentFilters.rating.some(rating => product.rating >= rating);
                if (!meetsRating) return false;
            }

            // Delivery filter
            if (this.currentFilters.delivery.length > 0) {
                const hasDelivery = this.currentFilters.delivery.some(option => 
                    product.deliveryOptions.includes(option)
                );
                if (!hasDelivery) return false;
            }

            return true;
        });

        this.currentPage = 1;
        this.renderProducts();
    }

    sortProducts(sortBy) {
        switch (sortBy) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                this.filteredProducts.sort((a, b) => b.id - a.id);
                break;
            default:
                // Relevance - keep original order
                break;
        }
        this.renderProducts();
    }

    renderProducts() {
        const productsGrid = document.getElementById('products-grid');
        const resultsCount = document.getElementById('results-count');
        
        if (!productsGrid) return;

        // Update results count
        if (resultsCount) {
            resultsCount.textContent = `Showing ${this.filteredProducts.length} products`;
        }

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        // Clear existing products
        productsGrid.innerHTML = '';

        if (productsToShow.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </div>
            `;
            return;
        }

        // Render products
        productsToShow.forEach(product => {
            const productCard = this.createProductCard(product);
            productsGrid.appendChild(productCard);
        });

        this.renderPagination();
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='../images/tomatos.jpg'">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-supplier">by ${product.supplier}</p>
                <div class="product-rating">
                    <span class="stars">${this.getStars(product.rating)}</span>
                    <span class="rating-count">${product.rating} (${product.reviewCount})</span>
                </div>
                <div class="product-price">
                    <span class="price">₹${product.price}</span>
                    ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice}</span>` : ''}
                    ${discount > 0 ? `<span class="discount">${discount}% OFF</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart-btn" onclick="marketplace.addToCart(${product.id})">
                        Add to Cart
                    </button>
                    <button class="quick-view-btn" onclick="marketplace.openProductModal(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    getStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        const pagination = document.querySelector('.pagination');
        
        if (!pagination || totalPages <= 1) {
            if (pagination) pagination.style.display = 'none';
            return;
        }

        pagination.style.display = 'flex';
        
        const pageNumbers = pagination.querySelector('.page-numbers');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        // Update page numbers
        pageNumbers.innerHTML = '';
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                const pageNumber = document.createElement('span');
                pageNumber.className = `page-number ${i === this.currentPage ? 'active' : ''}`;
                pageNumber.textContent = i;
                pageNumber.addEventListener('click', () => this.goToPage(i));
                pageNumbers.appendChild(pageNumber);
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                const dots = document.createElement('span');
                dots.className = 'page-dots';
                dots.textContent = '...';
                pageNumbers.appendChild(dots);
            }
        }
        
        // Update navigation buttons
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
            prevBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages;
            nextBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        }
    }

    goToPage(page) {
        if (page < 1 || page > Math.ceil(this.filteredProducts.length / this.productsPerPage)) return;
        this.currentPage = page;
        this.renderProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartUI();
        this.showNotification(`${product.name} added to cart`, 'success');
    }

    updateCartUI() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        // Update cart count
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.classList.toggle('visible', totalItems > 0);
        }
        
        // Update cart items
        if (cartItems) {
            cartItems.innerHTML = '';
            
            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                        <p>Your cart is empty</p>
                    </div>
                `;
                return;
            }
            
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='../assets/placeholder.jpg'">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-price">₹${item.price}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="marketplace.updateCartQuantity(${item.id}, -1)">-</button>
                            <span class="cart-item-qty">${item.quantity}</span>
                            <button class="quantity-btn" onclick="marketplace.updateCartQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });
        }
        
        // Update cart total
        if (cartTotal) {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `₹${total.toFixed(2)}`;
        }
    }

    updateCartQuantity(productId, change) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex === -1) return;
        
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartUI();
    }

    openProductModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const modal = document.getElementById('product-modal');
        const modalName = document.getElementById('modal-product-name');
        const modalImage = document.getElementById('modal-product-image');
        const modalPrice = document.getElementById('modal-product-price');
        const modalOriginalPrice = document.getElementById('modal-original-price');
        const modalRating = document.getElementById('modal-product-rating');
        const modalRatingText = document.getElementById('modal-rating-text');
        const modalDescription = document.getElementById('modal-product-description');

        if (modalName) modalName.textContent = product.name;
        if (modalImage) modalImage.src = product.image;
        if (modalPrice) modalPrice.textContent = `₹${product.price}`;
        if (modalOriginalPrice) modalOriginalPrice.textContent = product.originalPrice ? `₹${product.originalPrice}` : '';
        if (modalRating) modalRating.textContent = this.getStars(product.rating);
        if (modalRatingText) modalRatingText.textContent = `${product.rating} (${product.reviewCount} reviews)`;
        if (modalDescription) modalDescription.textContent = product.description;

        // Reset quantity
        const qtyInput = document.getElementById('qty-input');
        if (qtyInput) qtyInput.value = 1;

        // Setup quantity controls
        const qtyDecrease = document.getElementById('qty-decrease');
        const qtyIncrease = document.getElementById('qty-increase');
        const addToCartBtn = document.getElementById('modal-add-to-cart');

        if (qtyDecrease) {
            qtyDecrease.onclick = () => {
                if (qtyInput.value > 1) qtyInput.value = parseInt(qtyInput.value) - 1;
            };
        }

        if (qtyIncrease) {
            qtyIncrease.onclick = () => {
                qtyInput.value = parseInt(qtyInput.value) + 1;
            };
        }

        if (addToCartBtn) {
            addToCartBtn.onclick = () => {
                const quantity = parseInt(qtyInput.value);
                for (let i = 0; i < quantity; i++) {
                    this.addToCart(productId);
                }
                modal.classList.remove('active');
            };
        }

        modal.classList.add('active');
    }

    openCheckout() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.length === 0) {
            this.showNotification('Your cart is empty', 'warning');
            return;
        }

        const modal = document.getElementById('checkout-modal');
        modal.classList.add('active');
    }

    showCheckoutStep(step) {
        const steps = document.querySelectorAll('.checkout-step');
        steps.forEach(s => s.classList.remove('active'));
        
        const targetStep = document.getElementById(`step-${step}`);
        if (targetStep) {
            targetStep.classList.add('active');
        }
    }

    async placeOrder() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.length === 0) {
            this.showNotification('Your cart is empty', 'warning');
            return;
        }

        // Get delivery details
        const deliveryName = document.getElementById('delivery-name').value;
        const deliveryPhone = document.getElementById('delivery-phone').value;
        const deliveryAddress = document.getElementById('delivery-address').value;
        const deliveryCity = document.getElementById('delivery-city').value;
        const deliveryState = document.getElementById('delivery-state').value;
        const deliveryPincode = document.getElementById('delivery-pincode').value;

        if (!deliveryName || !deliveryPhone || !deliveryAddress || !deliveryCity || !deliveryState || !deliveryPincode) {
            this.showNotification('Please fill in all delivery details', 'warning');
            return;
        }

        // Get payment method
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

        try {
            this.showNotification('Processing your order...', 'info');
            
            // Simulate order processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Clear cart
            localStorage.removeItem('cart');
            this.updateCartUI();
            
            // Close modal
            const modal = document.getElementById('checkout-modal');
            modal.classList.remove('active');
            
            this.showNotification('Order placed successfully! You will receive a confirmation shortly.', 'success');
            
            // Redirect to order confirmation
            setTimeout(() => {
                window.location.href = 'order-confirmation.html';
            }, 2000);
            
        } catch (error) {
            this.showNotification('Order failed: ' + error.message, 'error');
        }
    }

    async getUserLocation() {
        const locationText = document.getElementById('location-text');
        
        if (navigator.geolocation) {
            try {
                this.showNotification('Getting your location...', 'info');
                
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                
                const { latitude, longitude } = position.coords;
                
                // In a real app, you would reverse geocode to get address
                // For now, we'll just show coordinates
                if (locationText) {
                    locationText.textContent = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                }
                
                this.showNotification('Location updated successfully', 'success');
                
            } catch (error) {
                this.showNotification('Could not get location: ' + error.message, 'error');
            }
        } else {
            this.showNotification('Geolocation is not supported by this browser', 'error');
        }
    }

    showNotification(message, type = 'info') {
        if (window.streetConnectApp && window.streetConnectApp.showNotification) {
            window.streetConnectApp.showNotification(message, type);
        } else {
            // Fallback notification
            alert(message);
        }
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

// Initialize marketplace when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.marketplace = new Marketplace();
}); 