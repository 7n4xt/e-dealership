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
                orderBtn.addEventListener('click', placeOrder);
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
    
    function placeOrder() {
        alert('Order placed successfully!');
        cartItems = []; // Clear cart
        closeSlidePanel();
    }
});