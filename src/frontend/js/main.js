// DOM Elements
const vehiclesGrid = document.querySelector('.vehicles-grid');
const vehiclesAvailable = document.querySelector('.vehicles-available');
const loadMoreBtn = document.querySelector('.load-more-button');

// Configuration
const API_URL = 'http://localhost:8080'; // Update with your actual API URL
let currentPage = 1;
const carsPerPage = 6;
let allCars = [];

// Fetch all cars from the API
async function fetchCars() {
  try {
    const response = await fetch(`${API_URL}/cars`);
    const data = await response.json();
    
    if (data.status === 'success') {
      allCars = data.data;
      
      // Update the counter for available vehicles
      vehiclesAvailable.textContent = `${allCars.length} vehicles available`;
      
      // Load the first page of cars
      loadCarPage(currentPage);
    } else {
      console.error('Error fetching cars:', data.message);
    }
  } catch (error) {
    console.error('Failed to fetch cars:', error);
  }
}

// Load a specific page of cars
function loadCarPage(page) {
  const startIndex = (page - 1) * carsPerPage;
  const endIndex = Math.min(startIndex + carsPerPage, allCars.length);
  const carsForPage = allCars.slice(startIndex, endIndex);
  
  // If we're on page 1, clear the grid first
  if (page === 1) {
    vehiclesGrid.innerHTML = '';
  }
  
  // Add cars to the grid
  carsForPage.forEach(car => {
    vehiclesGrid.appendChild(createCarCard(car));
  });
  
  // Hide/show load more button based on whether there are more cars
  if (endIndex >= allCars.length) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'block';
  }
}

// Create a car card element
function createCarCard(car) {
  // Get the main image for the first available color
  const firstColor = car.colors[0];
  const mainImage = car.images[firstColor].main;
  
  // Format the price for display
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(car.price);
  
  // Calculate discounted price if there's a reduction
  const discountedPrice = car.reduction ? 
    car.price * (1 - car.reduction / 100) : 
    car.price;
  
  // Create the card element
  const card = document.createElement('div');
  card.className = 'vehicle-card';
  card.innerHTML = `
    <div class="vehicle-image">
      <img src="../backend/img/${mainImage}" alt="${car.brand} ${car.model}">
      ${car.reduction ? `<div class="vehicle-tag">${car.reduction}% Off</div>` : ''}
    </div>
    <div class="vehicle-details">
      <div class="vehicle-name-type">
        <h3>${car.brand.toUpperCase()} ${car.model.toUpperCase()}</h3>
        <p>${car.release_date.substring(0, 4)}</p>
      </div>
      <div class="vehicle-price">
        <div class="price">€${Math.round(discountedPrice / 365)}<span class="price-period">/day</span></div>
        <div class="price-total">${formattedPrice} total</div>
      </div>
    </div>
    <div class="vehicle-features">
      <div class="feature">
        <img src="../assets/icons/palette-icon.png" alt="Colors">
        <span>${car.colors.length} colors</span>
      </div>
      <div class="feature">
        <img src="../assets/icons/truck-icon.png" alt="Delivery">
        <span>${car.delivery_time} weeks delivery</span>
      </div>
      <div class="feature">
        <img src="../assets/icons/tag-icon.png" alt="Price">
        <span>${car.delivery_price === 0 ? 'Free delivery' : `€${car.delivery_price} delivery`}</span>
      </div>
    </div>
  `;
  
  // Add click event to navigate to details page
  card.addEventListener('click', () => {
    window.location.href = `./pages/details.html?id=${car.id}`;
  });
  
  return card;
}

// Handle load more button click
loadMoreBtn.addEventListener('click', () => {
  currentPage++;
  loadCarPage(currentPage);
});

// Sort cars based on selected option
document.getElementById('sort-select').addEventListener('change', (e) => {
  const sortValue = e.target.value;
  
  switch (sortValue) {
    case 'price-low':
      allCars.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      allCars.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      allCars.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      break;
    default: // 'popular' or any other value
      // Default sorting could be by ID or some other criteria
      allCars.sort((a, b) => a.id - b.id);
      break;
  }
  
  // Reset to page 1 and reload
  currentPage = 1;
  loadCarPage(currentPage);
});

// Handle search input
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');

function performSearch() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  
  if (searchTerm === '') {
    // If search is empty, show all cars
    currentPage = 1;
    loadCarPage(currentPage);
    return;
  }
  
  // Filter cars based on search term
  const filteredCars = allCars.filter(car => 
    car.brand.toLowerCase().includes(searchTerm) || 
    car.model.toLowerCase().includes(searchTerm) ||
    car.description.toLowerCase().includes(searchTerm)
  );
  
  // Update the counter
  vehiclesAvailable.textContent = `${filteredCars.length} vehicles available`;
  
  // Clear the grid and display filtered cars
  vehiclesGrid.innerHTML = '';
  
  if (filteredCars.length === 0) {
    vehiclesGrid.innerHTML = `
      <div class="no-results">
        <h3>No vehicles found matching "${searchTerm}"</h3>
        <p>Try a different search term or browse our categories.</p>
      </div>
    `;
    loadMoreBtn.style.display = 'none';
  } else {
    filteredCars.forEach(car => {
      vehiclesGrid.appendChild(createCarCard(car));
    });
    loadMoreBtn.style.display = 'none'; // Hide load more for search results
  }
}

searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    performSearch();
  }
});

// Handle filter tags
const filterTags = document.querySelectorAll('.filter-tag');
filterTags.forEach(tag => {
  tag.addEventListener('click', () => {
    // Get tag text
    const tagText = tag.textContent.toLowerCase();
    
    // Apply filter based on tag
    if (tagText.includes('€')) {
      // Price range filter
      const priceRange = tagText.match(/€(\d+)\s*-\s*€(\d+)/);
      if (priceRange) {
        const minPrice = parseInt(priceRange[1]);
        const maxPrice = parseInt(priceRange[2]);
        
        const filteredCars = allCars.filter(car => {
          const dailyPrice = Math.round(car.price / 365);
          return dailyPrice >= minPrice && dailyPrice <= maxPrice;
        });
        
        vehiclesAvailable.textContent = `${filteredCars.length} vehicles available`;
        vehiclesGrid.innerHTML = '';
        filteredCars.forEach(car => {
          vehiclesGrid.appendChild(createCarCard(car));
        });
        loadMoreBtn.style.display = 'none';
      }
    } else {
      // Other filters (could be color, type, etc.)
      // Add implementation for other filters as needed
    }
  });
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  fetchCars();
  
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