// Make toggleWishlist available globally (window scope)
window.toggleWishlist = function (element) {
    element.classList.toggle('active');

    // Get car info
    const carContainer = element.closest('.car-card');
    const carModel = element.previousElementSibling.textContent;
    const carImage = carContainer.querySelector('img').src;
    const carPrice = carContainer.querySelector('.car-price').textContent;
    const isWishlisted = element.classList.contains('active');

    // Get existing wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('carWishlist')) || [];

    if (isWishlisted) {
        // Add to wishlist if not already there
        if (!wishlist.some(car => car.model === carModel)) {
            wishlist.push({
                model: carModel,
                image: carImage,
                price: carPrice,
                timestamp: new Date().getTime() // For sorting by most recent
            });
            localStorage.setItem('carWishlist', JSON.stringify(wishlist));
            console.log(`Added "${carModel}" to car wishlist`);
        }
    } else {
        // Remove from wishlist
        wishlist = wishlist.filter(car => car.model !== carModel);
        localStorage.setItem('carWishlist', JSON.stringify(wishlist));
        console.log(`Removed "${carModel}" from car wishlist`);
    }
};

// Check if localStorage is working
function testLocalStorage() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
    } catch (e) {
        console.error('LocalStorage is not working:', e);
        return false;
    }
}

// When page loads, check if cars are in wishlist and update heart icons
document.addEventListener('DOMContentLoaded', function () {
    console.log('Page loaded, checking car wishlist...');

    // Test if localStorage is working
    if (!testLocalStorage()) {
        alert('Attention: LocalStorage n\'est pas disponible. La fonctionnalité de liste de souhaits ne fonctionnera pas.');
        return;
    }

    const wishlist = JSON.parse(localStorage.getItem('carWishlist')) || [];
    console.log('Liste de souhaits actuelle:', wishlist);

    const carCards = document.querySelectorAll('.car-card');

    carCards.forEach(card => {
        const carModel = card.querySelector('.info-container p').textContent;
        const heartIcon = card.querySelector('.heart-icon');

        // If this car is in wishlist, make heart active
        if (wishlist.some(car => car.model === carModel)) {
            heartIcon.classList.add('active');
            console.log(`Marqué "${carModel}" comme favori`);
        }
    });
});

// Also expose removeFromWishlist globally for the wishlist page
window.removeFromWishlist = function (encodedCarModel) {
    const carModel = decodeURIComponent(encodedCarModel);
    console.log('Suppression de la liste de souhaits:', carModel);

    // Get existing wishlist
    let wishlist = JSON.parse(localStorage.getItem('carWishlist')) || [];

    // Remove this car
    wishlist = wishlist.filter(car => car.model !== carModel);

    // Update localStorage
    localStorage.setItem('carWishlist', JSON.stringify(wishlist));

    // Find and remove the car card from display with animation
    const carCards = document.querySelectorAll('.car-card');
    carCards.forEach(card => {
        const cardCarModel = card.querySelector('.info-container p').textContent;
        if (cardCarModel === carModel) {
            card.style.animation = 'fadeOut 0.5s';

            setTimeout(() => {
                card.remove();

                // Show message if no cars left in wishlist
                if (wishlist.length === 0) {
                    document.getElementById('no-wishlist-message').classList.remove('hidden');
                }
            }, 500);
        }
    });
};

// Globally expose sortWishlist function
window.sortWishlist = function (method) {
    console.log('Tri par:', method);
    loadWishlist(method);
};

// Globally expose loadWishlist function
window.loadWishlist = function (sortMethod = 'newest') {
    const wishlistContainer = document.getElementById('wishlist-container');
    const noWishlistMessage = document.getElementById('no-wishlist-message');

    // Clear current content
    wishlistContainer.innerHTML = '';

    // Get wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('carWishlist')) || [];
    console.log('Chargement de la liste de souhaits:', wishlist);

    // Show message if no cars in wishlist
    if (wishlist.length === 0) {
        noWishlistMessage.classList.remove('hidden');
        return;
    } else {
        noWishlistMessage.classList.add('hidden');
    }

    // Sort the wishlist based on selected method
    wishlist = sortWishlistByMethod(wishlist, sortMethod);

    // Display each car in wishlist
    wishlist.forEach(car => {
        const carCard = document.createElement('div');
        carCard.classList.add('car-card');

        carCard.innerHTML = `
            <div class="image-container">
                <img src="${car.image}" alt="${car.model}">
            </div>
            <div class="info-container">
                <p>${car.model}</p>
                <span class="car-price">${car.price}</span>
                <div class="icon heart-icon active" onclick="removeFromWishlist('${encodeURIComponent(car.model)}')"></div>
            </div>
            <div class="action-buttons">
                <button class="contact-btn" onclick="contactDealer('${encodeURIComponent(car.model)}')">Contacter le concessionnaire</button>
                <button class="test-drive-btn" onclick="scheduleTestDrive('${encodeURIComponent(car.model)}')">Essai routier</button>
            </div>
        `;

        wishlistContainer.appendChild(carCard);
    });
};

function sortWishlistByMethod(wishlist, method) {
    switch (method) {
        case 'model-asc':
            return wishlist.sort((a, b) => a.model.localeCompare(b.model));
        case 'model-desc':
            return wishlist.sort((a, b) => b.model.localeCompare(a.model));
        case 'price-asc':
            return wishlist.sort((a, b) => parseFloat(a.price.replace(/[^\d.-]/g, '')) - parseFloat(b.price.replace(/[^\d.-]/g, '')));
        case 'price-desc':
            return wishlist.sort((a, b) => parseFloat(b.price.replace(/[^\d.-]/g, '')) - parseFloat(a.price.replace(/[^\d.-]/g, '')));
        case 'newest':
            return wishlist.sort((a, b) => b.timestamp - a.timestamp);
        case 'oldest':
            return wishlist.sort((a, b) => a.timestamp - b.timestamp);
        default:
            return wishlist;
    }
}

window.removeAllWishlist = function () {
    // Confirm with the user before removing all cars from wishlist
    if (confirm('Êtes-vous sûr de vouloir supprimer toutes les voitures de votre liste de souhaits?')) {
        console.log('Suppression de toutes les voitures de la liste de souhaits');

        // Clear wishlist from localStorage
        localStorage.setItem('carWishlist', JSON.stringify([]));

        // Add fade-out animation to all car cards
        const carCards = document.querySelectorAll('.car-card');
        carCards.forEach(card => {
            card.style.animation = 'fadeOut 0.5s';
        });

        // Remove all cards after animation completes
        setTimeout(() => {
            const wishlistContainer = document.getElementById('wishlist-container');
            wishlistContainer.innerHTML = '';

            // Show no wishlist message
            document.getElementById('no-wishlist-message').classList.remove('hidden');

            // Also update any heart icons on the main page if we're viewing it in another tab
            if (window.updateHeartIcons) {
                window.updateHeartIcons();
            }
        }, 500);
    }
};

// Add these helper functions for car wishlist specific functionality
window.contactDealer = function (encodedCarModel) {
    const carModel = decodeURIComponent(encodedCarModel);
    console.log(`Contacter le concessionnaire pour ${carModel}`);
    // Implement dealer contact functionality here
    alert(`Nous vous contacterons bientôt au sujet de ${carModel}`);
};

window.scheduleTestDrive = function (encodedCarModel) {
    const carModel = decodeURIComponent(encodedCarModel);
    console.log(`Planifier un essai routier pour ${carModel}`);
    // Implement test drive scheduling functionality here
    alert(`Veuillez choisir une date pour votre essai routier de ${carModel}`);
};

// Add this helper function to update heart icons on main page
window.updateHeartIcons = function () {
    const carCards = document.querySelectorAll('.car-card');
    carCards.forEach(card => {
        const heartIcon = card.querySelector('.heart-icon');
        if (heartIcon) {
            heartIcon.classList.remove('active');
        }
    });
};