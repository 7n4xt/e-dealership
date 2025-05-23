class OrderPanel {
    constructor() {
        this.API_KEY = 'e2a832e2444643e4950b21203195a478';
        this.panel = document.querySelector('.order-slide-panel');
        this.searchInput = document.getElementById('location-search');
        this.resultsContainer = document.getElementById('location-results');
        this.selectedLocation = document.getElementById('selected-location');
        this.confirmButton = document.getElementById('confirm-order');
        this.closeButton = document.querySelector('.close-panel');
        this.overlay = null;

        this.initializeEventListeners();
        this.initializePaymentHandlers();
        this.initializeCardSelection();
        this.initializeDeliveryOptions();
        this.createOverlay();
        this.initializeConfirmOrderButton();
    }

    createOverlay() {
        // Create overlay if it doesn't exist
        if (!document.querySelector('.order-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'order-overlay';
            document.body.appendChild(overlay);
            this.overlay = overlay;

            // Add click event listener to close panel when overlay is clicked
            overlay.addEventListener('click', () => this.closePanel());
        } else {
            this.overlay = document.querySelector('.order-overlay');
        }
    }

    initializeEventListeners() {
        // Debounce search input
        let timeout = null;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => this.searchLocation(e.target.value), 500);
        });

        // Handle location selection
        this.resultsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('location-result-item')) {
                this.selectLocation(JSON.parse(e.target.dataset.location));
            }
        });

        // Handle panel close
        this.closeButton.addEventListener('click', () => this.closePanel());

        // Handle order confirmation
        this.confirmButton.addEventListener('click', () => this.handleOrderConfirmation());
    }

    initializePaymentHandlers() {
        const paymentInputs = document.querySelectorAll('input[name="payment"]');
        paymentInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.togglePaymentDetails(e.target.value);
            });
        });

        // Card number formatting
        const cardNumber = document.getElementById('card-number');
        cardNumber?.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            const selectedCard = document.querySelector('.card-option-item.selected');
            const cardType = selectedCard?.dataset.card;
            value = this.formatCardNumber(value, cardType);
            e.target.value = value;

            // Detect card type
            this.detectCardType(value);
        });

        // Expiry date formatting
        const cardExpiry = document.getElementById('card-expiry');
        cardExpiry?.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });

        // PayPal form handling
        const paypalEmail = document.getElementById('paypal-email');
        const paypalPhone = document.getElementById('paypal-phone');

        paypalEmail?.addEventListener('input', () => this.validatePayPalInput(paypalEmail, 'email'));
        paypalPhone?.addEventListener('input', () => this.validatePayPalInput(paypalPhone, 'phone'));
    }

    validatePayPalInput(input, type) {
        const errorMessage = input.parentElement.querySelector('.error-message')
            || this.createErrorMessage(input.parentElement);

        if (type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.classList.add('invalid-input');
                errorMessage.textContent = 'Invalid PayPal email';
                errorMessage.classList.add('show');
                return false;
            }
        } else if (type === 'phone') {
            const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
            if (!phoneRegex.test(input.value)) {
                input.classList.add('invalid-input');
                errorMessage.textContent = 'Invalid phone number';
                errorMessage.classList.add('show');
                return false;
            }
        }

        input.classList.remove('invalid-input');
        errorMessage.classList.remove('show');
        return true;
    }

    createErrorMessage(parent) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        parent.appendChild(errorDiv);
        return errorDiv;
    }

    async handlePayPalPayment() {
        const email = document.getElementById('paypal-email');
        const phone = document.getElementById('paypal-phone');

        if (!this.validatePayPalInput(email, 'email') ||
            !this.validatePayPalInput(phone, 'phone')) {
            return false;
        }

        const redirectMessage = document.querySelector('.paypal-redirect-message');
        redirectMessage.classList.add('show');

        // Simulate PayPal redirect
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Here you would normally redirect to PayPal
        window.location.href = `https://www.paypal.com/signin?email=${encodeURIComponent(email.value)}`;
        return true;
    }

    initializeCardSelection() {
        const cardItems = document.querySelectorAll('.card-option-item');
        const cardNumberInput = document.getElementById('card-number');

        cardItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove selection from all cards
                cardItems.forEach(card => card.classList.remove('selected'));
                // Add selection to clicked card
                item.classList.add('selected');

                // Update card number input placeholder based on selection
                const cardType = item.dataset.card;
                switch (cardType) {
                    case 'visa':
                    case 'mastercard':
                        cardNumberInput.maxLength = 19; // 16 digits + 3 spaces
                        cardNumberInput.placeholder = 'XXXX XXXX XXXX XXXX';
                        break;
                    case 'amex':
                        cardNumberInput.maxLength = 17; // 15 digits + 2 spaces
                        cardNumberInput.placeholder = 'XXXX XXXXXX XXXXX';
                        break;
                    case 'cb':
                        cardNumberInput.maxLength = 19;
                        cardNumberInput.placeholder = 'XXXX XXXX XXXX XXXX';
                        break;
                }

                // Clear any existing input
                cardNumberInput.value = '';
            });
        });

        // Select first card by default
        cardItems[0]?.classList.add('selected');
    }

    initializeDeliveryOptions() {
        const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
        const locationSearch = document.querySelector('.location-search');
        const storeDetails = document.querySelector('.store-details');

        deliveryOptions.forEach(option => {
            option.addEventListener('change', (e) => {
                const deliveryType = e.target.value;

                // Toggle location search visibility
                if (deliveryType === 'store') {
                    locationSearch.style.display = 'none';
                    storeDetails.style.display = 'block';
                } else {
                    locationSearch.style.display = 'block';
                    storeDetails.style.display = 'none';
                }

                // Update total price based on delivery option
                this.updateTotalPrice(deliveryType);
            });
        });
    }

    updateTotalPrice(deliveryType) {
        const basePrice = parseFloat(localStorage.getItem('cartTotal')) || 0;
        let deliveryPrice = 0;

        switch (deliveryType) {
            case 'home':
                deliveryPrice = 15.00;
                break;
            case 'express':
                deliveryPrice = 25.00;
                break;
            case 'store':
                deliveryPrice = 0;
                break;
        }

        const total = basePrice + deliveryPrice;
        document.querySelector('.total-price').textContent = `${total.toFixed(2)} €`;
    }

    detectCardType(number) {
        const logos = document.querySelectorAll('.card-logo');
        logos.forEach(logo => logo.classList.remove('active'));

        // Remove spaces and dashes
        number = number.replace(/[\s-]/g, '');

        let cardType = null;

        // Visa
        if (number.match(/^4/)) {
            cardType = 'visa';
        }
        // Mastercard
        else if (number.match(/^5[1-5]/)) {
            cardType = 'mastercard';
        }
        // American Express
        else if (number.match(/^3[47]/)) {
            cardType = 'amex';
        }
        // Carte Bancaire (French debit cards)
        else if (number.match(/^(4|5|6)/)) {
            cardType = 'cb';
        }

        if (cardType) {
            const logo = document.querySelector(`.card-logo[alt="${cardType}"]`);
            logo?.classList.add('active');
        }
    }

    async searchLocation(query) {
        if (query.length < 3) {
            this.resultsContainer.style.display = 'none';
            return;
        }

        try {
            const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${this.API_KEY}&limit=5`
            );

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            if (data.results.length === 0) {
                this.resultsContainer.innerHTML = '<div class="location-error">No locations found</div>';
                this.resultsContainer.style.display = 'block';
                return;
            }

            this.displayResults(data.results);
        } catch (error) {
            console.error('Error searching location:', error);
            this.resultsContainer.innerHTML = '<div class="location-error">Unable to search locations. Please try again.</div>';
            this.resultsContainer.style.display = 'block';
        }
    }

    displayResults(results) {
        this.resultsContainer.innerHTML = '';

        results.forEach(result => {
            const div = document.createElement('div');
            div.className = 'location-result-item';
            div.textContent = result.formatted;
            div.dataset.location = JSON.stringify({
                address: result.formatted,
                lat: result.geometry.lat,
                lng: result.geometry.lng
            });
            this.resultsContainer.appendChild(div);
        });

        this.resultsContainer.style.display = 'block';
    }

    selectLocation(location) {
        const addressElem = this.selectedLocation.querySelector('.address') || document.createElement('p');
        const coordsElem = this.selectedLocation.querySelector('.coordinates') || document.createElement('small');

        addressElem.className = 'address';
        coordsElem.className = 'coordinates';

        addressElem.textContent = location.address;
        coordsElem.textContent = `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`;

        this.selectedLocation.innerHTML = '';
        this.selectedLocation.appendChild(addressElem);
        this.selectedLocation.appendChild(coordsElem);

        this.selectedLocation.style.display = 'block';
        this.resultsContainer.style.display = 'none';
        this.searchInput.value = location.address;

        // Add map background pattern for dark theme
        const map = document.getElementById('location-map');
        if (map) {
            map.style.background = `
                linear-gradient(45deg, #1a1a1a 25%, #222 25%),
                linear-gradient(-45deg, #1a1a1a 25%, #222 25%),
                linear-gradient(45deg, #222 75%, #1a1a1a 75%),
                linear-gradient(-45deg, #222 75%, #1a1a1a 75%)
            `;
            map.style.backgroundSize = '20px 20px';
            map.style.backgroundPosition = '0 0, 0 10px, 10px -10px, -10px 0px';
            map.style.display = 'block';
        }
    }

    togglePaymentDetails(paymentMethod) {
        const cardDetails = document.querySelector('.card-details');
        const paypalDetails = document.querySelector('.paypal-details');

        if (paymentMethod === 'card') {
            cardDetails.classList.add('active');
            paypalDetails.classList.remove('active');
        } else {
            cardDetails.classList.remove('active');
            paypalDetails.classList.add('active');
        }
    }

    validatePaymentDetails() {
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

        if (paymentMethod === 'card') {
            const cardNumber = document.getElementById('card-number').value;
            const cardExpiry = document.getElementById('card-expiry').value;
            const cardCvv = document.getElementById('card-cvv').value;
            const cardName = document.getElementById('card-name').value;
            const selectedCard = document.querySelector('.card-option-item.selected');
            const cardType = selectedCard?.dataset.card;

            if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
                alert('Please fill in all card fields');
                return false;
            }

            if (!this.validateCardNumber(cardNumber, cardType)) {
                alert('Invalid card number');
                return false;
            }
        }
        return true;
    }

    validateCardNumber(number, type) {
        // Remove spaces and dashes
        number = number.replace(/[\s-]/g, '');

        switch (type) {
            case 'visa':
                return /^4[0-9]{15}$/.test(number);
            case 'mastercard':
                return /^5[1-5][0-9]{14}$/.test(number);
            case 'amex':
                return /^3[47][0-9]{13}$/.test(number);
            case 'cb':
                return /^(4|5|6)[0-9]{15}$/.test(number);
            default:
                return false;
        }
    }

    formatCardNumber(number, type) {
        number = number.replace(/\D/g, '');

        if (type === 'amex') {
            return number.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
        }

        return number.replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    openPanel() {
        this.panel.classList.add('active');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closePanel() {
        this.panel.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    initializeConfirmOrderButton() {
        const confirmOrderBtn = document.getElementById('confirm-order');
        if (confirmOrderBtn) {
            confirmOrderBtn.addEventListener('click', () => this.handleOrderConfirmation());
        }
    }

    async handleOrderConfirmation() {
        // Get required elements
        const selectedAddress = this.selectedLocation?.querySelector('.address')?.textContent;
        const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
        const deliveryMethod = document.querySelector('input[name="delivery"]:checked')?.value;
        const confirmOrderBtn = document.getElementById('confirm-order');

        // Basic validation
        if (!this.validateOrderInputs()) {
            if (typeof showNotification === 'function') {
                showNotification('Please fill in all required fields', 'error');
            } else {
                alert('Please fill in all required fields');
            }
            return;
        }

        // Show loading state
        confirmOrderBtn.disabled = true;
        confirmOrderBtn.textContent = 'Processing...';

        try {
            // Check if the updateStockAfterPurchase function exists
            if (typeof updateStockAfterPurchase === 'function') {
                // Call the stock update function from cartandwish.js
                const stockUpdateSuccess = await updateStockAfterPurchase();

                if (stockUpdateSuccess) {
                    // Display success message
                    if (typeof showNotification === 'function') {
                        showNotification('Order completed successfully!', 'success');
                    } else {
                        alert('Order completed successfully!');
                    }

                    // Clear cart and close panel after small delay
                    setTimeout(() => {
                        this.clearCartAndClose();
                        // Reset button
                        confirmOrderBtn.disabled = false;
                        confirmOrderBtn.textContent = 'Confirm Order';
                    }, 1500);
                } else {
                    // Reset button state
                    confirmOrderBtn.disabled = false;
                    confirmOrderBtn.textContent = 'Confirm Order';
                }
            } else {
                // Fallback to legacy payment processing if updateStockAfterPurchase not available
                if (paymentMethod === 'paypal') {
                    this.processPayPalPayment();
                } else {
                    this.processCardPayment();
                }
                confirmOrderBtn.disabled = false;
                confirmOrderBtn.textContent = 'Confirm Order';
            }
        } catch (error) {
            console.error('Error processing order:', error);
            if (typeof showNotification === 'function') {
                showNotification('Error processing your order. Please try again.', 'error');
            } else {
                alert('Error processing your order. Please try again.');
            }

            // Reset button state
            confirmOrderBtn.disabled = false;
            confirmOrderBtn.textContent = 'Confirm Order';
        }
    }

    validateOrderInputs() {
        // Get selected delivery option
        const selectedDelivery = document.querySelector('input[name="delivery"]:checked');
        if (!selectedDelivery) {
            return false;
        }

        // Check location if home or express delivery
        if (selectedDelivery.value === 'home' || selectedDelivery.value === 'express') {
            const addressElement = document.querySelector('.selected-location .address');
            if (!addressElement || !addressElement.textContent.trim()) {
                return false;
            }
        }

        // Check store selection if store pickup
        if (selectedDelivery.value === 'store') {
            const storeSelect = document.getElementById('store-select');
            if (!storeSelect || !storeSelect.value) {
                return false;
            }
        }

        // Check payment method
        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        if (!selectedPayment) {
            return false;
        }

        // Validate card details if card payment
        if (selectedPayment.value === 'card') {
            const cardNumber = document.getElementById('card-number').value;
            const cardExpiry = document.getElementById('card-expiry').value;
            const cardCvv = document.getElementById('card-cvv').value;
            const cardName = document.getElementById('card-name').value;

            if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
                return false;
            }
        }

        // Validate PayPal details if PayPal
        if (selectedPayment.value === 'paypal') {
            const paypalEmail = document.getElementById('paypal-email').value;
            const paypalPhone = document.getElementById('paypal-phone').value;

            if (!paypalEmail || !paypalPhone) {
                return false;
            }
        }

        return true;
    }

    processCardPayment() {
        // Show processing message
        const message = document.createElement('div');
        message.className = 'payment-processing-message';
        message.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Processing payment...</p>
        `;
        document.querySelector('.panel-content').appendChild(message);

        // Simulate payment processing
        setTimeout(() => {
            // Remove processing message
            message.remove();

            // Show success message
            alert('Payment accepted! Thank you for your order.');

            // Clear cart and close panel
            this.clearCartAndClose();
        }, 2000);
    }

    processPayPalPayment() {
        const redirectMessage = document.querySelector('.paypal-redirect-message');
        redirectMessage.classList.remove('hidden');

        // Simulate PayPal redirect
        setTimeout(() => {
            alert('Redirecting to PayPal...');
            // In production, you would redirect to PayPal here
            this.clearCartAndClose();
        }, 2000);
    }

    clearCartAndClose() {
        // Clear cart
        localStorage.removeItem('cart');
        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }

        // Close panel
        this.closePanel();

        // Refresh cart display if on cart page
        if (typeof renderCartItems === 'function') {
            renderCartItems();
        }
    }
}

// Initialize the OrderPanel when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const orderPanel = new OrderPanel();

    // Make orderPanel globally accessible
    window.orderPanel = orderPanel;
});