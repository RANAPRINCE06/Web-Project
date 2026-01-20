const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'swastik_transport_secret_key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Create uploads directory if it doesn't exist
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.fieldname === 'resume' && file.mimetype === 'application/pdf') {
            cb(null, true);
        } else if (file.fieldname === 'resume') {
            cb(new Error('Only PDF files are allowed for resume'));
        } else {
            cb(null, true);
        }
    }
});

// Initialize SQLite database
const db = new sqlite3.Database('./transport.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Quotes table
    db.run(`CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quote_id TEXT UNIQUE,
        pickup TEXT NOT NULL,
        delivery TEXT NOT NULL,
        weight INTEGER NOT NULL,
        service TEXT NOT NULL,
        estimated_cost REAL,
        distance INTEGER,
        delivery_time TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Service requests table
    db.run(`CREATE TABLE IF NOT EXISTS service_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_id TEXT UNIQUE,
        company_name TEXT NOT NULL,
        contact_person TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        service_type TEXT NOT NULL,
        requirements TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Transport bookings table
    db.run(`CREATE TABLE IF NOT EXISTS transport_bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id TEXT UNIQUE,
        tracking_number TEXT UNIQUE,
        sender_name TEXT NOT NULL,
        sender_phone TEXT NOT NULL,
        pickup_address TEXT NOT NULL,
        delivery_address TEXT NOT NULL,
        cargo_weight INTEGER NOT NULL,
        cargo_type TEXT NOT NULL,
        vehicle_type TEXT NOT NULL,
        pickup_date DATE NOT NULL,
        delivery_type TEXT NOT NULL,
        special_instructions TEXT,
        status TEXT DEFAULT 'booked',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tracking table
    db.run(`CREATE TABLE IF NOT EXISTS tracking (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tracking_number TEXT NOT NULL,
        status TEXT NOT NULL,
        location TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
    )`);

    // Job applications table
    db.run(`CREATE TABLE IF NOT EXISTS job_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_id TEXT UNIQUE,
        job_id INTEGER NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        experience TEXT NOT NULL,
        education TEXT NOT NULL,
        skills TEXT NOT NULL,
        resume_path TEXT,
        cover_letter TEXT NOT NULL,
        expected_salary INTEGER,
        available_from DATE NOT NULL,
        status TEXT DEFAULT 'submitted',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Contact messages table
    db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticket_id TEXT UNIQUE,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        subject TEXT NOT NULL,
        company TEXT,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'open',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Users table (for admin panel)
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log('Database tables initialized');
}

// Utility functions
function generateId(prefix) {
    return prefix + Date.now().toString().slice(-6);
}

function calculatePrice(weight, service, vehicleType = 'medium-truck') {
    let baseRate = 5;
    let serviceMultiplier = 1;
    let vehicleMultiplier = 1;

    switch(service) {
        case 'express': serviceMultiplier = 1.5; break;
        case 'overnight': serviceMultiplier = 2; break;
        default: serviceMultiplier = 1;
    }

    switch(vehicleType) {
        case 'mini-truck': vehicleMultiplier = 1; break;
        case 'medium-truck': vehicleMultiplier = 1.3; break;
        case 'large-truck': vehicleMultiplier = 1.6; break;
        case 'trailer': vehicleMultiplier = 2; break;
        default: vehicleMultiplier = 1.3;
    }

    return Math.round(weight * baseRate * serviceMultiplier * vehicleMultiplier);
}

function getDeliveryTime(service) {
    switch(service) {
        case 'express': return '1-2 business days';
        case 'overnight': return 'Next business day';
        default: return '3-5 business days';
    }
}

// API Routes

// Quick Quote API
app.post('/api/quote', (req, res) => {
    const { pickup, delivery, weight, service } = req.body;
    
    if (!pickup || !delivery || !weight || !service) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const quoteId = generateId('QT');
    const estimatedCost = calculatePrice(parseInt(weight), service);
    const distance = Math.floor(Math.random() * 500) + 100; // Simulated distance
    const deliveryTime = getDeliveryTime(service);

    const query = `INSERT INTO quotes (quote_id, pickup, delivery, weight, service, estimated_cost, distance, delivery_time) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [quoteId, pickup, delivery, weight, service, estimatedCost, distance, deliveryTime], function(err) {
        if (err) {
            console.error('Error saving quote:', err);
            return res.status(500).json({ message: 'Failed to generate quote' });
        }

        res.json({
            quoteId,
            estimatedCost,
            distance,
            deliveryTime
        });
    });
});

// Service Request API
app.post('/api/service-request', (req, res) => {
    const { companyName, contactPerson, email, phone, serviceType, requirements } = req.body;
    
    if (!companyName || !contactPerson || !email || !phone || !serviceType) {
        return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const requestId = generateId('SR');
    
    const query = `INSERT INTO service_requests (request_id, company_name, contact_person, email, phone, service_type, requirements) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [requestId, companyName, contactPerson, email, phone, serviceType, requirements], function(err) {
        if (err) {
            console.error('Error saving service request:', err);
            return res.status(500).json({ message: 'Failed to submit request' });
        }

        res.json({ requestId });
    });
});

// Transport Booking API
app.post('/api/transport-booking', (req, res) => {
    const {
        senderName, senderPhone, pickupAddress, deliveryAddress,
        cargoWeight, cargoType, vehicleType, pickupDate,
        deliveryType, specialInstructions
    } = req.body;
    
    if (!senderName || !senderPhone || !pickupAddress || !deliveryAddress || 
        !cargoWeight || !cargoType || !vehicleType || !pickupDate || !deliveryType) {
        return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const bookingId = generateId('BK');
    const trackingNumber = generateId('TRK');
    
    const query = `INSERT INTO transport_bookings 
                   (booking_id, tracking_number, sender_name, sender_phone, pickup_address, 
                    delivery_address, cargo_weight, cargo_type, vehicle_type, pickup_date, 
                    delivery_type, special_instructions) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [
        bookingId, trackingNumber, senderName, senderPhone, pickupAddress,
        deliveryAddress, cargoWeight, cargoType, vehicleType, pickupDate,
        deliveryType, specialInstructions
    ], function(err) {
        if (err) {
            console.error('Error saving booking:', err);
            return res.status(500).json({ message: 'Failed to book transport' });
        }

        // Add initial tracking entry
        const trackingQuery = `INSERT INTO tracking (tracking_number, status, location, notes) 
                              VALUES (?, ?, ?, ?)`;
        db.run(trackingQuery, [trackingNumber, 'Booked', 'Booking confirmed', 'Transport booking confirmed']);

        res.json({ bookingId, trackingNumber });
    });
});

// Tracking API
app.get('/api/track/:trackingNumber', (req, res) => {
    const { trackingNumber } = req.params;
    
    const query = `SELECT * FROM tracking WHERE tracking_number = ? ORDER BY timestamp DESC`;
    
    db.all(query, [trackingNumber], (err, rows) => {
        if (err) {
            console.error('Error fetching tracking info:', err);
            return res.status(500).json({ message: 'Failed to fetch tracking information' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Tracking number not found' });
        }

        const latest = rows[0];
        const history = rows.map(row => ({
            date: new Date(row.timestamp).toLocaleDateString(),
            status: row.status,
            location: row.location,
            notes: row.notes
        }));

        res.json({
            trackingNumber,
            status: latest.status,
            currentLocation: latest.location,
            expectedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            history
        });
    });
});

// Job Application API
app.post('/api/job-application', upload.single('resume'), (req, res) => {
    const {
        jobId, firstName, lastName, email, phone, address,
        experience, education, skills, coverLetter,
        expectedSalary, availableFrom
    } = req.body;
    
    if (!jobId || !firstName || !lastName || !email || !phone || 
        !address || !experience || !education || !skills || !coverLetter || !availableFrom) {
        return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const applicationId = generateId('APP');
    const resumePath = req.file ? req.file.path : null;
    
    const query = `INSERT INTO job_applications 
                   (application_id, job_id, first_name, last_name, email, phone, address,
                    experience, education, skills, resume_path, cover_letter, 
                    expected_salary, available_from) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [
        applicationId, jobId, firstName, lastName, email, phone, address,
        experience, education, skills, resumePath, coverLetter,
        expectedSalary, availableFrom
    ], function(err) {
        if (err) {
            console.error('Error saving job application:', err);
            return res.status(500).json({ message: 'Failed to submit application' });
        }

        res.json({ applicationId });
    });
});

// Contact Form API
app.post('/api/contact', (req, res) => {
    const { contactName, contactEmail, contactPhone, contactSubject, contactCompany, contactMessage } = req.body;
    
    if (!contactName || !contactEmail || !contactPhone || !contactSubject || !contactMessage) {
        return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const ticketId = generateId('TKT');
    
    const query = `INSERT INTO contact_messages (ticket_id, name, email, phone, subject, company, message) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [ticketId, contactName, contactEmail, contactPhone, contactSubject, contactCompany, contactMessage], function(err) {
        if (err) {
            console.error('Error saving contact message:', err);
            return res.status(500).json({ message: 'Failed to send message' });
        }

        res.json({ ticketId });
    });
});

// Admin APIs (basic implementation)
app.get('/api/admin/dashboard', (req, res) => {
    const queries = {
        quotes: 'SELECT COUNT(*) as count FROM quotes',
        bookings: 'SELECT COUNT(*) as count FROM transport_bookings',
        applications: 'SELECT COUNT(*) as count FROM job_applications',
        messages: 'SELECT COUNT(*) as count FROM contact_messages'
    };

    const results = {};
    let completed = 0;

    Object.keys(queries).forEach(key => {
        db.get(queries[key], (err, row) => {
            if (!err) {
                results[key] = row.count;
            }
            completed++;
            if (completed === Object.keys(queries).length) {
                res.json(results);
            }
        });
    });
});

// Get all bookings
app.get('/api/admin/bookings', (req, res) => {
    const query = 'SELECT * FROM transport_bookings ORDER BY created_at DESC LIMIT 50';
    db.all(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to fetch bookings' });
        }
        res.json(rows);
    });
});

// Get all job applications
app.get('/api/admin/applications', (req, res) => {
    const query = 'SELECT * FROM job_applications ORDER BY created_at DESC LIMIT 50';
    db.all(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to fetch applications' });
        }
        res.json(rows);
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
        }
    }
    res.status(500).json({ message: error.message || 'Internal server error' });
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});