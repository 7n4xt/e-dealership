document.addEventListener('DOMContentLoaded', function() {
    // Enhanced cart and wishlist functionality
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
    
    // Cart panel functionality with counter badge
    const cartBadge = document.createElement('span');
    cartBadge.className = 'item-counter';
    cartBadge.textContent = cartItems.length;
    cartIcon.parentNode.appendChild(cartBadge);
    
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        openSlidePanel('cart');
    });
    
    // Wishlist panel functionality with counter badge
    const wishlistBadge = document.createElement('span');
    wishlistBadge.className = 'item-counter';
    wishlistBadge.textContent = wishlistItems.length;
    wishlistIcon.parentNode.appendChild(wishlistBadge);
    
    wishlistIcon.addEventListener('click', function(e) {
        e.preventDefault();
        openSlidePanel('wishlist');
    });
    
    function openSlidePanel(type) {
        slidePanel.innerHTML = ''; // Clear panel content
        
        // Panel header with premium design
        const header = document.createElement('div');
        header.className = 'slide-panel-header';
        
        const title = document.createElement('h3');
        title.textContent = type === 'cart' ? 'Your Shopping Bag' : 'Your Wishlist';
        
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
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            
            const emptyIcon = document.createElement('div');
            emptyIcon.className = 'empty-icon';
            emptyIcon.innerHTML = type === 'cart' ? 
                '<svg width="40" height="40" viewBox="0 0 24 24"><path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>' : 
                '<svg width="40" height="40" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
            
            const emptyText = document.createElement('p');
            emptyText.textContent = type === 'cart' ? 
                'Your shopping bag is empty.' : 
                'Your wishlist is empty.';
            
            const browseLink = document.createElement('a');
            browseLink.href = '#vehicles-section';
            browseLink.textContent = 'Browse our collection';
            browseLink.className = 'browse-link';
            
            emptyMessage.appendChild(emptyIcon);
            emptyMessage.appendChild(emptyText);
            emptyMessage.appendChild(browseLink);
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
            
            // Item count and subtotal display for cart
            if (type === 'cart') {
                const subtotalRow = document.createElement('div');
                subtotalRow.className = 'subtotal-row';
                
                const itemCount = document.createElement('span');
                itemCount.className = 'item-count';
                itemCount.textContent = `${items.length} item${items.length > 1 ? 's' : ''}`;
                
                const subtotal = items.reduce((total, item) => total + item.total, 0);
                const subtotalAmount = document.createElement('span');
                subtotalAmount.className = 'subtotal-amount';
                subtotalAmount.textContent = `Subtotal: €${subtotal.toFixed(2)}`;
                
                subtotalRow.appendChild(itemCount);
                subtotalRow.appendChild(subtotalAmount);
                footer.appendChild(subtotalRow);
                
                // Order buttons
                const buttonRow = document.createElement('div');
                buttonRow.className = 'button-row';
                
                const continueBtn = document.createElement('button');
                continueBtn.className = 'continue-shopping-btn';
                continueBtn.textContent = 'Continue Shopping';
                continueBtn.addEventListener('click', closeSlidePanel);
                
                const orderBtn = document.createElement('button');
                orderBtn.className = 'place-order-btn';
                orderBtn.textContent = 'Proceed to Checkout';
                orderBtn.addEventListener('click', showCheckoutProcess);
                
                buttonRow.appendChild(continueBtn);
                buttonRow.appendChild(orderBtn);
                footer.appendChild(buttonRow);
            } else {
                // Wishlist actions
                const moveAllBtn = document.createElement('button');
                moveAllBtn.className = 'move-all-btn';
                moveAllBtn.textContent = 'Move All to Bag';
                moveAllBtn.addEventListener('click', moveAllToCart);
                
                footer.appendChild(moveAllBtn);
            }
            
            slidePanel.appendChild(footer);
        }
        
        // Show the panel with animation
        slidePanel.classList.add('open');
        document.body.classList.add('panel-open');
        
        // Add overlay with fade-in effect
        addOverlay();
    }
    
    function createItemElement(item, type) {
        const itemElement = document.createElement('div');
        itemElement.className = 'slide-panel-item';
        
        // Item image with hover zoom effect
        const imageContainer = document.createElement('div');
        imageContainer.className = 'item-image';
        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.name;
        imageContainer.appendChild(image);
        
        // Quick view button overlay
        const quickViewBtn = document.createElement('button');
        quickViewBtn.className = 'quick-view-btn';
        quickViewBtn.textContent = 'Quick View';
        quickViewBtn.addEventListener('click', () => showQuickView(item));
        imageContainer.appendChild(quickViewBtn);
        
        // Item details with enhanced styling
        const details = document.createElement('div');
        details.className = 'item-details';
        
        const itemName = document.createElement('h4');
        itemName.textContent = item.name;
        itemName.className = 'item-name';
        
        const itemType = document.createElement('p');
        itemType.className = 'item-type';
        itemType.textContent = item.type;
        
        const itemPrice = document.createElement('div');
        itemPrice.className = 'item-price';
        itemPrice.innerHTML = `€${item.price}<span>/day</span>`;
        
        const itemTotal = document.createElement('div');
        itemTotal.className = 'item-total';
        itemTotal.textContent = `€${item.total.toFixed(2)} total`;
        
        details.appendChild(itemName);
        details.appendChild(itemType);
        details.appendChild(itemPrice);
        details.appendChild(itemTotal);
        
        // Enhanced action buttons
        const actions = document.createElement('div');
        actions.className = 'item-actions';
        
        if (type === 'cart') {
            // Quantity selector
            const quantityControl = document.createElement('div');
            quantityControl.className = 'quantity-control';
            
            const minusBtn = document.createElement('button');
            minusBtn.className = 'quantity-btn minus';
            minusBtn.textContent = '-';
            minusBtn.addEventListener('click', () => updateQuantity(item.id, -1));
            
            const quantityDisplay = document.createElement('span');
            quantityDisplay.className = 'quantity-display';
            quantityDisplay.textContent = '1';
            
            const plusBtn = document.createElement('button');
            plusBtn.className = 'quantity-btn plus';
            plusBtn.textContent = '+';
            plusBtn.addEventListener('click', () => updateQuantity(item.id, 1));
            
            quantityControl.appendChild(minusBtn);
            quantityControl.appendChild(quantityDisplay);
            quantityControl.appendChild(plusBtn);
            actions.appendChild(quantityControl);
            
            // Save for later button (moves to wishlist)
            const saveBtn = document.createElement('button');
            saveBtn.className = 'save-for-later-btn';
            saveBtn.textContent = 'Save for Later';
            saveBtn.dataset.id = item.id;
            saveBtn.addEventListener('click', function() {
                moveToWishlist(item.id);
            });
            actions.appendChild(saveBtn);
            
            // Remove button
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '&times;';
            removeBtn.title = 'Remove';
            removeBtn.dataset.id = item.id;
            removeBtn.addEventListener('click', function() {
                removeFromCart(item.id);
            });
            actions.appendChild(removeBtn);
        } else if (type === 'wishlist') {
            const addToCartBtn = document.createElement('button');
            addToCartBtn.className = 'add-to-cart-btn';
            addToCartBtn.textContent = 'Add to Bag';
            addToCartBtn.dataset.id = item.id;
            addToCartBtn.addEventListener('click', function() {
                addToCartFromWishlist(item.id);
            });
            actions.appendChild(addToCartBtn);
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '&times;';
            removeBtn.title = 'Remove';
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
        updateCartCounter();
        openSlidePanel('cart'); // Refresh the panel
    }
    
    function removeFromWishlist(itemId) {
        wishlistItems = wishlistItems.filter(item => item.id !== itemId);
        updateWishlistCounter();
        openSlidePanel('wishlist'); // Refresh the panel
    }
    
    function addToCartFromWishlist(itemId) {
        const item = wishlistItems.find(item => item.id === itemId);
        if (item) {
            // Check if item already exists in cart
            const existingItem = cartItems.find(cartItem => cartItem.id === itemId);
            if (!existingItem) {
                cartItems.push(item);
            }
            
            // Show added to cart animation
            showAddedAnimation();
            
            removeFromWishlist(itemId);
            updateCartCounter();
            openSlidePanel('cart'); // Switch to cart panel
        }
    }
    
    function moveToWishlist(itemId) {
        const item = cartItems.find(item => item.id === itemId);
        if (item) {
            // Check if item already exists in wishlist
            const existingItem = wishlistItems.find(wishItem => wishItem.id === itemId);
            if (!existingItem) {
                wishlistItems.push(item);
            }
            
            removeFromCart(itemId);
            updateWishlistCounter();
            openSlidePanel('wishlist'); // Switch to wishlist panel
        }
    }
    
    function moveAllToCart() {
        if (wishlistItems.length === 0) return;
        
        // For each wishlist item, add to cart if not already there
        wishlistItems.forEach(item => {
            const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
            if (!existingItem) {
                cartItems.push(item);
            }
        });
        
        // Clear wishlist
        wishlistItems = [];
        
        // Show success toast notification
        showToast('All items moved to your shopping bag');
        
        // Update counters
        updateCartCounter();
        updateWishlistCounter();
        
        // Switch to cart panel
        openSlidePanel('cart');
    }
    
    function updateQuantity(itemId, change) {
        // In a real app, this would update the quantity and recalculate total
        // For this example, we'll just show a notification
        showToast('Quantity updated');
    }
    
    function updateCartCounter() {
        const cartBadge = document.querySelector('.cart .item-counter');
        if (cartBadge) {
            cartBadge.textContent = cartItems.length;
            
            // Hide badge if cart is empty
            if (cartItems.length === 0) {
                cartBadge.style.display = 'none';
            } else {
                cartBadge.style.display = 'flex';
            }
        }
    }
    
    function updateWishlistCounter() {
        const wishlistBadge = document.querySelector('.wishlist .item-counter');
        if (wishlistBadge) {
            wishlistBadge.textContent = wishlistItems.length;
            
            // Hide badge if wishlist is empty
            if (wishlistItems.length === 0) {
                wishlistBadge.style.display = 'none';
            } else {
                wishlistBadge.style.display = 'flex';
            }
        }
    }
    
    function showAddedAnimation() {
        // Create toast notification
        showToast('Item added to your shopping bag');
    }
    
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Show the toast with animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Remove the toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    function showQuickView(item) {
        // Create quick view modal
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        // Close button
        const closeModalBtn = document.createElement('button');
        closeModalBtn.className = 'close-modal';
        closeModalBtn.innerHTML = '&times;';
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
        
        // Left column for image gallery
        const imageGallery = document.createElement('div');
        imageGallery.className = 'image-gallery';
        
        const mainImage = document.createElement('div');
        mainImage.className = 'main-image';
        mainImage.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
        
        // Image thumbnails (would be populated with actual thumbnails in a real app)
        const thumbnails = document.createElement('div');
        thumbnails.className = 'thumbnails';
        for (let i = 0; i < 3; i++) {
            const thumb = document.createElement('div');
            thumb.className = 'thumbnail';
            thumb.innerHTML = `<img src="${item.image}" alt="View ${i+1}">`;
            thumbnails.appendChild(thumb);
        }
        
        imageGallery.appendChild(mainImage);
        imageGallery.appendChild(thumbnails);
        
        // Right column for product details
        const productDetails = document.createElement('div');
        productDetails.className = 'product-details';
        
        productDetails.innerHTML = `
            <h2 class="product-name">${item.name}</h2>
            <p class="product-type">${item.type}</p>
            <div class="product-price">€${item.price}<span>/day</span></div>
            <div class="product-total">€${item.total.toFixed(2)} total</div>
            <div class="product-description">
                <p>Experience luxury and performance with our premium ${item.type.toLowerCase()}. 
                Featuring cutting-edge technology, superior comfort, and exceptional driving dynamics.</p>
            </div>
            <div class="product-features">
                <h4>Key Features:</h4>
                <ul>
                    <li>Premium leather interior</li>
                    <li>Advanced navigation system</li>
                    <li>Automatic climate control</li>
                    <li>Sport-tuned suspension</li>
                </ul>
            </div>
            <div class="product-actions">
                <button class="add-to-cart-btn">Add to Bag</button>
                <button class="add-to-wishlist-btn">Add to Wishlist</button>
            </div>
        `;
        
        // Add action button listeners
        modalContent.appendChild(closeModalBtn);
        modalContent.appendChild(imageGallery);
        modalContent.appendChild(productDetails);
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Add event listeners for the action buttons
        const addToCartBtn = productDetails.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => {
            // Check if item is already in cart
            const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
            if (!existingItem) {
                cartItems.push(item);
                updateCartCounter();
                showAddedAnimation();
            }
            
            // Close modal
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
            
            // Open cart panel
            openSlidePanel('cart');
        });
        
        const addToWishlistBtn = productDetails.querySelector('.add-to-wishlist-btn');
        addToWishlistBtn.addEventListener('click', () => {
            // Check if item is already in wishlist
            const existingItem = wishlistItems.find(wishItem => wishItem.id === item.id);
            if (!existingItem) {
                wishlistItems.push(item);
                updateWishlistCounter();
                showToast('Item added to your wishlist');
            }
            
            // Close modal
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
    }
    
    // Enhanced checkout process with multi-step approach
    function showCheckoutProcess() {
        // Create multi-step checkout container
        const checkoutContainer = document.createElement('div');
        checkoutContainer.className = 'checkout-container';
        
        // Create steps indicator
        const stepsIndicator = document.createElement('div');
        stepsIndicator.className = 'checkout-steps';
        
        const steps = [
            { id: 'delivery', label: 'Delivery' },
            { id: 'payment', label: 'Payment' },
            { id: 'review', label: 'Review' }
        ];
        
        steps.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.className = 'step';
            stepElement.dataset.step = step.id;
            
            const stepNumber = document.createElement('div');
            stepNumber.className = 'step-number';
            stepNumber.textContent = index + 1;
            
            const stepLabel = document.createElement('div');
            stepLabel.className = 'step-label';
            stepLabel.textContent = step.label;
            
            stepElement.appendChild(stepNumber);
            stepElement.appendChild(stepLabel);
            stepsIndicator.appendChild(stepElement);
            
            // Add connector line between steps (except for the last step)
            if (index < steps.length - 1) {
                const connector = document.createElement('div');
                connector.className = 'step-connector';
                stepsIndicator.appendChild(connector);
            }
        });
        
        checkoutContainer.appendChild(stepsIndicator);
        
        // Create content area for steps
        const stepContent = document.createElement('div');
        stepContent.className = 'step-content';
        checkoutContainer.appendChild(stepContent);
        
        // Show the first step (delivery)
        showDeliveryStep(stepContent);
        
        // Set the first step as active
        const firstStep = stepsIndicator.querySelector('.step[data-step="delivery"]');
        firstStep.classList.add('active');
        
        // Clear panel content and set new content
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
        
        // Add header and checkout container to slide panel
        slidePanel.appendChild(header);
        slidePanel.appendChild(checkoutContainer);
        
        // Add navigation buttons
        const navButtons = document.createElement('div');
        navButtons.className = 'checkout-nav-buttons';
        
        const backBtn = document.createElement('button');
        backBtn.className = 'back-btn';
        backBtn.textContent = 'Back';
        backBtn.style.display = 'none'; // Hide initially
        backBtn.addEventListener('click', () => navigateCheckoutStep('prev'));
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'next-btn';
        nextBtn.textContent = 'Continue to Payment';
        nextBtn.addEventListener('click', () => navigateCheckoutStep('next'));
        
        navButtons.appendChild(backBtn);
        navButtons.appendChild(nextBtn);
        slidePanel.appendChild(navButtons);
        
        // Store the current step
        slidePanel.dataset.currentStep = 'delivery';
        slidePanel.dataset.currentStepIndex = '0';
    }
    
    function showDeliveryStep(container) {
        container.innerHTML = ''; // Clear container
        
        // Order summary section
        const orderSummary = createOrderSummary();
        container.appendChild(orderSummary);
        
        // Delivery section
        const deliverySection = document.createElement('div');
        deliverySection.className = 'delivery-section';
        
        const deliveryTitle = document.createElement('h4');
        deliveryTitle.textContent = 'Delivery Method';
        deliveryTitle.className = 'section-title';
        deliverySection.appendChild(deliveryTitle);
        
        // Create enhanced delivery options
        const deliveryOptions = [
            { 
                id: 'premium', 
                name: 'Premium Delivery', 
                description: 'White glove service with in-person handover',
                price: 150,
                time: '1-2 days',
                icon: '🏆'
            },
            { 
                id: 'standard', 
                name: 'Standard Delivery', 
                description: 'Professional delivery to your location',
                price: 50,
                time: '3-5 days',
                icon: '🚚'
            },
            { 
                id: 'pickup', 
                name: 'Dealership Pickup', 
                description: 'Visit our location for vehicle collection',
                price: 0,
                time: 'Same day',
                icon: '🏢'
            }
        ];
        
        deliveryOptions.forEach(option => {
            const optionCard = document.createElement('div');
            optionCard.className = 'delivery-option-card';
            optionCard.dataset.optionId = option.id;
            
            // Preselect premium option
            if (option.id === 'premium') {
                optionCard.classList.add('selected');
            }
            
            optionCard.innerHTML = `
                <div class="option-icon">${option.icon}</div>
                <div class="option-details">
                    <h5>${option.name}</h5>
                    <p>${option.description}</p>
                    <div class="option-meta">
                        <span class="option-time">${option.time}</span>
                        <span class="option-price">${option.price === 0 ? 'Free' : `€${option.price}`}</span>
                    </div>
                </div>
                <div class="option-radio">
                    <div class="radio-circle ${option.id === 'premium' ? 'selected' : ''}"></div>
                </div>
            `;
            
            // Add click event to select option
            optionCard.addEventListener('click', () => {
                // Remove selected class from all options
                document.querySelectorAll('.delivery-option-card').forEach(card => {
                    card.classList.remove('selected');
                    card.querySelector('.radio-circle').classList.remove('selected');
                });
                
                // Add selected class to clicked option
                optionCard.classList.add('selected');
                optionCard.querySelector('.radio-circle').classList.add('selected');
            });
            
            deliverySection.appendChild(optionCard);
        });
        
        container.appendChild(deliverySection);
        
        // Add location section
        const locationSection = document.createElement('div');
        locationSection.className = 'location-section';
        
        const locationTitle = document.createElement('h4');
        locationTitle.textContent = 'Delivery Address';
        locationTitle.className = 'section-title';
        locationSection.appendChild(locationTitle);
        
        // Address form
        const addressForm = document.createElement('div');
        addressForm.className = 'address-form';
        
        // Two-column layout for form
        // Two-column layout for form
        const formRow1 = document.createElement('div');
        formRow1.className = 'form-row';
        
        const nameInput = createFormField('text', 'fullName', 'Full Name', true);
        const emailInput = createFormField('email', 'email', 'Email Address', true);
        
        formRow1.appendChild(nameInput);
        formRow1.appendChild(emailInput);
        
        const formRow2 = document.createElement('div');
        formRow2.className = 'form-row';
        
        const phoneInput = createFormField('tel', 'phone', 'Phone Number', true);
        const addressInput = createFormField('text', 'address', 'Street Address', true);
        
        formRow2.appendChild(phoneInput);
        formRow2.appendChild(addressInput);
        
        const formRow3 = document.createElement('div');
        formRow3.className = 'form-row';
        
        const cityInput = createFormField('text', 'city', 'City', true);
        const zipInput = createFormField('text', 'zip', 'Postal/Zip Code', true);
        
        formRow3.appendChild(cityInput);
        formRow3.appendChild(zipInput);
        
        const formRow4 = document.createElement('div');
        formRow4.className = 'form-row';
        
        const countryInput = createFormField('text', 'country', 'Country', true);
        const stateInput = createFormField('text', 'state', 'State/Province', true);
        
        formRow4.appendChild(countryInput);
        formRow4.appendChild(stateInput);
        
        addressForm.appendChild(formRow1);
        addressForm.appendChild(formRow2);
        addressForm.appendChild(formRow3);
        addressForm.appendChild(formRow4);
        
        locationSection.appendChild(addressForm);
        container.appendChild(locationSection);
    }
    
    function createFormField(type, id, label, required) {
        const fieldWrapper = document.createElement('div');
        fieldWrapper.className = 'form-field';
        
        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', id);
        labelElement.textContent = label;
        if (required) {
            const requiredMark = document.createElement('span');
            requiredMark.className = 'required-mark';
            requiredMark.textContent = '*';
            labelElement.appendChild(requiredMark);
        }
        
        const inputElement = document.createElement('input');
        inputElement.type = type;
        inputElement.id = id;
        inputElement.name = id;
        inputElement.required = required;
        
        // Add validation visual cues
        inputElement.addEventListener('blur', function() {
            if (this.value.trim() === '' && required) {
                this.classList.add('invalid');
                
                // Check if error message already exists
                let errorMsg = fieldWrapper.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = `${label} is required`;
                    fieldWrapper.appendChild(errorMsg);
                }
            } else {
                this.classList.remove('invalid');
                
                // Remove error message if exists
                const errorMsg = fieldWrapper.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });
        
        fieldWrapper.appendChild(labelElement);
        fieldWrapper.appendChild(inputElement);
        
        return fieldWrapper;
    }
    
    function showPaymentStep(container) {
        container.innerHTML = ''; // Clear container
        
        // Order summary section
        const orderSummary = createOrderSummary();
        container.appendChild(orderSummary);
        
        // Payment method section
        const paymentSection = document.createElement('div');
        paymentSection.className = 'payment-section';
        
        const paymentTitle = document.createElement('h4');
        paymentTitle.textContent = 'Payment Method';
        paymentTitle.className = 'section-title';
        paymentSection.appendChild(paymentTitle);
        
        // Create payment options
        const paymentOptions = [
            { 
                id: 'credit-card', 
                name: 'Credit Card', 
                icon: '💳',
                selected: true
            },
            { 
                id: 'paypal', 
                name: 'PayPal', 
                icon: '🅿️'
            },
            { 
                id: 'bank-transfer', 
                name: 'Bank Transfer', 
                icon: '🏦'
            }
        ];
        
        const paymentSelector = document.createElement('div');
        paymentSelector.className = 'payment-selector';
        
        paymentOptions.forEach(option => {
            const paymentOption = document.createElement('div');
            paymentOption.className = `payment-option ${option.selected ? 'selected' : ''}`;
            paymentOption.dataset.paymentId = option.id;
            
            paymentOption.innerHTML = `
                <div class="payment-icon">${option.icon}</div>
                <div class="payment-name">${option.name}</div>
                <div class="option-radio">
                    <div class="radio-circle ${option.selected ? 'selected' : ''}"></div>
                </div>
            `;
            
            paymentOption.addEventListener('click', () => {
                // Remove selected class from all options
                document.querySelectorAll('.payment-option').forEach(opt => {
                    opt.classList.remove('selected');
                    opt.querySelector('.radio-circle').classList.remove('selected');
                });
                
                // Add selected class to clicked option
                paymentOption.classList.add('selected');
                paymentOption.querySelector('.radio-circle').classList.add('selected');
                
                // Show relevant payment form
                showPaymentForm(option.id);
            });
            
            paymentSelector.appendChild(paymentOption);
        });
        
        paymentSection.appendChild(paymentSelector);
        
        // Payment details container
        const paymentDetailsContainer = document.createElement('div');
        paymentDetailsContainer.className = 'payment-details-container';
        paymentSection.appendChild(paymentDetailsContainer);
        
        container.appendChild(paymentSection);
        
        // Show credit card form by default
        showPaymentForm('credit-card');
    }
    
    function showPaymentForm(paymentType) {
        const container = document.querySelector('.payment-details-container');
        if (!container) return;
        
        container.innerHTML = ''; // Clear container
        
        if (paymentType === 'credit-card') {
            const cardForm = document.createElement('div');
            cardForm.className = 'credit-card-form';
            
            // Card number row
            const cardNumberField = createFormField('text', 'cardNumber', 'Card Number', true);
            cardNumberField.className = 'card-number-field';
            
            // Add card icons
            const cardIcons = document.createElement('div');
            cardIcons.className = 'card-icons';
            cardIcons.innerHTML = `
                <span class="card-icon visa">Visa</span>
                <span class="card-icon mastercard">MC</span>
                <span class="card-icon amex">Amex</span>
            `;
            
            cardNumberField.appendChild(cardIcons);
            
            // Expiration and CVV row
            const expiryRow = document.createElement('div');
            expiryRow.className = 'form-row';
            
            const expiryField = createFormField('text', 'expiry', 'Expiration (MM/YY)', true);
            const cvvField = createFormField('text', 'cvv', 'Security Code', true);
            
            expiryRow.appendChild(expiryField);
            expiryRow.appendChild(cvvField);
            
            // Name on card
            const nameOnCardField = createFormField('text', 'nameOnCard', 'Name on Card', true);
            
            // Save card checkbox
            const saveCardRow = document.createElement('div');
            saveCardRow.className = 'save-card-row';
            
            const saveCardLabel = document.createElement('label');
            saveCardLabel.className = 'checkbox-label';
            
            const saveCardCheckbox = document.createElement('input');
            saveCardCheckbox.type = 'checkbox';
            saveCardCheckbox.id = 'saveCard';
            saveCardCheckbox.checked = true;
            
            const checkboxCustom = document.createElement('span');
            checkboxCustom.className = 'checkbox-custom';
            
            const saveCardText = document.createElement('span');
            saveCardText.textContent = 'Save card for future rentals';
            
            saveCardLabel.appendChild(saveCardCheckbox);
            saveCardLabel.appendChild(checkboxCustom);
            saveCardLabel.appendChild(saveCardText);
            saveCardRow.appendChild(saveCardLabel);
            
            // Assemble the form
            cardForm.appendChild(cardNumberField);
            cardForm.appendChild(expiryRow);
            cardForm.appendChild(nameOnCardField);
            cardForm.appendChild(saveCardRow);
            
            container.appendChild(cardForm);
        } else if (paymentType === 'paypal') {
            const paypalInfo = document.createElement('div');
            paypalInfo.className = 'payment-info-box';
            paypalInfo.innerHTML = `
                <p>You will be redirected to PayPal to complete your payment securely.</p>
                <div class="paypal-logo">PayPal</div>
            `;
            container.appendChild(paypalInfo);
        } else if (paymentType === 'bank-transfer') {
            const bankInfo = document.createElement('div');
            bankInfo.className = 'payment-info-box';
            bankInfo.innerHTML = `
                <p>Please transfer the total amount to the following bank account:</p>
                <div class="bank-details">
                    <p><strong>Bank:</strong> Euro Premium Bank</p>
                    <p><strong>Account Name:</strong> Premium Auto Rentals</p>
                    <p><strong>IBAN:</strong> DE89 3704 0044 0532 0130 00</p>
                    <p><strong>BIC:</strong> COBADEFFXXX</p>
                    <p><strong>Reference:</strong> ORDER-${Date.now().toString().substr(-6)}</p>
                </div>
                <p class="note">Your reservation will be confirmed once payment is received.</p>
            `;
            container.appendChild(bankInfo);
        }
    }
    
    function showReviewStep(container) {
        container.innerHTML = ''; // Clear container
        
        // Create order review
        const reviewSection = document.createElement('div');
        reviewSection.className = 'review-section';
        
        const reviewTitle = document.createElement('h4');
        reviewTitle.textContent = 'Order Review';
        reviewTitle.className = 'section-title';
        reviewSection.appendChild(reviewTitle);
        
        // Order summary
        const orderSummary = createOrderSummary(true); // true for detailed view
        reviewSection.appendChild(orderSummary);
        
        // Delivery summary
        const deliverySummary = document.createElement('div');
        deliverySummary.className = 'summary-box';
        
        const deliveryTitle = document.createElement('h5');
        deliveryTitle.textContent = 'Delivery Details';
        deliveryTitle.className = 'summary-title';
        
        const deliveryAddress = document.createElement('div');
        deliveryAddress.className = 'delivery-address';
        deliveryAddress.innerHTML = `
            <p>John Doe</p>
            <p>123 Main Street</p>
            <p>Munich, 80331</p>
            <p>Germany</p>
            <p>Phone: +49 123 456789</p>
        `;
        
        const deliveryMethod = document.createElement('div');
        deliveryMethod.className = 'delivery-method';
        deliveryMethod.innerHTML = `
            <p><strong>Method:</strong> Premium Delivery</p>
            <p><strong>Estimated Delivery:</strong> 1-2 days</p>
        `;
        
        const editDeliveryBtn = document.createElement('button');
        editDeliveryBtn.className = 'edit-button';
        editDeliveryBtn.textContent = 'Edit';
        editDeliveryBtn.addEventListener('click', () => {
            // Go back to delivery step
            navigateCheckoutStep('delivery');
        });
        
        deliverySummary.appendChild(deliveryTitle);
        deliverySummary.appendChild(deliveryAddress);
        deliverySummary.appendChild(deliveryMethod);
        deliverySummary.appendChild(editDeliveryBtn);
        
        // Payment summary
        const paymentSummary = document.createElement('div');
        paymentSummary.className = 'summary-box';
        
        const paymentTitle = document.createElement('h5');
        paymentTitle.textContent = 'Payment Details';
        paymentTitle.className = 'summary-title';
        
        const paymentMethod = document.createElement('div');
        paymentMethod.className = 'payment-method';
        paymentMethod.innerHTML = `
            <p><strong>Method:</strong> Credit Card</p>
            <p><strong>Card:</strong> Visa ending in 1234</p>
        `;
        
        const editPaymentBtn = document.createElement('button');
        editPaymentBtn.className = 'edit-button';
        editPaymentBtn.textContent = 'Edit';
        editPaymentBtn.addEventListener('click', () => {
            // Go back to payment step
            navigateCheckoutStep('payment');
        });
        
        paymentSummary.appendChild(paymentTitle);
        paymentSummary.appendChild(paymentMethod);
        paymentSummary.appendChild(editPaymentBtn);
        
        // Terms and conditions
        const termsSection = document.createElement('div');
        termsSection.className = 'terms-section';
        
        const termsCheckbox = document.createElement('label');
        termsCheckbox.className = 'checkbox-label';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'termsAgreed';
        
        const checkboxCustom = document.createElement('span');
        checkboxCustom.className = 'checkbox-custom';
        
        const termsText = document.createElement('span');
        termsText.innerHTML = 'I agree to the <a href="#" class="terms-link">Terms and Conditions</a> and <a href="#" class="privacy-link">Privacy Policy</a>';
        
        termsCheckbox.appendChild(checkbox);
        termsCheckbox.appendChild(checkboxCustom);
        termsCheckbox.appendChild(termsText);
        
        termsSection.appendChild(termsCheckbox);
        
        // Add all sections to container
        reviewSection.appendChild(deliverySummary);
        reviewSection.appendChild(paymentSummary);
        reviewSection.appendChild(termsSection);
        container.appendChild(reviewSection);
    }
    
    function createOrderSummary(detailed = false) {
        const orderSummary = document.createElement('div');
        orderSummary.className = 'order-summary';
        
        const summaryTitle = document.createElement('h4');
        summaryTitle.textContent = 'Order Summary';
        summaryTitle.className = 'section-title';
        orderSummary.appendChild(summaryTitle);
        
        // Items list
        if (detailed) {
            const itemsList = document.createElement('div');
            itemsList.className = 'summary-items';
            
            cartItems.forEach(item => {
                const itemRow = document.createElement('div');
                itemRow.className = 'summary-item-row';
                
                itemRow.innerHTML = `
                    <div class="summary-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="summary-item-details">
                        <h5>${item.name}</h5>
                        <p>${item.type}</p>
                    </div>
                    <div class="summary-item-price">
                        €${item.price}/day
                    </div>
                `;
                
                itemsList.appendChild(itemRow);
            });
            
            orderSummary.appendChild(itemsList);
        } else {
            // Simple item count
            const itemCount = document.createElement('div');
            itemCount.className = 'item-count';
            itemCount.textContent = `${cartItems.length} vehicle${cartItems.length > 1 ? 's' : ''}`;
            orderSummary.appendChild(itemCount);
        }
        
        // Cost breakdown
        const costBreakdown = document.createElement('div');
        costBreakdown.className = 'cost-breakdown';
        
        // Calculate totals (in a real app, these would be properly calculated)
        const subtotal = cartItems.reduce((total, item) => total + item.total, 0);
        const deliveryFee = 150; // Premium delivery
        const tax = subtotal * 0.19; // 19% VAT
        const total = subtotal + deliveryFee + tax;
        
        costBreakdown.innerHTML = `
            <div class="cost-row">
                <span>Subtotal</span>
                <span>€${subtotal.toFixed(2)}</span>
            </div>
            <div class="cost-row">
                <span>Delivery Fee</span>
                <span>€${deliveryFee.toFixed(2)}</span>
            </div>
            <div class="cost-row">
                <span>Tax (19% VAT)</span>
                <span>€${tax.toFixed(2)}</span>
            </div>
            <div class="cost-row total">
                <span>Total</span>
                <span>€${total.toFixed(2)}</span>
            </div>
        `;
        
        orderSummary.appendChild(costBreakdown);
        
        return orderSummary;
    }
    
    function navigateCheckoutStep(direction) {
        const steps = ['delivery', 'payment', 'review'];
        const currentStep = slidePanel.dataset.currentStep;
        const currentIndex = parseInt(slidePanel.dataset.currentStepIndex);
        
        let newIndex;
        if (direction === 'next') {
            newIndex = currentIndex + 1;
        } else if (direction === 'prev') {
            newIndex = currentIndex - 1;
        } else {
            // If a specific step is requested
            newIndex = steps.indexOf(direction);
        }
        
        // Ensure index is within bounds
        if (newIndex < 0) newIndex = 0;
        if (newIndex >= steps.length) newIndex = steps.length - 1;
        
        const newStep = steps[newIndex];
        
        // Update indicators
        document.querySelectorAll('.checkout-steps .step').forEach((step, index) => {
            if (index === newIndex) {
                step.classList.add('active');
            } else if (index < newIndex) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
        
        // Update content
        const stepContent = document.querySelector('.step-content');
        if (newStep === 'delivery') {
            showDeliveryStep(stepContent);
        } else if (newStep === 'payment') {
            showPaymentStep(stepContent);
        } else if (newStep === 'review') {
            showReviewStep(stepContent);
        }
        
        // Update buttons
        const backBtn = document.querySelector('.back-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (newIndex === 0) {
            backBtn.style.display = 'none';
        } else {
            backBtn.style.display = 'block';
        }
        
        if (newIndex === steps.length - 1) {
            nextBtn.textContent = 'Place Order';
            nextBtn.addEventListener('click', placeOrder);
        } else if (newIndex === 0) {
            nextBtn.textContent = 'Continue to Payment';
            // Remove previous event listener
            nextBtn.replaceWith(nextBtn.cloneNode(true));
            document.querySelector('.next-btn').addEventListener('click', () => navigateCheckoutStep('next'));
        } else {
            nextBtn.textContent = 'Continue to Review';
            // Remove previous event listener
            nextBtn.replaceWith(nextBtn.cloneNode(true));
            document.querySelector('.next-btn').addEventListener('click', () => navigateCheckoutStep('next'));
        }
        
        // Update current step data
        slidePanel.dataset.currentStep = newStep;
        slidePanel.dataset.currentStepIndex = newIndex;
    }
    
    function placeOrder() {
        // Check if terms are checked
        const termsCheckbox = document.getElementById('termsAgreed');
        if (!termsCheckbox || !termsCheckbox.checked) {
            showToast('Please agree to the Terms and Conditions');
            return;
        }
        
        // Replace checkout content with order confirmation
        const slidePanel = document.querySelector('.slide-panel');
        slidePanel.innerHTML = '';
        
        // Create confirmation header
        const header = document.createElement('div');
        header.className = 'slide-panel-header';
        
        const title = document.createElement('h3');
        title.textContent = 'Order Confirmation';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-panel';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', closeSlidePanel);
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        slidePanel.appendChild(header);
        
        // Create confirmation content
        const confirmationContent = document.createElement('div');
        confirmationContent.className = 'confirmation-content';
        
        // Success animation
        const successAnimation = document.createElement('div');
        successAnimation.className = 'success-animation';
        successAnimation.innerHTML = `
            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
        `;
        
        // Order details
        const orderDetails = document.createElement('div');
        orderDetails.className = 'order-details';
        
        const confirmationTitle = document.createElement('h4');
        confirmationTitle.className = 'confirmation-title';
        confirmationTitle.textContent = 'Thank You for Your Order!';
        
        const orderNumber = document.createElement('div');
        orderNumber.className = 'order-number';
        orderNumber.innerHTML = `
            <p>Order Number: <strong>#${Date.now().toString().substr(-6)}</strong></p>
            <p>A confirmation email has been sent to your email address.</p>
        `;
        
        const deliveryInfo = document.createElement('div');
        deliveryInfo.className = 'delivery-info';
        deliveryInfo.innerHTML = `
            <h5>Delivery Information</h5>
            <p>Your vehicle will be delivered within 1-2 days.</p>
            <p>You will receive a call from our delivery team before arrival.</p>
        `;
        
        const continueButton = document.createElement('button');
        continueButton.className = 'continue-shopping-btn';
        continueButton.textContent = 'Continue Shopping';
        continueButton.addEventListener('click', () => {
            // Clear cart and close panel
            cartItems = [];
            updateCartCounter();
            closeSlidePanel();
            
            // Scroll to vehicles section
            const vehiclesSection = document.getElementById('vehicles-section');
            if (vehiclesSection) {
                vehiclesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        // Assemble confirmation content
        orderDetails.appendChild(confirmationTitle);
        orderDetails.appendChild(orderNumber);
        orderDetails.appendChild(deliveryInfo);
        orderDetails.appendChild(continueButton);
        
        confirmationContent.appendChild(successAnimation);
        confirmationContent.appendChild(orderDetails);
        
        slidePanel.appendChild(confirmationContent);
    }
});