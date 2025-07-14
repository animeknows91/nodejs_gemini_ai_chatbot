// Global variables
let currentSearchType = 'flights';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Initialize mobile navigation
    initMobileNavigation();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize form validations
    initFormValidations();
    
    // Set default dates
    setDefaultDates();
    
    // Initialize observers for animations
    initScrollAnimations();
}

// Mobile Navigation
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Tab Switching Functionality
function switchTab(tabType) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector(`.tab-btn[onclick="switchTab('${tabType}')"]`).classList.add('active');
    
    // Hide all forms
    document.querySelectorAll('.search-form').forEach(form => {
        form.style.display = 'none';
    });
    
    // Show selected form
    document.getElementById(`${tabType}-form`).style.display = 'block';
    
    currentSearchType = tabType;
}

// Search Functions
function searchFlights() {
    const departure = document.getElementById('departure').value;
    const destination = document.getElementById('destination').value;
    const departureDate = document.getElementById('departure-date').value;
    const returnDate = document.getElementById('return-date').value;
    const passengers = document.getElementById('passengers').value;
    
    if (!departure || !destination || !departureDate) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }
    
    const searchData = {
        type: 'flights',
        departure,
        destination,
        departureDate,
        returnDate,
        passengers
    };
    
    showSearchResults(searchData);
}

function searchHotels() {
    const destination = document.getElementById('hotel-destination').value;
    const checkinDate = document.getElementById('checkin-date').value;
    const checkoutDate = document.getElementById('checkout-date').value;
    const guests = document.getElementById('guests').value;
    
    if (!destination || !checkinDate || !checkoutDate) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }
    
    const searchData = {
        type: 'hotels',
        destination,
        checkinDate,
        checkoutDate,
        guests
    };
    
    showSearchResults(searchData);
}

function searchPackages() {
    const destination = document.getElementById('package-destination').value;
    const duration = document.getElementById('duration').value;
    const budget = document.getElementById('budget').value;
    const travelers = document.getElementById('travelers').value;
    
    if (!destination) {
        showAlert('Please enter a destination', 'error');
        return;
    }
    
    const searchData = {
        type: 'packages',
        destination,
        duration,
        budget,
        travelers
    };
    
    showSearchResults(searchData);
}

// Show Search Results
function showSearchResults(searchData) {
    const modal = document.getElementById('resultsModal');
    const title = document.getElementById('resultsTitle');
    const content = document.getElementById('resultsContent');
    
    title.textContent = `${capitalizeFirst(searchData.type)} Search Results`;
    
    let resultsHTML = '';
    
    if (searchData.type === 'flights') {
        resultsHTML = generateFlightResults(searchData);
    } else if (searchData.type === 'hotels') {
        resultsHTML = generateHotelResults(searchData);
    } else if (searchData.type === 'packages') {
        resultsHTML = generatePackageResults(searchData);
    }
    
    content.innerHTML = resultsHTML;
    modal.style.display = 'block';
    
    showAlert(`Found ${getRandomNumber(5, 15)} ${searchData.type} for your search!`, 'success');
}

// Generate Flight Results
function generateFlightResults(data) {
    const flights = [
        { airline: 'BlueWave Airlines', departure: '08:30', arrival: '14:45', price: '$299', duration: '6h 15m' },
        { airline: 'Sky Connect', departure: '11:15', arrival: '17:30', price: '$345', duration: '6h 15m' },
        { airline: 'Global Air', departure: '15:45', arrival: '22:00', price: '$278', duration: '6h 15m' },
        { airline: 'Swift Airways', departure: '19:20', arrival: '01:35+1', price: '$312', duration: '6h 15m' }
    ];
    
    let html = `
        <div style="margin-bottom: 20px; padding: 15px; background: #f8fafe; border-radius: 10px;">
            <h3>Search Details</h3>
            <p><strong>From:</strong> ${data.departure} <strong>To:</strong> ${data.destination}</p>
            <p><strong>Departure:</strong> ${formatDate(data.departureDate)} <strong>Passengers:</strong> ${data.passengers}</p>
            ${data.returnDate ? `<p><strong>Return:</strong> ${formatDate(data.returnDate)}</p>` : ''}
        </div>
        <div class="results-grid">
    `;
    
    flights.forEach((flight, index) => {
        html += `
            <div class="result-card" style="border: 1px solid #e9ecef; border-radius: 10px; padding: 20px; margin-bottom: 15px; background: white;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="color: #1e90ff; margin-bottom: 10px;">${flight.airline}</h4>
                        <p><strong>Departure:</strong> ${flight.departure} <strong>Arrival:</strong> ${flight.arrival}</p>
                        <p><strong>Duration:</strong> ${flight.duration}</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #1e90ff; margin-bottom: 10px;">${flight.price}</div>
                        <button onclick="bookFlight(${index})" style="padding: 10px 20px; background: linear-gradient(45deg, #1e90ff, #87ceeb); color: white; border: none; border-radius: 8px; cursor: pointer;">Select Flight</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Generate Hotel Results
function generateHotelResults(data) {
    const hotels = [
        { name: 'Grand Plaza Hotel', rating: '★★★★★', price: '$199', amenities: ['Free WiFi', 'Pool', 'Spa'] },
        { name: 'City Center Inn', rating: '★★★★☆', price: '$149', amenities: ['Free WiFi', 'Gym', 'Restaurant'] },
        { name: 'Boutique Luxury', rating: '★★★★★', price: '$259', amenities: ['Free WiFi', 'Spa', 'Concierge'] },
        { name: 'Budget Comfort', rating: '★★★☆☆', price: '$89', amenities: ['Free WiFi', 'Parking'] }
    ];
    
    let html = `
        <div style="margin-bottom: 20px; padding: 15px; background: #f8fafe; border-radius: 10px;">
            <h3>Search Details</h3>
            <p><strong>Destination:</strong> ${data.destination}</p>
            <p><strong>Check-in:</strong> ${formatDate(data.checkinDate)} <strong>Check-out:</strong> ${formatDate(data.checkoutDate)}</p>
            <p><strong>Guests:</strong> ${data.guests}</p>
        </div>
        <div class="results-grid">
    `;
    
    hotels.forEach((hotel, index) => {
        html += `
            <div class="result-card" style="border: 1px solid #e9ecef; border-radius: 10px; padding: 20px; margin-bottom: 15px; background: white;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="color: #1e90ff; margin-bottom: 10px;">${hotel.name}</h4>
                        <p style="color: #ffd700; margin-bottom: 10px;">${hotel.rating}</p>
                        <p><strong>Amenities:</strong> ${hotel.amenities.join(', ')}</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #1e90ff; margin-bottom: 10px;">${hotel.price}/night</div>
                        <button onclick="bookHotel('${hotel.name}')" style="padding: 10px 20px; background: linear-gradient(45deg, #1e90ff, #87ceeb); color: white; border: none; border-radius: 8px; cursor: pointer;">Book Hotel</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Generate Package Results
function generatePackageResults(data) {
    const packages = [
        { name: 'Adventure Explorer', duration: '7 Days', price: '$1,299', includes: ['Flights', 'Hotels', 'Tours', 'Meals'] },
        { name: 'Luxury Escape', duration: '5 Days', price: '$1,899', includes: ['Flights', '5-Star Hotels', 'Private Tours', 'All Meals'] },
        { name: 'Budget Discovery', duration: '4 Days', price: '$599', includes: ['Flights', '3-Star Hotels', 'Group Tours'] },
        { name: 'Cultural Journey', duration: '10 Days', price: '$2,199', includes: ['Flights', 'Boutique Hotels', 'Cultural Tours', 'Local Experiences'] }
    ];
    
    let html = `
        <div style="margin-bottom: 20px; padding: 15px; background: #f8fafe; border-radius: 10px;">
            <h3>Search Details</h3>
            <p><strong>Destination:</strong> ${data.destination}</p>
            <p><strong>Duration:</strong> ${data.duration} Days <strong>Budget:</strong> ${capitalizeFirst(data.budget)}</p>
            <p><strong>Travelers:</strong> ${data.travelers}</p>
        </div>
        <div class="results-grid">
    `;
    
    packages.forEach((pkg, index) => {
        html += `
            <div class="result-card" style="border: 1px solid #e9ecef; border-radius: 10px; padding: 20px; margin-bottom: 15px; background: white;">
                <div>
                    <h4 style="color: #1e90ff; margin-bottom: 10px;">${pkg.name}</h4>
                    <p><strong>Duration:</strong> ${pkg.duration}</p>
                    <p><strong>Includes:</strong> ${pkg.includes.join(', ')}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #1e90ff;">${pkg.price}</div>
                        <button onclick="bookPackage('${pkg.name}')" style="padding: 10px 20px; background: linear-gradient(45deg, #1e90ff, #87ceeb); color: white; border: none; border-radius: 8px; cursor: pointer;">Book Package</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Booking Functions
function bookFlight(flightIndex) {
    showAlert('Flight booking initiated! Redirecting to payment...', 'success');
    setTimeout(() => {
        showAlert('This is a demo. In a real app, you would be redirected to a payment gateway.', 'info');
    }, 2000);
    closeResultsModal();
}

function bookHotel(hotelName) {
    showAlert(`Hotel "${hotelName}" booking initiated! Processing...`, 'success');
    setTimeout(() => {
        showAlert('Booking confirmed! Confirmation email will be sent shortly.', 'success');
    }, 2000);
    closeResultsModal();
}

function bookPackage(packageName) {
    showAlert(`Package "${packageName}" booking initiated! Processing...`, 'success');
    setTimeout(() => {
        showAlert('Package booking confirmed! You will receive detailed itinerary via email.', 'success');
    }, 2000);
    closeResultsModal();
}

// Destination Functions
function viewDestination(destination) {
    const destinationInfo = {
        'paris': {
            name: 'Paris, France',
            description: 'The City of Love offers iconic landmarks, world-class museums, and romantic atmosphere.',
            attractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Champs-Élysées'],
            bestTime: 'April to October',
            currency: 'Euro (EUR)'
        },
        'tokyo': {
            name: 'Tokyo, Japan',
            description: 'A fascinating blend of ancient traditions and cutting-edge technology.',
            attractions: ['Tokyo Skytree', 'Sensoji Temple', 'Shibuya Crossing', 'Imperial Palace'],
            bestTime: 'March to May, September to November',
            currency: 'Japanese Yen (JPY)'
        },
        'bali': {
            name: 'Bali, Indonesia',
            description: 'Tropical paradise with beautiful beaches, rice terraces, and rich culture.',
            attractions: ['Uluwatu Temple', 'Rice Terraces', 'Mount Batur', 'Seminyak Beach'],
            bestTime: 'April to October',
            currency: 'Indonesian Rupiah (IDR)'
        },
        'new-york': {
            name: 'New York, USA',
            description: 'The city that never sleeps, full of energy, culture, and endless possibilities.',
            attractions: ['Statue of Liberty', 'Central Park', 'Times Square', 'Brooklyn Bridge'],
            bestTime: 'April to June, September to November',
            currency: 'US Dollar (USD)'
        },
        'santorini': {
            name: 'Santorini, Greece',
            description: 'Stunning volcanic island with white-washed buildings and breathtaking sunsets.',
            attractions: ['Oia Village', 'Red Beach', 'Akrotiri Archaeological Site', 'Fira Town'],
            bestTime: 'April to October',
            currency: 'Euro (EUR)'
        },
        'dubai': {
            name: 'Dubai, UAE',
            description: 'Modern metropolis known for luxury shopping, ultramodern architecture, and nightlife.',
            attractions: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Dubai Marina'],
            bestTime: 'November to March',
            currency: 'UAE Dirham (AED)'
        }
    };
    
    const info = destinationInfo[destination];
    if (info) {
        const modal = document.getElementById('resultsModal');
        const title = document.getElementById('resultsTitle');
        const content = document.getElementById('resultsContent');
        
        title.textContent = info.name;
        content.innerHTML = `
            <div style="padding: 20px;">
                <p style="font-size: 1.1rem; margin-bottom: 20px; line-height: 1.6;">${info.description}</p>
                
                <h4 style="color: #1e90ff; margin-bottom: 10px;">Top Attractions:</h4>
                <ul style="margin-bottom: 20px; padding-left: 20px;">
                    ${info.attractions.map(attr => `<li style="margin-bottom: 5px;">${attr}</li>`).join('')}
                </ul>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div>
                        <h4 style="color: #1e90ff; margin-bottom: 10px;">Best Time to Visit:</h4>
                        <p>${info.bestTime}</p>
                    </div>
                    <div>
                        <h4 style="color: #1e90ff; margin-bottom: 10px;">Currency:</h4>
                        <p>${info.currency}</p>
                    </div>
                </div>
                
                <button onclick="bookDestination('${destination}')" style="width: 100%; padding: 15px; background: linear-gradient(45deg, #1e90ff, #87ceeb); color: white; border: none; border-radius: 10px; font-size: 1.1rem; font-weight: 600; cursor: pointer;">
                    Book Trip to ${info.name}
                </button>
            </div>
        `;
        
        modal.style.display = 'block';
    }
}

function bookDestination(destination) {
    showAlert(`Booking trip to ${destination}! Redirecting to packages...`, 'success');
    closeResultsModal();
    // Simulate redirect to packages section
    setTimeout(() => {
        document.getElementById('packages').scrollIntoView({ behavior: 'smooth' });
    }, 1000);
}

// Modal Functions
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function closeResultsModal() {
    document.getElementById('resultsModal').style.display = 'none';
}

function switchToSignup() {
    showAlert('Signup functionality would be implemented here in a real application.', 'info');
}

// Login Handler
function handleLogin(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    
    if (email && password) {
        showAlert('Login successful! Welcome back!', 'success');
        closeLoginModal();
        
        // Update login button to show user
        setTimeout(() => {
            const loginBtn = document.querySelector('.login-btn');
            loginBtn.textContent = 'Profile';
            loginBtn.onclick = () => showAlert('Profile page would open here in a real application.', 'info');
        }, 1000);
    } else {
        showAlert('Please fill in all fields', 'error');
    }
}

// Contact Form Handler
function submitContact(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    // Simulate form submission
    showAlert('Message sent successfully! We will get back to you within 24 hours.', 'success');
    form.reset();
}

// Utility Functions
function setDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const formatDate = (date) => date.toISOString().split('T')[0];
    
    // Set departure date to tomorrow
    const departureDate = document.getElementById('departure-date');
    const checkinDate = document.getElementById('checkin-date');
    
    if (departureDate) departureDate.value = formatDate(tomorrow);
    if (checkinDate) checkinDate.value = formatDate(tomorrow);
    
    // Set return/checkout date to next week
    const returnDate = document.getElementById('return-date');
    const checkoutDate = document.getElementById('checkout-date');
    
    if (returnDate) returnDate.value = formatDate(nextWeek);
    if (checkoutDate) checkoutDate.value = formatDate(nextWeek);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Alert System
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    const alert = document.createElement('div');
    alert.className = `custom-alert alert-${type}`;
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    alert.textContent = message;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

// Form Validations
function initFormValidations() {
    // Add real-time validation for email fields
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#f44336';
                showAlert('Please enter a valid email address', 'error');
            } else {
                this.style.borderColor = '#e9ecef';
            }
        });
    });
    
    // Add validation for date fields
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                this.style.borderColor = '#f44336';
                showAlert('Please select a future date', 'error');
            } else {
                this.style.borderColor = '#e9ecef';
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.destination-card, .package-card, .hotel-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const loginModal = document.getElementById('loginModal');
    const resultsModal = document.getElementById('resultsModal');
    
    if (event.target === loginModal) {
        closeLoginModal();
    }
    
    if (event.target === resultsModal) {
        closeResultsModal();
    }
});

// Keyboard navigation for modals
window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeLoginModal();
        closeResultsModal();
    }
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);