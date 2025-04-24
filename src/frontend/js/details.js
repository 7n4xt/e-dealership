// DOM Elements
const loadingSpinner = document.getElementById('loading');
const carDetailsElement = document.getElementById('carDetails');
const carTitle = document.getElementById('carTitle');
const carYear = document.getElementById('carYear');
const carPrice = document.getElementById('carPrice');
const carDiscount = document.getElementById('carDiscount');
const mainImage = document.getElementById('mainImage');
const thumbnailImages = document.getElementById('thumbnailImages');
const colorButtons = document.getElementById('colorButtons');
const carDescription = document.getElementById('carDescription');
const carBrand = document.getElementById('carBrand');
const carModel = document.getElementById('carModel');
const specYear = document.getElementById('specYear');
const carDelivery = document.getElementById('carDelivery');
const addToCartBtn = document.getElementById('addToCart');
const addToWishlistBtn = document.getElementById('addToWishlist');
let currentImageIndex = 0;
let currentImages = [];
const prevImageBtn = document.getElementById('prevImage');
const nextImageBtn = document.getElementById('nextImage');

// Configuration
const API_URL = 'http://localhost:8080'; // Update with your actual API URL
let currentCar = null;
let selectedColor = null;
let selectedImageType = 'main'; // Default to main image

// Get car ID from URL parameter
function getCarIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  return id ? parseInt(id) : null;
}

// Fetch car details
async function fetchCarDetails() {
  const carId = getCarIdFromUrl();

  if (!carId) {
    showError('Car ID not provided');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/car/${carId}`);
    const data = await response.json();

    if (data.status === 'success') {
      currentCar = data.data;
      selectedColor = currentCar.colors[0]; // Default to first color

      // Update the page title
      document.title = `${currentCar.brand.toUpperCase()} ${currentCar.model.toUpperCase()} | E-Dealership`;

      // Render car details
      renderCarDetails();

      // Hide loading spinner and show car details
      loadingSpinner.style.display = 'none';
      carDetailsElement.style.display = 'block';
    } else {
      showError(`Error loading car details: ${data.message}`);
    }
  } catch (error) {
    showError(`Failed to fetch car details: ${error.message}`);
  }
}

// Render car details
function renderCarDetails() {
  if (!currentCar) return;

  // Set basic car information
  carTitle.textContent = `${currentCar.brand.toUpperCase()} ${currentCar.model.toUpperCase()}`;
  carYear.textContent = currentCar.release_date.substring(0, 4);

  // Format and set price information
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(currentCar.price);

  carPrice.textContent = formattedPrice;

  if (currentCar.reduction) {
    const discountedPrice = currentCar.price * (1 - currentCar.reduction / 100);
    const formattedDiscountedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(discountedPrice);

    carDiscount.textContent = `${currentCar.reduction}% off! Was ${formattedPrice}`;
    carPrice.textContent = formattedDiscountedPrice;
  } else {
    carDiscount.textContent = '';
  }

  // Add stock information
  const stockInfo = document.getElementById('stockInfo');
  if (stockInfo) {
    if (currentCar.stock <= 0) {
      stockInfo.innerHTML = '<span class="stock-status out">Out of Stock</span>';
      if (addToCartBtn) addToCartBtn.disabled = true;
    } else if (currentCar.stock <= 2) {
      stockInfo.innerHTML = `<span class="stock-status low">Only ${currentCar.stock} left in stock!</span>`;
    } else {
      stockInfo.innerHTML = `<span class="stock-status available">${currentCar.stock} available in stock</span>`;
    }
  }

  // Set description and specs
  carDescription.textContent = currentCar.description;
  carBrand.textContent = currentCar.brand.toUpperCase();
  carModel.textContent = currentCar.model.toUpperCase();
  specYear.textContent = currentCar.release_date.substring(0, 4);

  // Set delivery information
  if (currentCar.delivery_price === 0) {
    carDelivery.textContent = `Free, ${currentCar.delivery_time} weeks`;
  } else {
    carDelivery.textContent = `€${currentCar.delivery_price}, ${currentCar.delivery_time} weeks`;
  }

  // Update technical specifications
  document.getElementById('engineSpec').textContent = currentCar.engine_options;
  document.getElementById('horsepowerSpec').textContent = `${currentCar.horsepower} HP`;
  document.getElementById('topSpeedSpec').textContent = `${currentCar.top_speed_kmh} km/h`;
  document.getElementById('fuelTypeSpec').textContent = currentCar.fuel_type;
  document.getElementById('weightSpec').textContent = `${currentCar.weight_kg} kg`;
  document.getElementById('doorsSpec').textContent = `${currentCar.doors} doors`;
  document.getElementById('mpgSpec').textContent = currentCar.mpg === "N/A" ? "N/A" : `${currentCar.mpg} MPG`;
  document.getElementById('transmissionSpec').textContent = currentCar.transmission;
  document.getElementById('drivetrainSpec').textContent = currentCar.drivetrain;

  // Render color options
  renderColorOptions();

  // Set main image and thumbnails
  updateImages();
}

// Render color options
function renderColorOptions() {
  colorButtons.innerHTML = '';

  currentCar.colors.forEach(color => {
    const button = document.createElement('div');
    button.className = `color-button ${color === selectedColor ? 'active' : ''}`;
    button.style.backgroundColor = color;
    button.setAttribute('data-color', color);
    button.title = color.charAt(0).toUpperCase() + color.slice(1);

    button.addEventListener('click', () => {
      selectedColor = color;

      // Update active state of color buttons
      document.querySelectorAll('.color-button').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');

      // Update images
      updateImages();
    });

    colorButtons.appendChild(button);
  });
}

// Update image display
function updateImages() {
  // Get all images for the selected color
  const colorImages = currentCar.images[selectedColor];
  currentImages = Object.entries(colorImages);

  // Set main image
  updateMainImage();

  // Clear thumbnails
  thumbnailImages.innerHTML = '';

  // Add thumbnails
  currentImages.forEach(([imageType, imagePath], index) => {
    const thumb = document.createElement('div');
    thumb.className = `thumbnail ${index === currentImageIndex ? 'active' : ''}`;
    thumb.setAttribute('data-index', index);

    const img = document.createElement('img');
    img.src = `${API_URL}/img/${imagePath}`;
    img.alt = `${currentCar.brand} ${currentCar.model} ${imageType}`;

    thumb.appendChild(img);
    thumbnailImages.appendChild(thumb);

    thumb.addEventListener('click', () => {
      currentImageIndex = index;
      updateMainImage();
      updateThumbnailsActive();
    });
  });
}

// Update main image
function updateMainImage() {
  const [imageType, imagePath] = currentImages[currentImageIndex];
  mainImage.src = `${API_URL}/img/${imagePath}`;
  mainImage.alt = `${currentCar.brand} ${currentCar.model} ${imageType}`;
}

// Update active state of thumbnails
function updateThumbnailsActive() {
  document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
    thumb.classList.toggle('active', index === currentImageIndex);
  });
}

// Show error message
function showError(message) {
  loadingSpinner.innerHTML = `
    <div class="error-message">
      <h3>Error</h3>
      <p>${message}</p>
      <button class="btn btn-primary" onclick="window.location.href='./index.html'">
        Return to Home
      </button>
    </div>
  `;
}

// Handle cart and wishlist functionality
function setupCartWishlist() {
  addToCartBtn.addEventListener('click', () => {
    if (!currentCar) return;

    try {
      // Calculate the actual price considering reduction
      const actualPrice = currentCar.reduction ?
        currentCar.price * (1 - currentCar.reduction / 100) :
        currentCar.price;

      // Create cart item
      const cartItem = {
        id: currentCar.id,
        brand: currentCar.brand.toUpperCase(),
        model: currentCar.model.toUpperCase(),
        name: `${currentCar.brand.toUpperCase()} ${currentCar.model.toUpperCase()}`,
        price: actualPrice,
        quantity: 1,
        color: selectedColor,
        image: `${API_URL}/img/${currentCar.images[selectedColor].main}`
      };

      // Add to cart via localStorage
      let cart = JSON.parse(localStorage.getItem('cart')) || [];

      // Check if product is already in cart
      const existingProductIndex = cart.findIndex(item => item.id === cartItem.id);

      if (existingProductIndex > -1) {
        // Update quantity if product exists
        cart[existingProductIndex].quantity += cartItem.quantity;
      } else {
        // Add new product
        cart.push(cartItem);
      }

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));

      // Set session flag to open cart on redirect
      sessionStorage.setItem('openCartOnLoad', 'true');

      // Show notification
      showNotification('Car added to cart successfully!');

      // Redirect to main page
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Error adding to cart', 'error');
    }
  });

  addToWishlistBtn.addEventListener('click', function () {
    if (!currentCar) return;

    try {
      // Calculate actual price considering reduction
      const actualPrice = currentCar.reduction ?
        currentCar.price * (1 - currentCar.reduction / 100) :
        currentCar.price;

      const product = {
        id: currentCar.id,
        name: `${currentCar.brand.toUpperCase()} ${currentCar.model.toUpperCase()}`,
        price: actualPrice,
        image: `${API_URL}/img/${currentCar.images[selectedColor].main}`
      };

      console.log('Adding to wishlist:', product);

      // Toggle wishlist item and get result (true if added, false if removed)
      const isAdded = toggleWishlist(product);

      // Update button text and style
      if (isAdded) {
        addToWishlistBtn.classList.add('active');
        addToWishlistBtn.textContent = 'Remove from Wishlist';
        showNotification('Item added to your wishlist');
      } else {
        addToWishlistBtn.classList.remove('active');
        addToWishlistBtn.textContent = 'Add to Wishlist';
        showNotification('Item removed from your wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      showNotification('Error updating wishlist', 'error');
    }
  });

  // Update button state based on wishlist status on load
  if (isInWishlist(currentCar?.id)) {
    addToWishlistBtn.classList.add('active');
    addToWishlistBtn.textContent = 'Remove from Wishlist';
  } else {
    addToWishlistBtn.classList.remove('active');
    addToWishlistBtn.textContent = 'Add to Wishlist';
  }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  // Start loading car details
  fetchCarDetails();

  // Setup cart and wishlist handlers
  setupCartWishlist();

  // Add scroll event for nav styling
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  });

  // Add navigation button handlers
  prevImageBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    updateMainImage();
    updateThumbnailsActive();
  });

  nextImageBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    updateMainImage();
    updateThumbnailsActive();
  });
});