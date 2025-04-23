class OrderPanel {
    constructor() {
        this.API_KEY = 'e2a832e2444643e4950b21203195a478';
        this.panel = document.querySelector('.order-slide-panel');
        this.searchInput = document.getElementById('location-search');
        this.resultsContainer = document.getElementById('location-results');
        this.selectedLocation = document.getElementById('selected-location');
        this.confirmButton = document.getElementById('confirm-order');
        this.closeButton = document.querySelector('.close-panel');
        
        this.initializeEventListeners();
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

        // Add map background pattern
        const map = document.getElementById('location-map');
        if (map) {
            map.style.background = `
                linear-gradient(45deg, #f8f9fa 25%, transparent 25%),
                linear-gradient(-45deg, #f8f9fa 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #f8f9fa 75%),
                linear-gradient(-45deg, transparent 75%, #f8f9fa 75%)
            `;
            map.style.backgroundSize = '20px 20px';
            map.style.backgroundPosition = '0 0, 0 10px, 10px -10px, -10px 0px';
            map.style.display = 'block';
        }
    }

    openPanel() {
        this.panel.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closePanel() {
        this.panel.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleOrderConfirmation() {
        const selectedAddress = this.selectedLocation.querySelector('.address')?.textContent;
        const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;

        if (!selectedAddress) {
            alert('Please select a delivery location');
            return;
        }

        if (!paymentMethod) {
            alert('Please select a payment method');
            return;
        }

        // Here you would typically send the order to your backend
        console.log('Order confirmed:', {
            deliveryAddress: selectedAddress,
            paymentMethod: paymentMethod
        });

        alert('Order confirmed! Thank you for your purchase.');
        this.closePanel();
    }
}

// Initialize the OrderPanel when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.orderPanel = new OrderPanel();
});