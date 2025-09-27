// Payment Integration Script

class PaymentGateway {
    constructor() {
        this.razorpayKey = 'rzp_test_YOUR_KEY_HERE'; // Replace with actual Razorpay test key
        this.init();
    }

    init() {
        this.loadRazorpayScript();
        this.setupPaymentListeners();
    }

    loadRazorpayScript() {
        // Load Razorpay script dynamically
        if (!document.getElementById('razorpay-script')) {
            const script = document.createElement('script');
            script.id = 'razorpay-script';
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.head.appendChild(script);
        }
    }

    setupPaymentListeners() {
        // UPI payment listener
        const upiInput = document.getElementById('upi-id');
        if (upiInput) {
            upiInput.addEventListener('input', (e) => {
                this.validateUPI(e.target.value);
            });
        }

        // Card payment listeners
        const cardNumber = document.getElementById('card-number');
        const cardExpiry = document.getElementById('card-expiry');
        const cardCvv = document.getElementById('card-cvv');

        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => {
                this.formatCardNumber(e.target);
            });
        }

        if (cardExpiry) {
            cardExpiry.addEventListener('input', (e) => {
                this.formatExpiry(e.target);
            });
        }

        if (cardCvv) {
            cardCvv.addEventListener('input', (e) => {
                this.formatCvv(e.target);
            });
        }
    }

    validateUPI(upiId) {
        const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
        const isValid = upiRegex.test(upiId);
        
        const upiInput = document.getElementById('upi-id');
        if (upiInput) {
            upiInput.classList.toggle('valid', isValid);
            upiInput.classList.toggle('invalid', !isValid && upiId.length > 0);
        }
        
        return isValid;
    }

    formatCardNumber(input) {
        let value = input.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        input.value = value.substring(0, 19);
    }

    formatExpiry(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        input.value = value.substring(0, 5);
    }

    formatCvv(input) {
        let value = input.value.replace(/\D/g, '');
        input.value = value.substring(0, 4);
    }

    async processUPIPayment(orderData) {
        try {
            // Create order on server
            const order = await this.createOrder(orderData);
            
            // Initialize Razorpay
            const options = {
                key: this.razorpayKey,
                amount: order.amount,
                currency: order.currency,
                name: 'StreetConnect',
                description: order.description,
                order_id: order.id,
                handler: (response) => {
                    this.handlePaymentSuccess(response, orderData);
                },
                prefill: {
                    name: orderData.customerName,
                    email: orderData.customerEmail,
                    contact: orderData.customerPhone
                },
                theme: {
                    color: '#FF6B35'
                }
            };

            const rzp = new Razorpay(options);
            rzp.open();

        } catch (error) {
            this.handlePaymentError(error);
        }
    }

    async processCardPayment(orderData) {
        try {
            // Validate card details
            const cardData = this.getCardData();
            if (!this.validateCardData(cardData)) {
                throw new Error('Invalid card details');
            }

            // Create order on server
            const order = await this.createOrder(orderData);
            
            // Initialize Razorpay with card payment
            const options = {
                key: this.razorpayKey,
                amount: order.amount,
                currency: order.currency,
                name: 'StreetConnect',
                description: order.description,
                order_id: order.id,
                handler: (response) => {
                    this.handlePaymentSuccess(response, orderData);
                },
                prefill: {
                    name: orderData.customerName,
                    email: orderData.customerEmail,
                    contact: orderData.customerPhone
                },
                theme: {
                    color: '#FF6B35'
                },
                modal: {
                    ondismiss: () => {
                        this.handlePaymentCancelled();
                    }
                }
            };

            const rzp = new Razorpay(options);
            rzp.open();

        } catch (error) {
            this.handlePaymentError(error);
        }
    }

    async processNetBankingPayment(orderData) {
        try {
            const order = await this.createOrder(orderData);
            
            const options = {
                key: this.razorpayKey,
                amount: order.amount,
                currency: order.currency,
                name: 'StreetConnect',
                description: order.description,
                order_id: order.id,
                handler: (response) => {
                    this.handlePaymentSuccess(response, orderData);
                },
                prefill: {
                    name: orderData.customerName,
                    email: orderData.customerEmail,
                    contact: orderData.customerPhone
                },
                theme: {
                    color: '#FF6B35'
                }
            };

            const rzp = new Razorpay(options);
            rzp.open();

        } catch (error) {
            this.handlePaymentError(error);
        }
    }

    async processCODPayment(orderData) {
        try {
            // For COD, we just need to create the order without payment
            const order = await this.createOrder({
                ...orderData,
                paymentMethod: 'cod',
                paymentStatus: 'pending'
            });

            this.handlePaymentSuccess({
                razorpay_payment_id: null,
                razorpay_order_id: order.id,
                razorpay_signature: null
            }, orderData);

        } catch (error) {
            this.handlePaymentError(error);
        }
    }

    async createOrder(orderData) {
        // In a real application, this would make an API call to your server
        // For demo purposes, we'll simulate the order creation
        
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return {
            id: 'order_' + Date.now(),
            amount: total * 100, // Razorpay expects amount in paise
            currency: 'INR',
            description: `Order for ${cart.length} items`,
            status: 'created'
        };
    }

    getCardData() {
        return {
            number: document.getElementById('card-number')?.value.replace(/\s/g, '') || '',
            expiry: document.getElementById('card-expiry')?.value || '',
            cvv: document.getElementById('card-cvv')?.value || '',
            name: document.getElementById('card-name')?.value || ''
        };
    }

    validateCardData(cardData) {
        // Basic card validation
        const cardNumber = cardData.number.replace(/\s/g, '');
        const expiry = cardData.expiry;
        const cvv = cardData.cvv;
        const name = cardData.name;

        // Card number validation (Luhn algorithm)
        if (!this.validateCardNumber(cardNumber)) {
            return false;
        }

        // Expiry validation
        if (!this.validateExpiry(expiry)) {
            return false;
        }

        // CVV validation
        if (cvv.length < 3 || cvv.length > 4) {
            return false;
        }

        // Name validation
        if (name.trim().length < 2) {
            return false;
        }

        return true;
    }

    validateCardNumber(cardNumber) {
        // Luhn algorithm for card number validation
        if (cardNumber.length < 13 || cardNumber.length > 19) {
            return false;
        }

        let sum = 0;
        let isEven = false;

        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i));

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    }

    validateExpiry(expiry) {
        if (!expiry || expiry.length !== 5) {
            return false;
        }

        const [month, year] = expiry.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        const expMonth = parseInt(month);
        const expYear = parseInt(year);

        if (expMonth < 1 || expMonth > 12) {
            return false;
        }

        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            return false;
        }

        return true;
    }

    handlePaymentSuccess(response, orderData) {
        // Verify payment signature on server
        this.verifyPayment(response).then(verified => {
            if (verified) {
                this.showNotification('Payment successful! Your order has been confirmed.', 'success');
                
                // Clear cart
                localStorage.removeItem('cart');
                
                // Update UI
                if (window.marketplace) {
                    window.marketplace.updateCartUI();
                }
                
                // Close checkout modal
                const modal = document.getElementById('checkout-modal');
                if (modal) {
                    modal.classList.remove('active');
                }
                
                // Redirect to success page
                setTimeout(() => {
                    window.location.href = 'order-success.html';
                }, 2000);
                
            } else {
                this.handlePaymentError(new Error('Payment verification failed'));
            }
        }).catch(error => {
            this.handlePaymentError(error);
        });
    }

    async verifyPayment(response) {
        // In a real application, this would make an API call to verify the payment
        // For demo purposes, we'll assume the payment is successful
        return true;
    }

    handlePaymentError(error) {
        this.showNotification('Payment failed: ' + error.message, 'error');
        console.error('Payment error:', error);
    }

    handlePaymentCancelled() {
        this.showNotification('Payment was cancelled', 'warning');
    }

    showNotification(message, type = 'info') {
        if (window.streetConnectApp && window.streetConnectApp.showNotification) {
            window.streetConnectApp.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    // UPI QR Code generation
    generateUPIQR(upiId, amount, name) {
        const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;
        
        // In a real application, you would use a QR code library
        // For demo purposes, we'll create a simple display
        return upiUrl;
    }

    // Payment method selection
    selectPaymentMethod(method) {
        const paymentMethods = document.querySelectorAll('.payment-option');
        paymentMethods.forEach(option => {
            option.classList.remove('selected');
        });

        const selectedOption = document.querySelector(`[value="${method}"]`);
        if (selectedOption) {
            selectedOption.closest('.payment-option').classList.add('selected');
        }

        // Show/hide relevant payment forms
        this.showPaymentForm(method);
    }

    showPaymentForm(method) {
        const forms = document.querySelectorAll('.payment-form');
        forms.forEach(form => {
            form.style.display = 'none';
        });

        const targetForm = document.getElementById(`${method}-form`);
        if (targetForm) {
            targetForm.style.display = 'block';
        }
    }

    // Get payment methods based on amount
    getAvailablePaymentMethods(amount) {
        const methods = ['upi', 'card', 'netbanking'];
        
        // COD available for orders above certain amount
        if (amount >= 500) {
            methods.push('cod');
        }
        
        return methods;
    }

    // Calculate payment fees
    calculatePaymentFees(amount, method) {
        const fees = {
            'upi': 0,
            'card': amount * 0.02, // 2% for cards
            'netbanking': amount * 0.01, // 1% for net banking
            'cod': 50 // Fixed fee for COD
        };
        
        return fees[method] || 0;
    }
}

// Initialize payment gateway when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.paymentGateway = new PaymentGateway();
});

// Payment form validation styles
const paymentStyles = `
    .payment-option.selected {
        border-color: var(--primary-color);
        background: rgba(255, 107, 53, 0.05);
    }
    
    .payment-form {
        display: none;
        margin-top: 1rem;
        padding: 1rem;
        border: 1px solid #E0E0E0;
        border-radius: var(--border-radius-small);
        background: #F8F9FA;
    }
    
    .payment-form.active {
        display: block;
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--text-primary);
    }
    
    .form-group input {
        width: 100%;
        padding: 12px 15px;
        border: 1px solid #E0E0E0;
        border-radius: var(--border-radius-small);
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }
    
    .form-group input:focus {
        outline: none;
        border-color: var(--primary-color);
    }
    
    .form-group input.valid {
        border-color: var(--success-color);
    }
    
    .form-group input.invalid {
        border-color: var(--error-color);
    }
    
    .card-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 1rem;
    }
    
    .upi-qr {
        text-align: center;
        padding: 2rem;
        background: white;
        border-radius: var(--border-radius-small);
        margin-top: 1rem;
    }
    
    .upi-qr img {
        max-width: 200px;
        margin-bottom: 1rem;
    }
    
    .payment-summary {
        background: #F8F9FA;
        padding: 1rem;
        border-radius: var(--border-radius-small);
        margin-bottom: 1rem;
    }
    
    .payment-summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }
    
    .payment-summary-row.total {
        font-weight: 600;
        font-size: 1.1rem;
        border-top: 1px solid #E0E0E0;
        padding-top: 0.5rem;
        margin-top: 0.5rem;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = paymentStyles;
document.head.appendChild(styleSheet); 