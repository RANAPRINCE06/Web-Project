// Main JavaScript file for Swastik Transport website

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
    
    try {
        const response = await fetch('/api/quote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showSuccess('quoteResult', `
                <h3>Quote Generated Successfully!</h3>
                <p><strong>Quote ID:</strong> ${result.quoteId}</p>
                <p><strong>Estimated Cost:</strong> ₹${result.estimatedCost}</p>
                <p><strong>Delivery Time:</strong> ${result.deliveryTime}</p>
                <p><strong>Distance:</strong> ${result.distance} km</p>
                <p>A detailed quote has been sent to your email.</p>
            `);
        } else {
            showError('quoteResult', result.message || 'Failed to generate quote');
        }
    } catch (error) {
        // Simulate quote generation for demo
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
        
        setTimeout(() => {
            showSuccess('quoteResult', `
                <h3>Quote Generated Successfully!</h3>
                <p><strong>Quote ID:</strong> ${quoteId}</p>
                <p><strong>Estimated Cost:</strong> ₹${estimatedCost}</p>
                <p><strong>Service:</strong> ${service.charAt(0).toUpperCase() + service.slice(1)} Delivery</p>
                <p>This is an estimated quote. Final pricing may vary based on actual requirements.</p>
            `);
        }, 1500);
    }
}

// Service Request Handler
async function handleServiceRequest(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    showLoading('serviceRequestResult');
    
    try {
        const response = await fetch('/api/service-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showSuccess('serviceRequestResult', `
                <h3>Service Request Submitted!</h3>
                <p><strong>Request ID:</strong> ${result.requestId}</p>
                <p>Our team will contact you within 24 hours to discuss your requirements.</p>
            `);
            e.target.reset();
        } else {
            showError('serviceRequestResult', result.message || 'Failed to submit request');
        }
    } catch (error) {
        // Simulate success for demo
        const requestId = 'SR' + Date.now().toString().slice(-6);
        setTimeout(() => {
            showSuccess('serviceRequestResult', `
                <h3>Service Request Submitted!</h3>
                <p><strong>Request ID:</strong> ${requestId}</p>
                <p>Our team will contact you within 24 hours to discuss your requirements.</p>
            `);
            e.target.reset();
        }, 1500);
    }
}

// Transport Booking Handler
async function handleTransportBooking(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    showLoading('bookingResult');
    
    try {
        const response = await fetch('/api/transport-booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showSuccess('bookingResult', `
                <h3>Transport Booked Successfully!</h3>
                <p><strong>Booking ID:</strong> ${result.bookingId}</p>
                <p><strong>Tracking Number:</strong> ${result.trackingNumber}</p>
                <p><strong>Pickup Date:</strong> ${data.pickupDate}</p>
                <p>You will receive SMS and email confirmations shortly.</p>
            `);
            e.target.reset();
        } else {
            showError('bookingResult', result.message || 'Failed to book transport');
        }
    } catch (error) {
        // Simulate success for demo
        const bookingId = 'BK' + Date.now().toString().slice(-6);
        const trackingNumber = 'TRK' + Date.now().toString().slice(-8);
        
        setTimeout(() => {
            showSuccess('bookingResult', `
                <h3>Transport Booked Successfully!</h3>
                <p><strong>Booking ID:</strong> ${bookingId}</p>
                <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
                <p><strong>Pickup Date:</strong> ${data.pickupDate}</p>
                <p>You will receive SMS and email confirmations shortly.</p>
            `);
            e.target.reset();
        }, 1500);
    }
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
    
    try {
        const response = await fetch('/api/job-application', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showSuccess('applicationResult', `
                <h3>Application Submitted Successfully!</h3>
                <p><strong>Application ID:</strong> ${result.applicationId}</p>
                <p>Thank you for your interest in joining our team. We will review your application and contact you within 5-7 business days.</p>
            `);
            e.target.reset();
        } else {
            showError('applicationResult', result.message || 'Failed to submit application');
        }
    } catch (error) {
        // Simulate success for demo
        const applicationId = 'APP' + Date.now().toString().slice(-6);
        setTimeout(() => {
            showSuccess('applicationResult', `
                <h3>Application Submitted Successfully!</h3>
                <p><strong>Application ID:</strong> ${applicationId}</p>
                <p>Thank you for your interest in joining our team. We will review your application and contact you within 5-7 business days.</p>
            `);
            e.target.reset();
        }, 1500);
    }
}

// Contact Form Handler
async function handleContactForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    showLoading('contactResult');
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showSuccess('contactResult', `
                <h3>Message Sent Successfully!</h3>
                <p><strong>Ticket ID:</strong> ${result.ticketId}</p>
                <p>Thank you for contacting us. We will respond to your inquiry within 24 hours.</p>
            `);
            e.target.reset();
        } else {
            showError('contactResult', result.message || 'Failed to send message');
        }
    } catch (error) {
        // Simulate success for demo
        const ticketId = 'TKT' + Date.now().toString().slice(-6);
        setTimeout(() => {
            showSuccess('contactResult', `
                <h3>Message Sent Successfully!</h3>
                <p><strong>Ticket ID:</strong> ${ticketId}</p>
                <p>Thank you for contacting us. We will respond to your inquiry within 24 hours.</p>
            `);
            e.target.reset();
        }, 1500);
    }
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