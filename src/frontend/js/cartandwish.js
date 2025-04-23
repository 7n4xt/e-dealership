// cart.js

// Cart state management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let orderPanel;

// Make certain functions globally accessible
window.addToCart = function (product) {
    // Check if product is already in cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex > -1) {
        // Update quantity if product exists
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        // Add new product
        cart.push(product);
    }

    // Save to localStorage
    saveCart();

    // Update cart UI
    renderCartItems();
    updateCartCount();
};

window.openCart = openCart;
window.showNotification = showNotification;
window.isInWishlist = isInWishlist;
window.toggleWishlist = toggleWishlist;

// DOM elements
document.addEventListener('DOMContentLoaded', function () {
    // Initialize cart panel elements
    setupCartPanel();

    // Initialize cart trigger button
    setupCartTrigger();

    // Initialize add to cart buttons
    setupAddToCartButtons();

    // Initialize wishlist buttons
    setupWishlistButtons();

    // Update cart counter
    updateCartCount();

    // If we're on the wishlist page, render wishlist items
    if (document.querySelector('.wishlist-section')) {
        renderWishlistItems();
    }

    // Initialize order panel
    orderPanel = {
        panel: document.querySelector('.order-slide-panel'),
        openPanel() {
            this.panel.classList.add('active');
            document.body.style.overflow = 'hidden';
        },
        closePanel() {
            this.panel.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Add event listener for close panel button
    const closePanelBtn = document.querySelector('.close-panel');
    if (closePanelBtn) {
        closePanelBtn.addEventListener('click', () => orderPanel.closePanel());
    }
});

// Setup cart panel
function setupCartPanel() {
    // Create cart panel if it doesn't exist
    if (!document.querySelector('.cart-panel')) {
        const cartPanel = document.createElement('div');
        cartPanel.className = 'cart-panel';
        cartPanel.innerHTML = `
            <div class="cart-header">
                <h3 class="cart-title">Your Cart</h3>
                <button class="close-cart">
                    <img src="./assets/icons/exit.png" alt="Close">
                </button>
            </div>
            <div class="cart-items">
                <!-- Cart items will be rendered here -->
            </div>
            <div class="cart-summary">
                <div class="cart-totals">
                    <div class="cart-total-line">
                        <span>Subtotal</span>
                        <span class="subtotal">€0</span>
                    </div>
                    <div class="cart-total-line">
                        <span>Tax</span>
                        <span class="tax">€0</span>
                    </div>
                    <div class="cart-total-line total">
                        <span>Total</span>
                        <span class="total-amount">€0</span>
                    </div>
                </div>
                <button class="checkout-btn">Proceed to Checkout</button>
                <button class="continue-shopping">Continue Shopping</button>
            </div>
        `;
        document.body.appendChild(cartPanel);

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'cart-overlay';
        document.body.appendChild(overlay);

        // Setup event listeners
        document.querySelector('.close-cart').addEventListener('click', closeCart);
        document.querySelector('.continue-shopping').addEventListener('click', closeCart);
        document.querySelector('.cart-overlay').addEventListener('click', closeCart);
        document.querySelector('.checkout-btn').addEventListener('click', checkout);

        // Render cart items
        renderCartItems();
    }
}

// Setup cart trigger button
function setupCartTrigger() {
    const cartTrigger = document.querySelector('.nav-icons .cart a');
    if (cartTrigger) {
        // Ajouter un compteur à l'icône existante si nécessaire
        if (!cartTrigger.querySelector('.cart-count')) {
            const cartCount = document.createElement('span');
            cartCount.className = 'cart-count';
            cartCount.textContent = '0';
            cartTrigger.appendChild(cartCount);
        }

        // Remplacer le comportement par défaut du lien
        cartTrigger.addEventListener('click', function (e) {
            e.preventDefault();
            openCart();
        });
    }
}

// Setup add to cart buttons
function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, .wishlist-add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productImage = this.getAttribute('data-image');

            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });

            // Show notification
            showNotification('Item added to your cart');

            // Open cart
            openCart();
        });
    });
}

// Setup wishlist buttons
function setupWishlistButtons() {
    const wishlistButtons = document.querySelectorAll('.add-to-wishlist-btn');

    wishlistButtons.forEach(button => {
        const productId = button.getAttribute('data-id');

        // Check if product is in wishlist and update button state
        if (isInWishlist(productId)) {
            button.classList.add('active');
        }

        button.addEventListener('click', function (e) {
            e.preventDefault();
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productImage = this.getAttribute('data-image');

            toggleWishlist({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            });

            // Toggle active class
            this.classList.toggle('active');

            // Show notification
            if (isInWishlist(productId)) {
                showNotification('Item added to your wishlist');
            } else {
                showNotification('Item removed from your wishlist');
            }
        });
    });

    // Handle remove from wishlist buttons (on wishlist page)
    const removeWishlistButtons = document.querySelectorAll('.remove-from-wishlist');

    removeWishlistButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const productId = this.getAttribute('data-id');

            removeFromWishlist(productId);
        });
    });
}

// Open cart
function openCart() {
    document.querySelector('.cart-panel').classList.add('active');
    document.querySelector('.cart-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close cart
function closeCart() {
    document.querySelector('.cart-panel').classList.remove('active');
    document.querySelector('.cart-overlay').classList.remove('active');
    document.body.style.overflow = '';
}

// Add item to cart
function addToCart(product) {
    // Check if product is already in cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex > -1) {
        // Update quantity if product exists
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        // Add new product
        cart.push(product);
    }

    // Save to localStorage
    saveCart();

    // Update cart UI
    renderCartItems();
    updateCartCount();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);

    // Save to localStorage
    saveCart();

    // Update cart UI
    renderCartItems();
    updateCartCount();
}

// Update item quantity
function updateCartItemQuantity(productId, quantity) {
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex > -1) {
        cart[productIndex].quantity = quantity;

        // Remove item if quantity is 0
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        // Save to localStorage
        saveCart();

        // Update cart UI
        renderCartItems();
        updateCartCount();
    }
}

// Remove from wishlist
function removeFromWishlist(productId) {
    // Get the latest wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Filter out the item
    wishlist = wishlist.filter(item => item.id !== productId);

    // Save the updated wishlist back to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    // Update the UI
    const card = document.querySelector(`.wishlist-card[data-id="${productId}"]`);
    if (card) {
        card.style.opacity = '0';
        setTimeout(() => {
            card.remove();
            updateWishlistCount();

            // Show empty message if no items left
            if (wishlist.length === 0) {
                showEmptyWishlist();
            }
        }, 300);
    }

    // Show notification
    showNotification('Item removed from your wishlist');
}

// Toggle wishlist item
function toggleWishlist(product) {
    const existingProductIndex = wishlist.findIndex(item => item.id === product.id);

    if (existingProductIndex > -1) {
        // Remove from wishlist
        wishlist.splice(existingProductIndex, 1);
    } else {
        // Add to wishlist
        wishlist.push(product);
    }

    // Save to localStorage
    saveWishlist();

    // Update wishlist count if on wishlist page

}

// Check if product is in wishlist
function isInWishlist(productId) {
    return wishlist.some(item => item.id === productId);
}

// Save cart to localStorage
function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}

// Save wishlist to localStorage
function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Render cart items
function renderCartItems() {
    try {
        const cartItemsContainer = document.querySelector('.cart-items');
        if (!cartItemsContainer) {
            console.error('Cart items container not found');
            return;
        }

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty">
                    <p>Your cart is empty</p>
                    <button class="continue-shopping">Start Shopping</button>
                </div>
            `;

            document.querySelector('.cart-empty .continue-shopping').addEventListener('click', closeCart);
        } else {
            let cartHTML = '';

            cart.forEach(item => {
                // Format price using Intl.NumberFormat
                const formattedPrice = new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 0
                }).format(item.price);

                cartHTML += `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${item.name}</h4>
                            <div class="cart-item-price">${formattedPrice}</div>
                            <div class="cart-quantity-control">
                                <span class="quantity-btn decrease">-</span>
                                <input type="text" class="cart-quantity" value="${item.quantity}" readonly>
                                <span class="quantity-btn increase">+</span>
                            </div>
                        </div>
                        <button class="remove-item" data-id="${item.id}">
                            <img src="./assets/icons/delete.png" alt="Remove">
                        </button>
                    </div>
                `;
            });

            cartItemsContainer.innerHTML = cartHTML;
            setupQuantityControls();
            setupRemoveButtons();
            updateCartTotals();
        }
    } catch (error) {
        console.error('Error rendering cart items:', error);
    }
}

// Setup quantity controls
function setupQuantityControls() {
    const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
    const increaseButtons = document.querySelectorAll('.quantity-btn.increase');

    decreaseButtons.forEach(button => {
        button.addEventListener('click', function () {
            const cartItem = this.closest('.cart-item');
            const productId = cartItem.getAttribute('data-id');
            const quantityInput = cartItem.querySelector('.cart-quantity');
            const currentQuantity = parseInt(quantityInput.value);

            if (currentQuantity > 1) {
                updateCartItemQuantity(productId, currentQuantity - 1);
            } else {
                removeFromCart(productId);
            }
        });
    });

    increaseButtons.forEach(button => {
        button.addEventListener('click', function () {
            const cartItem = this.closest('.cart-item');
            const productId = cartItem.getAttribute('data-id');
            const quantityInput = cartItem.querySelector('.cart-quantity');
            const currentQuantity = parseInt(quantityInput.value);

            updateCartItemQuantity(productId, currentQuantity + 1);
        });
    });
}

// Setup remove buttons
function setupRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-item');

    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-id');
            removeFromCart(productId);
        });
    });
}

// Update cart totals
function updateCartTotals() {
    let subtotal = 0;

    cart.forEach(item => {
        // Ensure price and quantity are numbers
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        subtotal += price * quantity;
    });

    const tax = subtotal * 0.07; // 7% tax rate
    const total = subtotal + tax;

    // Format currency
    const formatter = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0
    });

    // Update DOM with formatted values
    const subtotalElement = document.querySelector('.subtotal');
    const taxElement = document.querySelector('.tax');
    const totalElement = document.querySelector('.total-amount');

    if (subtotalElement) subtotalElement.textContent = formatter.format(subtotal);
    if (taxElement) taxElement.textContent = formatter.format(tax);
    if (totalElement) totalElement.textContent = formatter.format(total);
}

// Update cart count
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');

    if (cartCountElement) {
        let totalItems = 0;

        cart.forEach(item => {
            totalItems += item.quantity;
        });

        cartCountElement.textContent = totalItems;
    }
}

// Update wishlist count


// Render wishlist items
function renderWishlistItems() {
    const wishlistContainer = document.querySelector('.wishlist-items');

    if (!wishlistContainer) return;

    // Get fresh data from localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (wishlist.length === 0) {
        showEmptyWishlist();
    } else {
        let wishlistHTML = '';

        wishlist.forEach(item => {
            wishlistHTML += `
                <div class="wishlist-card" data-id="${item.id}">
                    <div class="wishlist-image">
                        <img src="${item.image}" alt="${item.name}">
                        <button class="remove-from-wishlist" data-id="${item.id}">
                            <img src="../assets/icons/delete.png" alt="Remove">
                        </button>
                    </div>
                    <div class="wishlist-details">
                        <div class="wishlist-name-type">
                            <h3>${item.name}</h3>
                            <p>Premium Vehicle</p>
                        </div>
                        <div class="wishlist-price">
                            <div class="price">€${Math.round(item.price / 365)}<span class="price-period">/day</span></div>
                            <div class="price-total">€${item.price.toLocaleString()} total</div>
                        </div>
                    </div>
                    <div class="wishlist-actions">
                        <button class="wishlist-add-to-cart" 
                            data-id="${item.id}" 
                            data-name="${item.name}" 
                            data-price="${item.price}" 
                            data-image="${item.image}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;
        });

        wishlistContainer.innerHTML = wishlistHTML;

        // Update all wishlist counters
        updateWishlistCount();

        // Setup event listeners
        setupAddToCartButtons();
        setupWishlistButtons();
    }
}

// Fix empty wishlist display
function showEmptyWishlist() {
    const wishlistContainer = document.querySelector('.wishlist-items');

    if (wishlistContainer) {
        wishlistContainer.innerHTML = `
            <div class="wishlist-empty">
                <h3>Your wishlist is empty</h3>
                <p>Browse our collection of premium vehicles and add your favorites to your wishlist.</p>
                <a href="../index.html" class="browse-vehicles-btn">
                    Browse Vehicles
                </a>
            </div>
        `;

        // Update all wishlist counters to 0
        updateWishlistCount();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification if it doesn't exist
    if (!document.querySelector('.notification')) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }

    const notificationElement = document.querySelector('.notification');
    notificationElement.textContent = message;
    notificationElement.className = `notification ${type}`;
    notificationElement.classList.add('active');

    // Hide notification after 3 seconds
    setTimeout(() => {
        notificationElement.classList.remove('active');
    }, 3000);
}

// Update the checkout function to close cart panel first
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    if (orderPanel) {
        // Close cart panel first
        closeCart();
        // Then open order panel
        orderPanel.openPanel();
    } else {
        showNotification('Unable to process order. Please try again.', 'error');
    }
}