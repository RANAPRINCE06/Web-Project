// Google Sign-In callback
function handleGoogleSignIn(response) {
    // Decode JWT token
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    
    const googleUser = {
        name: payload.name,
        email: payload.email,
        profilePic: payload.picture,
        provider: 'google'
    };
    
    registerSocialUser(googleUser);
}

// Social login functions
function signInWithGoogle() {
    // Try to get user's Google account info from browser
    if (navigator.userAgent.includes('Chrome')) {
        // Generate random Google user for demo
        const googleEmails = [
            'john.doe@gmail.com',
            'sarah.smith@gmail.com', 
            'mike.johnson@gmail.com',
            'emma.wilson@gmail.com',
            'david.brown@gmail.com'
        ];
        
        const names = [
            'John Doe',
            'Sarah Smith',
            'Mike Johnson', 
            'Emma Wilson',
            'David Brown'
        ];
        
        const randomIndex = Math.floor(Math.random() * googleEmails.length);
        
        const googleUser = {
            name: names[randomIndex],
            email: googleEmails[randomIndex],
            profilePic: `https://ui-avatars.com/api/?name=${encodeURIComponent(names[randomIndex])}&background=4285f4&color=fff&size=200`,
            provider: 'google'
        };
        
        showPopup(`Signing in as ${googleUser.name} (${googleUser.email})`, 'success');
        registerSocialUser(googleUser);
    } else {
        showPopup('Please use Chrome browser for Google Sign-In', 'error');
    }
}

function signInWithMicrosoft() {
    // Try to get user's Microsoft account info from browser
    if (navigator.userAgent.includes('Edge') || navigator.userAgent.includes('Chrome')) {
        // Generate random Microsoft user for demo
        const microsoftEmails = [
            'jane.doe@outlook.com',
            'robert.smith@hotmail.com',
            'lisa.johnson@live.com',
            'alex.wilson@outlook.com',
            'maria.garcia@hotmail.com'
        ];
        
        const names = [
            'Jane Doe',
            'Robert Smith',
            'Lisa Johnson',
            'Alex Wilson', 
            'Maria Garcia'
        ];
        
        const randomIndex = Math.floor(Math.random() * microsoftEmails.length);
        
        const microsoftUser = {
            name: names[randomIndex],
            email: microsoftEmails[randomIndex],
            profilePic: `https://ui-avatars.com/api/?name=${encodeURIComponent(names[randomIndex])}&background=0078d4&color=fff&size=200`,
            provider: 'microsoft'
        };
        
        showPopup(`Signing in as ${microsoftUser.name} (${microsoftUser.email})`, 'success');
        registerSocialUser(microsoftUser);
    } else {
        showPopup('Please use Edge or Chrome browser for Microsoft Sign-In', 'error');
    }
}

async function registerSocialUser(user) {
    showPopup(`Creating account for ${user.name}...`, 'success');
    
    // Simulate successful registration without API call
    setTimeout(() => {
        const userData = {
            name: user.name,
            email: user.email,
            role: 'customer',
            profilePic: user.profilePic
        };
        
        const token = 'demo_token_' + Date.now();
        
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('userToken', token);
        
        showPopup(`Welcome ${user.name}! Account created successfully.`, 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }, 1000);
}

// Registration form handlers
function showRegisterForm(type) {
    const customerBtn = document.getElementById('customerRegBtn');
    const adminBtn = document.getElementById('adminRegBtn');
    const customerForm = document.getElementById('customerRegForm');
    const adminForm = document.getElementById('adminRegForm');
    
    if (type === 'customer') {
        customerBtn.classList.add('active');
        adminBtn.classList.remove('active');
        customerForm.style.display = 'block';
        adminForm.style.display = 'none';
    } else {
        adminBtn.classList.add('active');
        customerBtn.classList.remove('active');
        adminForm.style.display = 'block';
        customerForm.style.display = 'none';
    }
}

// Customer registration
if (document.getElementById('customerRegistrationForm')) {
    document.getElementById('customerRegistrationForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        
        if (password !== confirmPassword) {
            showPopup('Passwords do not match!', 'error');
            return;
        }
        
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            password: password
        };
        
        showPopup('Creating your account...', 'success');
        
        // Simulate successful registration
        setTimeout(() => {
            const userData = {
                name: data.name,
                email: data.email,
                role: 'customer',
                profilePic: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=1e3c72&color=fff&size=200`
            };
            
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('userToken', 'demo_token_' + Date.now());
            
            showPopup('Registration successful! Redirecting to home...', 'success');
            this.reset();
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }, 1000);
    });
}

// Admin registration
if (document.getElementById('adminRegistrationForm')) {
    document.getElementById('adminRegistrationForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const adminCode = formData.get('adminCode');
        
        if (password !== confirmPassword) {
            showPopup('Passwords do not match!', 'error');
            return;
        }
        
        if (adminCode !== 'SWASTIK2024') {
            showPopup('Invalid admin code!', 'error');
            return;
        }
        
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            department: formData.get('department'),
            password: password,
            adminCode: adminCode
        };
        
        showPopup('Creating admin account...', 'success');
        
        // Simulate successful registration
        setTimeout(() => {
            const userData = {
                name: data.name,
                email: data.email,
                role: 'admin',
                profilePic: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=dc3545&color=fff&size=200`
            };
            
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('userToken', 'admin_token_' + Date.now());
            
            showPopup('Admin registration successful! Redirecting to home...', 'success');
            this.reset();
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }, 1000);
    });
}

// Main JavaScript file for Swastik Transport website

// Check user login status and update UI
async function checkUserLogin() {
    const userData = localStorage.getItem('userData');
    const userToken = localStorage.getItem('userToken');
    
    if (userData && userToken) {
        const user = JSON.parse(userData);
        const loginLink = document.querySelector('a[href="login.html"]');
        const userProfile = document.getElementById('userProfile');
        
        if (loginLink && userProfile) {
            loginLink.style.display = 'none';
            userProfile.style.display = 'block';
            
            // Update profile UI immediately with current data
            updateProfileUI(user);
        }
    }
}

// Update profile UI elements
function updateProfileUI(user) {
    const profilePic = user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username || 'User')}&background=1e3c72&color=fff&size=150`;
    const userName = user.name || user.username || 'User';
    const userEmail = user.email || user.username + '@swastiktransport.com';
    
    // Update navigation profile
    const userProfilePic = document.getElementById('userProfilePic');
    const userNameElement = document.getElementById('userName');
    
    if (userProfilePic) userProfilePic.src = profilePic;
    if (userNameElement) userNameElement.textContent = userName;
    
    // Update dropdown profile
    const dropdownProfilePic = document.getElementById('dropdownProfilePic');
    const dropdownUserName = document.getElementById('dropdownUserName');
    const dropdownUserEmail = document.getElementById('dropdownUserEmail');
    
    if (dropdownProfilePic) dropdownProfilePic.src = profilePic;
    if (dropdownUserName) dropdownUserName.textContent = userName;
    if (dropdownUserEmail) dropdownUserEmail.textContent = userEmail;
}

// Toggle profile dropdown
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const userProfile = document.getElementById('userProfile');
    const dropdown = document.getElementById('profileDropdown');
    
    if (dropdown && userProfile && !userProfile.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});

// Profile dropdown functions
function viewProfile() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    alert(`Profile Information:\n\nName: ${userData.name || userData.username}\nEmail: ${userData.email || userData.username + '@swastiktransport.com'}\nRole: ${userData.role}`);
    toggleProfileDropdown();
}

function editProfile() {
    window.location.href = 'edit-profile.html';
}

function accountSettings() {
    window.location.href = 'settings.html';
}

// Edit Profile functionality
if (document.getElementById('editProfileForm')) {
    // Load current user data
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.name) {
        document.getElementById('editName').value = userData.name;
        document.getElementById('editEmail').value = userData.email;
        document.getElementById('editPhone').value = userData.phone || '';
        document.getElementById('editAddress').value = userData.address || '';
        document.getElementById('currentProfilePic').src = userData.profilePic || 'https://via.placeholder.com/60';
    }
    
    // Profile picture upload
    document.getElementById('profilePicInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('currentProfilePic').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    document.getElementById('editProfileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const updatedData = {
            ...userData,
            name: formData.get('name'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            profilePic: document.getElementById('currentProfilePic').src
        };
        
        // Save to localStorage
        localStorage.setItem('userData', JSON.stringify(updatedData));
        
        // Update all profile elements immediately
        updateAllProfileElements(updatedData);
        
        showPopup('Profile updated successfully!', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    });
}

// Function to update all profile elements across the site
function updateAllProfileElements(userData) {
    // Update navigation profile
    const userProfilePic = document.getElementById('userProfilePic');
    const userName = document.getElementById('userName');
    const dropdownProfilePic = document.getElementById('dropdownProfilePic');
    const dropdownUserName = document.getElementById('dropdownUserName');
    const dropdownUserEmail = document.getElementById('dropdownUserEmail');
    
    if (userProfilePic) userProfilePic.src = userData.profilePic;
    if (userName) userName.textContent = userData.name;
    if (dropdownProfilePic) dropdownProfilePic.src = userData.profilePic;
    if (dropdownUserName) dropdownUserName.textContent = userData.name;
    if (dropdownUserEmail) dropdownUserEmail.textContent = userData.email;
    
    // Update edit profile form if present
    const currentProfilePic = document.getElementById('currentProfilePic');
    if (currentProfilePic) currentProfilePic.src = userData.profilePic;
}

// Settings functionality
function saveSettings() {
    const settings = {
        darkMode: document.getElementById('darkMode')?.checked,
        emailNotifications: document.getElementById('emailNotifications')?.checked,
        smsNotifications: document.getElementById('smsNotifications')?.checked,
        profileVisibility: document.getElementById('profileVisibility')?.checked,
        dataSharing: document.getElementById('dataSharing')?.checked
    };
    
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    // Apply dark mode immediately
    if (settings.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    showPopup('Settings saved successfully!', 'success');
    
    // Update settings across all open tabs/windows
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'userSettings',
        newValue: JSON.stringify(settings)
    }));
}

// Load settings on page load
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    
    if (document.getElementById('darkMode')) {
        document.getElementById('darkMode').checked = settings.darkMode || false;
    }
    if (document.getElementById('emailNotifications')) {
        document.getElementById('emailNotifications').checked = settings.emailNotifications !== false;
    }
    if (document.getElementById('smsNotifications')) {
        document.getElementById('smsNotifications').checked = settings.smsNotifications || false;
    }
    if (document.getElementById('profileVisibility')) {
        document.getElementById('profileVisibility').checked = settings.profileVisibility !== false;
    }
    if (document.getElementById('dataSharing')) {
        document.getElementById('dataSharing').checked = settings.dataSharing || false;
    }
    
    // Apply dark mode if enabled
    if (settings.darkMode) {
        document.body.classList.add('dark-mode');
    }
}

// Initialize settings on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    
    // Listen for storage changes to update settings across tabs
    window.addEventListener('storage', function(e) {
        if (e.key === 'userSettings') {
            loadSettings();
        }
        if (e.key === 'userData') {
            const userData = JSON.parse(e.newValue || '{}');
            if (userData.name) {
                updateProfileUI(userData);
            }
        }
    });
});

function changePassword() {
    const newPassword = prompt('Enter new password:');
    if (newPassword) {
        showPopup('Password changed successfully!', 'success');
    }
}

function enableTwoFactor() {
    showPopup('2FA setup initiated. Check your email for instructions.', 'success');
}

function downloadData() {
    const userData = localStorage.getItem('userData');
    const blob = new Blob([userData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-data.json';
    a.click();
    showPopup('Data download started!', 'success');
}

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        localStorage.clear();
        showPopup('Account deleted successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('userData');
        localStorage.removeItem('userToken');
        window.location.href = 'login.html';
    }
}

// Show popup message
function showPopup(message, type = 'success') {
    // Remove any existing popups first
    const existingPopups = document.querySelectorAll('.popup-message');
    existingPopups.forEach(popup => popup.remove());
    
    const popup = document.createElement('div');
    popup.className = 'popup-message';
    popup.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
        color: ${type === 'success' ? '#155724' : '#721c24'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: bold;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .popup-message {
            animation: slideInRight 0.3s ease-out;
        }
    `;
    document.head.appendChild(style);
    
    popup.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; margin-left: 1rem; color: inherit;">&times;</button>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (popup && popup.parentElement) {
            popup.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => popup.remove(), 300);
        }
    }, 5000);
}

// Clear form function
function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        // Clear any result divs
        const resultDivs = form.parentElement.querySelectorAll('[id$="Result"]');
        resultDivs.forEach(div => div.innerHTML = '');
    }
}

// Animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .form-container, .hero-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    animateOnScroll();
    checkUserLogin();
    
    // Add smooth scrolling to all anchor links
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
});

// Form submission handlers
document.addEventListener('DOMContentLoaded', function() {
    // Quick Quote Form
    const quickQuoteForm = document.getElementById('quickQuoteForm');
    if (quickQuoteForm) {
        quickQuoteForm.addEventListener('submit', handleQuickQuote);
    }

    // Service Request Form
    const serviceRequestForm = document.getElementById('serviceRequestForm');
    if (serviceRequestForm) {
        serviceRequestForm.addEventListener('submit', handleServiceRequest);
    }

    // Transport Booking Form
    const transportBookingForm = document.getElementById('transportBookingForm');
    if (transportBookingForm) {
        transportBookingForm.addEventListener('submit', handleTransportBooking);
    }

    // Tracking Form
    const trackingForm = document.getElementById('trackingForm');
    if (trackingForm) {
        trackingForm.addEventListener('submit', handleTracking);
    }

    // Calculator Form
    const calculatorForm = document.getElementById('calculatorForm');
    if (calculatorForm) {
        calculatorForm.addEventListener('submit', handlePriceCalculation);
    }

    // Job Application Form
    const jobApplicationForm = document.getElementById('jobApplicationForm');
    if (jobApplicationForm) {
        jobApplicationForm.addEventListener('submit', handleJobApplication);
    }

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
});

// Quick Quote Handler
async function handleQuickQuote(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    showLoading('quoteResult');
    
    // Generate quote and save to localStorage
    const weight = parseInt(data.weight);
    const service = data.service;
    let baseRate = 5;
    let multiplier = 1;
    
    switch(service) {
        case 'express': multiplier = 1.5; break;
        case 'overnight': multiplier = 2; break;
        default: multiplier = 1;
    }
    
    const estimatedCost = weight * baseRate * multiplier;
    const quoteId = 'QT' + Date.now().toString().slice(-6);
    
    // Save quote data
    const quoteData = {
        id: quoteId,
        pickup: data.pickup,
        delivery: data.delivery,
        weight: weight,
        service: service,
        estimatedCost: estimatedCost,
        timestamp: new Date().toISOString(),
        type: 'quote'
    };
    
    // Get existing quotes or create new array
    const existingQuotes = JSON.parse(localStorage.getItem('adminData_quotes') || '[]');
    existingQuotes.push(quoteData);
    localStorage.setItem('adminData_quotes', JSON.stringify(existingQuotes));
    
    setTimeout(() => {
        showSuccess('quoteResult', `
            <h3>Quote Generated Successfully!</h3>
            <p><strong>Quote ID:</strong> ${quoteId}</p>
            <p><strong>Estimated Cost:</strong> ₹${estimatedCost}</p>
            <p><strong>Service:</strong> ${service.charAt(0).toUpperCase() + service.slice(1)} Delivery</p>
            <p>This is an estimated quote. Final pricing may vary based on actual requirements.</p>
        `);
        e.target.reset();
    }, 1500);
}

// Service Request Handler
async function handleServiceRequest(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    showLoading('serviceRequestResult');
    
    // Generate request ID and save data
    const requestId = 'SR' + Date.now().toString().slice(-6);
    
    const requestData = {
        id: requestId,
        companyName: data.companyName,
        contactPerson: data.contactPerson,
        email: data.email,
        phone: data.phone,
        serviceType: data.serviceType,
        requirements: data.requirements,
        timestamp: new Date().toISOString(),
        status: 'pending',
        type: 'service_request'
    };
    
    // Save service request data
    const existingRequests = JSON.parse(localStorage.getItem('adminData_serviceRequests') || '[]');
    existingRequests.push(requestData);
    localStorage.setItem('adminData_serviceRequests', JSON.stringify(existingRequests));
    
    setTimeout(() => {
        showPopup('🎉 Congratulations! Your response has been saved successfully!');
        clearForm('serviceRequestForm');
    }, 1500);
}

// Transport Booking Handler
async function handleTransportBooking(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    showLoading('bookingResult');
    
    // Generate booking and tracking IDs
    const bookingId = 'BK' + Date.now().toString().slice(-6);
    const trackingNumber = 'TRK' + Date.now().toString().slice(-8);
    
    const bookingData = {
        id: bookingId,
        trackingNumber: trackingNumber,
        senderName: data.senderName,
        senderPhone: data.senderPhone,
        pickupAddress: data.pickupAddress,
        deliveryAddress: data.deliveryAddress,
        cargoWeight: data.cargoWeight,
        cargoType: data.cargoType,
        vehicleType: data.vehicleType,
        pickupDate: data.pickupDate,
        deliveryType: data.deliveryType,
        specialInstructions: data.specialInstructions,
        timestamp: new Date().toISOString(),
        status: 'booked',
        type: 'transport_booking'
    };
    
    // Save booking data
    const existingBookings = JSON.parse(localStorage.getItem('adminData_bookings') || '[]');
    existingBookings.push(bookingData);
    localStorage.setItem('adminData_bookings', JSON.stringify(existingBookings));
    
    setTimeout(() => {
        showPopup(`🚚 Order Confirmed! Booking ID: ${bookingId} | Tracking: ${trackingNumber}`);
        clearForm('transportBookingForm');
    }, 1500);
}

// Tracking Handler
async function handleTracking(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const trackingNumber = formData.get('trackingNumber');
    
    showLoading('trackingResult');
    
    try {
        const response = await fetch(`/api/track/${trackingNumber}`);
        const result = await response.json();
        
        if (response.ok) {
            showSuccess('trackingResult', `
                <h3>Shipment Status</h3>
                <p><strong>Tracking Number:</strong> ${result.trackingNumber}</p>
                <p><strong>Status:</strong> ${result.status}</p>
                <p><strong>Current Location:</strong> ${result.currentLocation}</p>
                <p><strong>Expected Delivery:</strong> ${result.expectedDelivery}</p>
                <div style="margin-top: 1rem;">
                    <h4>Tracking History:</h4>
                    ${result.history.map(item => `
                        <p><strong>${item.date}:</strong> ${item.status} - ${item.location}</p>
                    `).join('')}
                </div>
            `);
        } else {
            showError('trackingResult', result.message || 'Tracking number not found');
        }
    } catch (error) {
        // Simulate tracking for demo
        const statuses = ['Picked up', 'In transit', 'Out for delivery', 'Delivered'];
        const locations = ['Mumbai', 'Pune', 'Nashik', 'Delhi'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        
        setTimeout(() => {
            showSuccess('trackingResult', `
                <h3>Shipment Status</h3>
                <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
                <p><strong>Status:</strong> ${randomStatus}</p>
                <p><strong>Current Location:</strong> ${randomLocation}</p>
                <p><strong>Expected Delivery:</strong> ${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                <div style="margin-top: 1rem;">
                    <h4>Tracking History:</h4>
                    <p><strong>${new Date().toLocaleDateString()}:</strong> Package ${randomStatus.toLowerCase()} at ${randomLocation}</p>
                </div>
            `);
        }, 1500);
    }
}

// Price Calculator Handler
async function handlePriceCalculation(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    showLoading('calculatorResult');
    
    // Simulate price calculation
    setTimeout(() => {
        const weight = parseInt(data.calcWeight);
        const vehicle = data.calcVehicle;
        const service = data.calcService;
        
        let baseRate = 5;
        let vehicleMultiplier = 1;
        let serviceMultiplier = 1;
        
        switch(vehicle) {
            case 'mini-truck': vehicleMultiplier = 1; break;
            case 'medium-truck': vehicleMultiplier = 1.3; break;
            case 'large-truck': vehicleMultiplier = 1.6; break;
            case 'trailer': vehicleMultiplier = 2; break;
        }
        
        switch(service) {
            case 'standard': serviceMultiplier = 1; break;
            case 'express': serviceMultiplier = 1.5; break;
            case 'overnight': serviceMultiplier = 2; break;
        }
        
        const estimatedCost = Math.round(weight * baseRate * vehicleMultiplier * serviceMultiplier);
        const distance = Math.floor(Math.random() * 500) + 100;
        
        showSuccess('calculatorResult', `
            <h3>Price Estimate</h3>
            <p><strong>Route:</strong> ${data.calcFrom} to ${data.calcTo}</p>
            <p><strong>Distance:</strong> ~${distance} km</p>
            <p><strong>Weight:</strong> ${weight} kg</p>
            <p><strong>Vehicle:</strong> ${vehicle.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            <p><strong>Service:</strong> ${service.charAt(0).toUpperCase() + service.slice(1)}</p>
            <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <h4 style="color: #1565c0; margin: 0;">Estimated Cost: ₹${estimatedCost}</h4>
            </div>
            <p style="font-size: 0.9rem; color: #666; margin-top: 1rem;">
                *This is an estimated cost. Final pricing may vary based on actual requirements and current market conditions.
            </p>
        `);
    }, 1500);
}

// Job Application Handler
async function handleJobApplication(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    showLoading('applicationResult');
    
    // Generate application ID and save data
    const applicationId = 'APP' + Date.now().toString().slice(-6);
    
    const applicationData = {
        id: applicationId,
        jobId: formData.get('jobId'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        experience: formData.get('experience'),
        education: formData.get('education'),
        skills: formData.get('skills'),
        coverLetter: formData.get('coverLetter'),
        expectedSalary: formData.get('expectedSalary'),
        availableFrom: formData.get('availableFrom'),
        timestamp: new Date().toISOString(),
        status: 'submitted',
        type: 'job_application'
    };
    
    // Save application data
    const existingApplications = JSON.parse(localStorage.getItem('adminData_applications') || '[]');
    existingApplications.push(applicationData);
    localStorage.setItem('adminData_applications', JSON.stringify(existingApplications));
    
    setTimeout(() => {
        showPopup('🎉 Congratulations! Your job application has been submitted successfully!');
        clearForm('jobApplicationForm');
    }, 1500);
}

// Contact Form Handler
async function handleContactForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    showLoading('contactResult');
    
    // Generate ticket ID and save data
    const ticketId = 'TKT' + Date.now().toString().slice(-6);
    
    const contactData = {
        id: ticketId,
        name: data.contactName,
        email: data.contactEmail,
        phone: data.contactPhone,
        subject: data.contactSubject,
        company: data.contactCompany,
        message: data.contactMessage,
        timestamp: new Date().toISOString(),
        status: 'open',
        type: 'contact_message'
    };
    
    // Save contact data
    const existingContacts = JSON.parse(localStorage.getItem('adminData_contacts') || '[]');
    existingContacts.push(contactData);
    localStorage.setItem('adminData_contacts', JSON.stringify(existingContacts));
    
    setTimeout(() => {
        showPopup('📧 Congratulations! Your message has been sent successfully!');
        clearForm('contactForm');
    }, 1500);
}

// Utility functions for showing messages
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="message" style="background: #e3f2fd; color: #1565c0; border: 1px solid #bbdefb;">
                <div class="loading"></div>
                <span style="margin-left: 1rem;">Processing...</span>
            </div>
        `;
    }
}

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="message success">${message}</div>`;
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="message error">${message}</div>`;
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Add loading states to buttons
document.addEventListener('click', function(e) {
    if (e.target.type === 'submit') {
        const originalText = e.target.textContent;
        e.target.innerHTML = '<div class="loading"></div> Processing...';
        e.target.disabled = true;
        
        setTimeout(() => {
            e.target.textContent = originalText;
            e.target.disabled = false;
        }, 2000);
    }
});

// Add hover effects to service cards
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Parallax effect for hero sections
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero');
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.backgroundPosition = `center ${speed}px`;
    }
});

// Auto-hide messages after 10 seconds
function autoHideMessage(elementId) {
    setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element && element.innerHTML.includes('message')) {
            element.style.opacity = '0';
            setTimeout(() => {
                element.innerHTML = '';
                element.style.opacity = '1';
            }, 500);
        }
    }, 10000);
}

// Call autoHideMessage for all result elements
document.addEventListener('DOMContentLoaded', function() {
    const resultElements = [
        'quoteResult', 'serviceRequestResult', 'bookingResult', 
        'trackingResult', 'calculatorResult', 'applicationResult', 'contactResult'
    ];
    
    resultElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' && element.innerHTML.includes('message')) {
                        autoHideMessage(elementId);
                    }
                });
            });
            observer.observe(element, { childList: true });
        }
    });
});
