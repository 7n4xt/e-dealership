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
  // Set main image
  mainImage.src = `../backend/img/${currentCar.images[selectedColor][selectedImageType]}`;
  mainImage.alt = `${currentCar.brand} ${currentCar.model} ${selectedColor} ${selectedImageType}`;
  
  // Clear thumbnails
  thumbnailImages.innerHTML = '';
  
  // Add thumbnails for all image types
  Object.keys(currentCar.images[selectedColor]).forEach(imageType => {
    const thumb = document.createElement('div');
    thumb.className = `thumbnail ${imageType === selectedImageType ? 'active' : ''}`;
    thumb.setAttribute('data-type', imageType);
    
    const img = document.createElement('img');
    img.src = `../backend/img/${currentCar.images[selectedColor][imageType]}`;
    img.alt = `${currentCar.brand} ${currentCar.model} ${imageType}`;
    
    thumb.appendChild(img);
    thumbnailImages.appendChild(thumb);
    
    // Add click event to thumbnail
    thumb.addEventListener('click', () => {
      selectedImageType = imageType;
      
      // Update active state of thumbnails
      document.querySelectorAll('.thumbnail').forEach(t => {
        t.classList.remove('active');
      });
      thumb.classList.add('active');
      
      // Update main image
      mainImage.src = `../backend/img/${currentCar.images[selectedColor][selectedImageType]}`;
      mainImage.alt = `${currentCar.brand} ${currentCar.model} ${selectedColor} ${selectedImageType}`;
    });
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
    
    // Get existing cart or create new one
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if car is already in cart
    const existingItem = cart.find(item => item.id === currentCar.id);
    
    if (existingItem) {
      // If car is already in cart, show alert
      alert('This car is already in your cart!');
    } else {
      // Add car to cart with selected color
      cart.push({
        id: currentCar.id,
        brand: currentCar.brand,
        model: currentCar.model,
        price: currentCar.reduction ? 
          currentCar.price * (1 - currentCar.reduction / 100) : 
          currentCar.price,
        color: selectedColor,
        image: currentCar.images[selectedColor].main
      });
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Show success message
      alert('Car added to cart successfully!');
    }
  });
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
});