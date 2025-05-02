# E-Dealership

E-Dealership is a modern web application for a premium performance car dealership, providing an immersive online shopping experience for luxury vehicles.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview

E-Dealership is a fully-featured web application that allows users to browse, search, and purchase premium performance cars online. The application features a responsive design, interactive UI elements, and a comprehensive shopping experience including cart and wishlist functionality.

## Features

- **Browse Vehicles**: View all available vehicles with filtering and sorting options
- **Detailed Vehicle Pages**: Comprehensive information about each vehicle with multiple images
- **Color Selection**: View vehicles in different color options
- **Shopping Cart**: Add vehicles to cart, adjust quantities, and proceed to checkout
- **Wishlist**: Save favorite vehicles for later consideration
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Checkout Process**: Complete purchase flow with delivery options and payment methods
- **Stock Management**: Real-time stock updates and availability notifications

## Technologies Used

- **Frontend**:
  - HTML5, CSS3, JavaScript (ES6+)
  - CSS Animations and Transitions
  - Responsive Design using Flexbox and Grid
  - Custom UI Components

- **Backend**:
  - RESTful API
  - JSON data format
  - Local Storage for cart and wishlist persistence

- **External APIs**:
  - OpenCage Geocoding API for location services

## Project Structure

```
e-dealership/
├── src/
│   ├── frontend/
│   │   ├── assets/
│   │   │   ├── css/         # Stylesheets
│   │   │   ├── icons/       # UI icons
│   │   │   └── images/      # Vehicle and UI images
│   │   ├── js/              # JavaScript files
│   │   ├── pages/           # HTML pages (details, wishlist, etc.)
│   │   └── index.html       # Main homepage
│   └── backend/             # Backend API services
└── README.md                # This file
```

## Installation

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Setup Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/e-dealership.git
   cd e-dealership
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```

5. Use open live server extention from vscode in the index.html file:
   ```
   index.html
   ```

## Usage

### Browsing Vehicles

- The homepage displays all available vehicles
- Use the filter tags to narrow down by price range or other criteria
- Use the sort dropdown to order vehicles by price or popularity
- Click on a vehicle card to view detailed information

### Vehicle Details

- View high-resolution images of the selected vehicle
- Switch between different color options
- See detailed specifications and pricing information
- Add the vehicle to your cart or wishlist

### Shopping Cart

- Access your cart by clicking the cart icon in the navigation bar
- Adjust quantities or remove items
- View subtotal, tax, and total cost
- Proceed to checkout

### Wishlist

- Save vehicles to your wishlist by clicking the heart icon
- View all saved vehicles in the wishlist page
- Move items from wishlist to cart with a single click
- Remove items from your wishlist

### Checkout Process

- Enter delivery information
- Choose delivery method
- Select payment method
- Review and confirm order

## API Documentation

The backend API is available at `http://localhost:8080` with the following endpoints:

- `GET /car`: Get all available cars
- `GET /car/:id`: Get details for a specific car
- `POST /car/updateStock`: Update stock quantities



