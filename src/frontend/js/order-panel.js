class OrderPanel {
    constructor() {
        this.panel = document.querySelector('.order-slide-panel');
        this.searchInput = document.getElementById('location-search');
        this.resultsContainer = document.getElementById('location-results');
        this.selectedLocation = document.getElementById('selected-location');
        this.confirmButton = document.getElementById('confirm-order');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Location search with debounce
        let timeout = null;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => this.searchLocation(e.target.value), 500);
        });

        // Close panel
        document.querySelector('.close-panel').addEventListener('click', () => {
            this.closePanel();
        });

        // Confirm order
        this.confirmButton.addEventListener('click', () => {
            this.placeOrder();
        });
    }

    async searchLocation(query) {
        if (query.length < 3) return;

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            this.displayResults(data);
        } catch (error) {
            console.error('Error searching location:', error);
        }
    }

    displayResults(results) {
        this.resultsContainer.innerHTML = '';
        this.resultsContainer.style.display = 'block';

        results.forEach(result => {
            const div = document.createElement('div');
            div.className = 'location-result-item';
            div.textContent = result.display_name;
            div.addEventListener('click', () => {
                this.selectLocation(result);
            });
            this.resultsContainer.appendChild(div);
        });
    }

    selectLocation(location) {
        this.selectedLocation.style.display = 'block';
        this.selectedLocation.querySelector('.address').textContent = location.display_name;
        this.selectedLocation.querySelector('.coordinates').textContent = 
            `${location.lat}, ${location.lon}`;
        
        this.resultsContainer.style.display = 'none';
        this.searchInput.value = location.display_name;

        // Store selected location
        this.selectedLocationData = {
            address: location.display_name,
            lat: location.lat,
            lon: location.lon
        };
    }

    async placeOrder() {
        if (!this.selectedLocationData) {
            alert('Please select a delivery location');
            return;
        }

        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

        const orderData = {
            cart: JSON.parse(localStorage.getItem('cart')),
            location: this.selectedLocationData,
            paymentMethod: paymentMethod
        };

        try {
            // Here you would send the order to your backend
            console.log('Placing order:', orderData);
            this.closePanel();
            showNotification('Order placed successfully!');
        } catch (error) {
            console.error('Error placing order:', error);
            showNotification('Error placing order', 'error');
        }
    }

    openPanel() {
        this.panel.classList.add('active');
    }

    closePanel() {
        this.panel.classList.remove('active');
    }
}

// Initialize the order panel
const orderPanel = new OrderPanel();