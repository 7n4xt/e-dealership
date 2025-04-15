// First, let's add this code to your cart.js file
document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    const cartIcon = document.querySelector('.cart img');
    const wishlistIcon = document.querySelector('.wishlist img');
    
    // Sample cart and wishlist data (in a real app, this would come from localStorage or a database)
    let cartItems = [
        {
            id: 1,
            name: "BMW M440",
            type: "Coupe",
            price: 159,
            total: 1127.84,
            image: "./assets/images/bmw-m440.jpg"
        }
    ];
    
    let wishlistItems = [
        {
            id: 2,
            name: "BMW X3",
            type: "SUV",
            price: 70,
            total: 1002.29,
            image: "./assets/images/bmw-x3.jpg"
        }
    ];
    
    // Create slide panel container if it doesn't exist
    let slidePanel = document.querySelector('.slide-panel');
    if (!slidePanel) {
        slidePanel = document.createElement('div');
        slidePanel.className = 'slide-panel';
        document.body.appendChild(slidePanel);
    }
    
    // Cart panel functionality
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        openSlidePanel('cart');
    });
    
    // Wishlist panel functionality
    wishlistIcon.addEventListener('click', function(e) {
        e.preventDefault();
        openSlidePanel('wishlist');
    });
    
    function openSlidePanel(type) {
        slidePanel.innerHTML = ''; // Clear panel content
        
        // Panel header
        const header = document.createElement('div');
        header.className = 'slide-panel-header';
        
        const title = document.createElement('h3');
        title.textContent = type === 'cart' ? 'Your Cart' : 'Your Wishlist';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-panel';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', closeSlidePanel);
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        slidePanel.appendChild(header);
        
        // Panel content
        const content = document.createElement('div');
        content.className = 'slide-panel-content';
        
        const items = type === 'cart' ? cartItems : wishlistItems;
        
        if (items.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = type === 'cart' 
                ? 'Your cart is empty.' 
                : 'Your wishlist is empty.';
            content.appendChild(emptyMessage);
        } else {
            items.forEach(item => {
                const itemElement = createItemElement(item, type);
                content.appendChild(itemElement);
            });
        }
        
        slidePanel.appendChild(content);
        
        // Panel footer with action button
        if (items.length > 0) {
            const footer = document.createElement('div');
            footer.className = 'slide-panel-footer';
            
            if (type === 'cart') {
                const orderBtn = document.createElement('button');
                orderBtn.className = 'place-order-btn';
                orderBtn.textContent = 'Place Order';
                orderBtn.addEventListener('click', showCheckoutProcess);
                footer.appendChild(orderBtn);
            }
            
            slidePanel.appendChild(footer);
        }
        
        // Show the panel
        slidePanel.classList.add('open');
        document.body.classList.add('panel-open');
        
        // Add overlay
        addOverlay();
    }
    
    function createItemElement(item, type) {
        const itemElement = document.createElement('div');
        itemElement.className = 'slide-panel-item';
        
        // Item image
        const imageContainer = document.createElement('div');
        imageContainer.className = 'item-image';
        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.name;
        imageContainer.appendChild(image);
        
        // Item details
        const details = document.createElement('div');
        details.className = 'item-details';
        
        const itemName = document.createElement('h4');
        itemName.textContent = item.name;
        
        const itemType = document.createElement('p');
        itemType.className = 'item-type';
        itemType.textContent = item.type;
        
        const itemPrice = document.createElement('div');
        itemPrice.className = 'item-price';
        itemPrice.innerHTML = `€${item.price}<span>/day</span>`;
        
        const itemTotal = document.createElement('div');
        itemTotal.className = 'item-total';
        itemTotal.textContent = `€${item.total} total`;
        
        details.appendChild(itemName);
        details.appendChild(itemType);
        details.appendChild(itemPrice);
        details.appendChild(itemTotal);
        
        // Action buttons
        const actions = document.createElement('div');
        actions.className = 'item-actions';
        
        if (type === 'cart') {
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = 'Remove';
            removeBtn.dataset.id = item.id;
            removeBtn.addEventListener('click', function() {
                removeFromCart(item.id);
            });
            actions.appendChild(removeBtn);
        } else if (type === 'wishlist') {
            const addToCartBtn = document.createElement('button');
            addToCartBtn.className = 'add-to-cart-btn';
            addToCartBtn.textContent = 'Add to Cart';
            addToCartBtn.dataset.id = item.id;
            addToCartBtn.addEventListener('click', function() {
                addToCartFromWishlist(item.id);
            });
            actions.appendChild(addToCartBtn);
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = 'Remove';
            removeBtn.dataset.id = item.id;
            removeBtn.addEventListener('click', function() {
                removeFromWishlist(item.id);
            });
            actions.appendChild(removeBtn);
        }
        
        // Combine all elements
        itemElement.appendChild(imageContainer);
        itemElement.appendChild(details);
        itemElement.appendChild(actions);
        
        return itemElement;
    }
    
    function addOverlay() {
        let overlay = document.querySelector('.slide-panel-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'slide-panel-overlay';
            overlay.addEventListener('click', closeSlidePanel);
            document.body.appendChild(overlay);
        }
        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);
    }
    
    function closeSlidePanel() {
        const slidePanel = document.querySelector('.slide-panel');
        const overlay = document.querySelector('.slide-panel-overlay');
        
        slidePanel.classList.remove('open');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
        
        document.body.classList.remove('panel-open');
    }
    
    function removeFromCart(itemId) {
        cartItems = cartItems.filter(item => item.id !== itemId);
        openSlidePanel('cart'); // Refresh the panel
    }
    
    function removeFromWishlist(itemId) {
        wishlistItems = wishlistItems.filter(item => item.id !== itemId);
        openSlidePanel('wishlist'); // Refresh the panel
    }
    
    function addToCartFromWishlist(itemId) {
        const item = wishlistItems.find(item => item.id === itemId);
        if (item) {
            cartItems.push(item);
            removeFromWishlist(itemId);
            openSlidePanel('cart'); // Switch to cart panel
        }
    }
    
    function showCheckoutProcess() {
        // Clear panel content to replace with checkout process
        slidePanel.innerHTML = '';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'slide-panel-header';
        
        const title = document.createElement('h3');
        title.textContent = 'Checkout';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-panel';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', closeSlidePanel);
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        slidePanel.appendChild(header);
        
        // Create checkout content
        const checkoutContent = document.createElement('div');
        checkoutContent.className = 'checkout-content';
        
        // Order summary section
        const orderSummary = document.createElement('div');
        orderSummary.className = 'order-summary';
        
        const summaryTitle = document.createElement('h4');
        summaryTitle.textContent = 'Order Summary';
        orderSummary.appendChild(summaryTitle);
        
        const itemsList = document.createElement('div');
        itemsList.className = 'items-list';
        
        // Calculate total
        let totalAmount = 0;
        
        cartItems.forEach(item => {
            const itemRow = document.createElement('div');
            itemRow.className = 'summary-item';
            
            const itemName = document.createElement('span');
            itemName.className = 'item-name';
            itemName.textContent = `${item.name} (${item.type})`;
            
            const itemPrice = document.createElement('span');
            itemPrice.className = 'item-price';
            itemPrice.textContent = `€${item.total}`;
            
            totalAmount += item.total;
            
            itemRow.appendChild(itemName);
            itemRow.appendChild(itemPrice);
            itemsList.appendChild(itemRow);
        });
        
        const totalRow = document.createElement('div');
        totalRow.className = 'summary-total';
        
        const totalLabel = document.createElement('span');
        totalLabel.textContent = 'Total';
        
        const totalValue = document.createElement('span');
        totalValue.className = 'total-value';
        totalValue.textContent = `€${totalAmount.toFixed(2)}`;
        
        totalRow.appendChild(totalLabel);
        totalRow.appendChild(totalValue);
        
        orderSummary.appendChild(itemsList);
        orderSummary.appendChild(totalRow);
        checkoutContent.appendChild(orderSummary);
        
        // Location section
        const locationSection = document.createElement('div');
        locationSection.className = 'location-section';
        
        const locationTitle = document.createElement('h4');
        locationTitle.textContent = 'Your Location';
        locationSection.appendChild(locationTitle);
        
        const locationDisplay = document.createElement('div');
        locationDisplay.className = 'location-display';
        locationDisplay.innerHTML = '<p>Detecting your location...</p>';
        locationSection.appendChild(locationDisplay);
        
        // Create map container
        const mapContainer = document.createElement('div');
        mapContainer.id = 'map';
        mapContainer.className = 'map-container';
        mapContainer.style.height = '180px';
        mapContainer.style.borderRadius = '8px';
        mapContainer.style.marginTop = '10px';
        locationSection.appendChild(mapContainer);
        
        checkoutContent.appendChild(locationSection);
        
        // Delivery options section
        const deliverySection = document.createElement('div');
        deliverySection.className = 'delivery-section';
        
        const deliveryTitle = document.createElement('h4');
        deliveryTitle.textContent = 'Delivery Method';
        deliverySection.appendChild(deliveryTitle);
        
        const deliveryOptions = [
            { id: 'pickup', name: 'Dealership Pickup', price: 0 },
            { id: 'standard', name: 'Standard Delivery (3-5 days)', price: 50 },
            { id: 'express', name: 'Express Delivery (1-2 days)', price: 100 }
        ];
        
        deliveryOptions.forEach(option => {
            const optionRow = document.createElement('div');
            optionRow.className = 'delivery-option';
            
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = 'delivery';
            radioInput.id = option.id;
            radioInput.value = option.id;
            if (option.id === 'standard') radioInput.checked = true;
            
            const label = document.createElement('label');
            label.htmlFor = option.id;
            label.textContent = option.name;
            
            const price = document.createElement('span');
            price.className = 'option-price';
            price.textContent = option.price === 0 ? 'Free' : `€${option.price}`;
            
            optionRow.appendChild(radioInput);
            optionRow.appendChild(label);
            optionRow.appendChild(price);
            deliverySection.appendChild(optionRow);
        });
        
        checkoutContent.appendChild(deliverySection);
        
        // Payment method section
        const paymentSection = document.createElement('div');
        paymentSection.className = 'payment-section';
        
        const paymentTitle = document.createElement('h4');
        paymentTitle.textContent = 'Payment Method';
        paymentSection.appendChild(paymentTitle);
        
        // Create payment options
        const paymentMethods = [
            { id: 'credit-card', name: 'Credit Card' },
            { id: 'paypal', name: 'PayPal' },
            { id: 'bank-transfer', name: 'Bank Transfer' }
        ];
        
        paymentMethods.forEach(method => {
            const methodRow = document.createElement('div');
            methodRow.className = 'payment-method';
            
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = 'payment';
            radioInput.id = method.id;
            radioInput.value = method.id;
            if (method.id === 'credit-card') radioInput.checked = true;
            
            const label = document.createElement('label');
            label.htmlFor = method.id;
            label.textContent = method.name;
            
            methodRow.appendChild(radioInput);
            methodRow.appendChild(label);
            paymentSection.appendChild(methodRow);
        });
        
        // Credit card form (initially visible, would be toggled based on selection in a full implementation)
        const creditCardForm = document.createElement('div');
        creditCardForm.className = 'credit-card-form';
        
        const cardNumberField = createFormField('card-number', 'Card Number', 'text', 'xxxx xxxx xxxx xxxx');
        const cardHolderField = createFormField('card-holder', 'Card Holder Name', 'text', 'Full Name');
        
        const cardRowFlex = document.createElement('div');
        cardRowFlex.className = 'card-row-flex';
        cardRowFlex.style.display = 'flex';
        cardRowFlex.style.gap = '10px';
        
        const expiryField = createFormField('expiry', 'Expiry (MM/YY)', 'text', 'MM/YY');
        expiryField.style.flex = '1';
        const cvvField = createFormField('cvv', 'CVV', 'text', '123');
        cvvField.style.flex = '1';
        
        cardRowFlex.appendChild(expiryField);
        cardRowFlex.appendChild(cvvField);
        
        creditCardForm.appendChild(cardNumberField);
        creditCardForm.appendChild(cardHolderField);
        creditCardForm.appendChild(cardRowFlex);
        
        paymentSection.appendChild(creditCardForm);
        checkoutContent.appendChild(paymentSection);
        
        // Add checkout content to slide panel
        slidePanel.appendChild(checkoutContent);
        
        // Footer with place order button
        const footer = document.createElement('div');
        footer.className = 'slide-panel-footer';
        
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'place-order-btn';
        confirmBtn.textContent = 'Confirm Order';
        confirmBtn.addEventListener('click', placeOrder);
        
        footer.appendChild(confirmBtn);
        slidePanel.appendChild(footer);
        
        // Get real-time location and initialize map
        loadGoogleMapsAPI().then(() => {
            getUserLocation(locationDisplay, mapContainer);
        }).catch(error => {
            console.error("Error loading Google Maps API:", error);
            locationDisplay.innerHTML = `
                <p>Unable to load maps. Please enter your address manually:</p>
                <textarea placeholder="Enter your full address" rows="3" style="width: 100%; margin-top: 8px;"></textarea>
            `;
        });
    }
    
    function loadGoogleMapsAPI() {
        return new Promise((resolve, reject) => {
            // Check if Google Maps API is already loaded
            if (window.google && window.google.maps) {
                resolve();
                return;
            }
            
            // Your Google Maps API Key - replace with your actual API key
            const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
            
            // Create script element to load Google Maps API
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            
            script.onload = resolve;
            script.onerror = () => reject(new Error('Google Maps failed to load'));
            
            document.head.appendChild(script);
        });
    }
    
    function createFormField(id, label, type, placeholder) {
        const fieldContainer = document.createElement('div');
        fieldContainer.className = 'form-field';
        
        const labelElement = document.createElement('label');
        labelElement.htmlFor = id;
        labelElement.textContent = label;
        
        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.name = id;
        input.placeholder = placeholder;
        
        fieldContainer.appendChild(labelElement);
        fieldContainer.appendChild(input);
        
        return fieldContainer;
    }
    
    function getUserLocation(locationDisplay, mapContainer) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    
                    // Display coordinates
                    locationDisplay.innerHTML = `
                        <p><strong>Current location detected:</strong></p>
                        <p>Latitude: ${latitude.toFixed(6)}</p>
                        <p>Longitude: ${longitude.toFixed(6)}</p>
                    `;
                    
                    // Initialize Google Map
                    initMap(latitude, longitude, mapContainer.id);
                    
                    // Get address using reverse geocoding
                    reverseGeocode(latitude, longitude, locationDisplay);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    locationDisplay.innerHTML = `
                        <p>Unable to get your location. Error: ${error.message}</p>
                        <p>Please enter your address manually:</p>
                        <textarea placeholder="Enter your full address" rows="3" style="width: 100%; margin-top: 8px;"></textarea>
                    `;
                }
            );
        } else {
            locationDisplay.innerHTML = `
                <p>Geolocation is not supported by this browser.</p>
                <p>Please enter your address manually:</p>
                <textarea placeholder="Enter your full address" rows="3" style="width: 100%; margin-top: 8px;"></textarea>
            `;
        }
    }
    
    function initMap(latitude, longitude, mapContainerId) {
        // Create a map centered at user's location
        const map = new google.maps.Map(document.getElementById(mapContainerId), {
            center: { lat: latitude, lng: longitude },
            zoom: 14,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
        });
        
        // Add a marker at user's location
        const marker = new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: map,
            title: 'Your Location',
            animation: google.maps.Animation.DROP
        });
        
        // Add a circle to show accuracy/delivery area
        const circle = new google.maps.Circle({
            map: map,
            center: { lat: latitude, lng: longitude },
            radius: 800, // 800 meters radius
            strokeColor: '#2196F3',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#2196F3',
            fillOpacity: 0.2
        });
    }
    
    function reverseGeocode(latitude, longitude, locationDisplay) {
        const geocoder = new google.maps.Geocoder();
        const latlng = { lat: latitude, lng: longitude };
        
        geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    // Get the formatted address
                    const address = results[0].formatted_address;
                    
                    // Update the display with the address
                    locationDisplay.innerHTML = `
                        <p><strong>Delivery address:</strong></p>
                        <p>${address}</p>
                        <p class="coordinates">Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}</p>
                        <button class="edit-address-btn">Edit Address</button>
                    `;
                    
                    // Add event listener to the edit address button
                    const editBtn = locationDisplay.querySelector('.edit-address-btn');
                    editBtn.addEventListener('click', () => {
                        locationDisplay.innerHTML = `
                            <p><strong>Edit Delivery Address:</strong></p>
                            <textarea class="address-input" rows="3" style="width: 100%;">${address}</textarea>
                            <button class="save-address-btn">Save Address</button>
                        `;
                        
                        // Add event listener to the save button
                        const saveBtn = locationDisplay.querySelector('.save-address-btn');
                        saveBtn.addEventListener('click', () => {
                            const newAddress = locationDisplay.querySelector('.address-input').value;
                            locationDisplay.innerHTML = `
                                <p><strong>Delivery address:</strong></p>
                                <p>${newAddress}</p>
                                <button class="edit-address-btn">Edit Address</button>
                            `;
                            
                            // Re-add the event listener to the new edit button
                            const newEditBtn = locationDisplay.querySelector('.edit-address-btn');
                            newEditBtn.addEventListener('click', () => {
                                locationDisplay.innerHTML = `
                                    <p><strong>Edit Delivery Address:</strong></p>
                                    <textarea class="address-input" rows="3" style="width: 100%;">${newAddress}</textarea>
                                    <button class="save-address-btn">Save Address</button>
                                `;
                            });
                        });
                    });
                } else {
                    console.error('No results found for geocoding');
                }
            } else {
                console.error('Geocoder failed due to: ' + status);
            }
        });
    }
    
    function placeOrder() {
        // Get selected payment method
        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        const paymentMethod = selectedPayment ? selectedPayment.value : null;
        
        // Get selected delivery method
        const selectedDelivery = document.querySelector('input[name="delivery"]:checked');
        const deliveryMethod = selectedDelivery ? selectedDelivery.value : null;
        
        // Get delivery address
        const addressElement = document.querySelector('.location-display p:nth-child(2)');
        const deliveryAddress = addressElement ? addressElement.textContent : 'Address not specified';
        
        // In a real app, you would validate all fields here and process the payment
        
        // Show confirmation message
        slidePanel.innerHTML = '';
        
        const confirmationContent = document.createElement('div');
        confirmationContent.className = 'confirmation-content';
        
        const header = document.createElement('div');
        header.className = 'slide-panel-header';
        
        const title = document.createElement('h3');
        title.textContent = 'Order Confirmed';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-panel';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', closeSlidePanel);
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        const messageContent = document.createElement('div');
        messageContent.className = 'confirmation-message';
        messageContent.innerHTML = `
            <div class="success-icon">✓</div>
            <h4>Thank you for your order!</h4>
            <p>Your order has been successfully placed.</p>
            <p><strong>Delivery Address:</strong><br>${deliveryAddress}</p>
            <p><strong>Payment Method:</strong><br>${formatPaymentMethod(paymentMethod)}</p>
            <p><strong>Delivery Method:</strong><br>${formatDeliveryMethod(deliveryMethod)}</p>
            <p>An email confirmation has been sent to your inbox.</p>
        `;
        
        confirmationContent.appendChild(header);
        confirmationContent.appendChild(messageContent);
        
        const footer = document.createElement('div');
        footer.className = 'slide-panel-footer';
        
        const doneBtn = document.createElement('button');
        doneBtn.className = 'done-btn';
        doneBtn.textContent = 'Done';
        doneBtn.addEventListener('click', function() {
            cartItems = []; // Clear cart
            closeSlidePanel();
        });
        
        footer.appendChild(doneBtn);
        
        confirmationContent.appendChild(footer);
        slidePanel.appendChild(confirmationContent);
        
        // Add some basic styles to the confirmation message
        const style = document.createElement('style');
        style.textContent = `
            .confirmation-message {
                text-align: center;
                padding: 20px;
            }
            .success-icon {
                background-color: #4CAF50;
                color: white;
                font-size: 24px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
            }
            .done-btn {
                background-color: #4CAF50;
            }
        `;
        document.head.appendChild(style);
    }
    
    function formatPaymentMethod(method) {
        switch(method) {
            case 'credit-card': return 'Credit Card';
            case 'paypal': return 'PayPal';
            case 'bank-transfer': return 'Bank Transfer';
            default: return 'Not specified';
        }
    }
    
    function formatDeliveryMethod(method) {
        switch(method) {
            case 'pickup': return 'Dealership Pickup';
            case 'standard': return 'Standard Delivery (3-5 days)';
            case 'express': return 'Express Delivery (1-2 days)';
            default: return 'Not specified';
        }
    }
});