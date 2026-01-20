const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Create and initialize database
const db = new sqlite3.Database('./transport.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    } else {
        console.log('Connected to SQLite database');
        setupDatabase();
    }
});

async function setupDatabase() {
    try {
        console.log('Setting up database tables...');

        // Create tables
        await runQuery(`CREATE TABLE IF NOT EXISTS quotes (
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

        await runQuery(`CREATE TABLE IF NOT EXISTS service_requests (
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

        await runQuery(`CREATE TABLE IF NOT EXISTS transport_bookings (
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

        await runQuery(`CREATE TABLE IF NOT EXISTS tracking (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tracking_number TEXT NOT NULL,
            status TEXT NOT NULL,
            location TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            notes TEXT
        )`);

        await runQuery(`CREATE TABLE IF NOT EXISTS job_applications (
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

        await runQuery(`CREATE TABLE IF NOT EXISTS contact_messages (
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

        await runQuery(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        console.log('Database tables created successfully');

        // Insert sample data
        console.log('Inserting sample data...');

        // Sample quotes
        await runQuery(`INSERT OR IGNORE INTO quotes (quote_id, pickup, delivery, weight, service, estimated_cost, distance, delivery_time) VALUES
            ('QT123456', 'Mumbai', 'Delhi', 100, 'standard', 500, 1400, '3-5 business days'),
            ('QT123457', 'Bangalore', 'Chennai', 50, 'express', 375, 350, '1-2 business days'),
            ('QT123458', 'Pune', 'Hyderabad', 200, 'overnight', 1600, 560, 'Next business day')`);

        // Sample bookings
        await runQuery(`INSERT OR IGNORE INTO transport_bookings 
            (booking_id, tracking_number, sender_name, sender_phone, pickup_address, delivery_address, 
             cargo_weight, cargo_type, vehicle_type, pickup_date, delivery_type, status) VALUES
            ('BK123456', 'TRK12345678', 'John Doe', '+91 9876543210', '123 Business Park, Mumbai', '456 Industrial Area, Delhi', 
             100, 'general', 'medium-truck', '2024-01-15', 'standard', 'in-transit'),
            ('BK123457', 'TRK12345679', 'Jane Smith', '+91 9876543211', '789 Tech Hub, Bangalore', '321 Software City, Chennai', 
             50, 'electronics', 'mini-truck', '2024-01-16', 'express', 'delivered')`);

        // Sample tracking data
        await runQuery(`INSERT OR IGNORE INTO tracking (tracking_number, status, location, notes) VALUES
            ('TRK12345678', 'Picked up', 'Mumbai', 'Package picked up from sender'),
            ('TRK12345678', 'In transit', 'Pune', 'Package in transit to Delhi'),
            ('TRK12345678', 'In transit', 'Nagpur', 'Package reached Nagpur hub'),
            ('TRK12345679', 'Picked up', 'Bangalore', 'Package picked up from sender'),
            ('TRK12345679', 'In transit', 'Chennai', 'Package out for delivery'),
            ('TRK12345679', 'Delivered', 'Chennai', 'Package delivered successfully')`);

        // Sample job applications
        await runQuery(`INSERT OR IGNORE INTO job_applications 
            (application_id, job_id, first_name, last_name, email, phone, address, experience, education, 
             skills, cover_letter, expected_salary, available_from, status) VALUES
            ('APP123456', 1, 'Rajesh', 'Kumar', 'rajesh.kumar@email.com', '+91 9876543212', 
             '123 Driver Colony, Mumbai', '2-5', 'high-school', 'Commercial driving, Vehicle maintenance', 
             'I am an experienced truck driver with clean driving record.', 30000, '2024-02-01', 'under-review'),
            ('APP123457', 2, 'Priya', 'Sharma', 'priya.sharma@email.com', '+91 9876543213', 
             '456 Logistics Street, Delhi', '1-3', 'bachelor', 'Logistics coordination, MS Office, Communication', 
             'I have experience in supply chain management and logistics.', 40000, '2024-02-15', 'submitted')`);

        // Sample contact messages
        await runQuery(`INSERT OR IGNORE INTO contact_messages 
            (ticket_id, name, email, phone, subject, company, message, status) VALUES
            ('TKT123456', 'Amit Patel', 'amit.patel@company.com', '+91 9876543214', 'quote', 'ABC Industries', 
             'I need a quote for regular shipments from Mumbai to Bangalore.', 'open'),
            ('TKT123457', 'Sunita Reddy', 'sunita.reddy@business.com', '+91 9876543215', 'feedback', 'XYZ Traders', 
             'Excellent service! Very satisfied with the delivery.', 'closed')`);

        // Create admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        await runQuery(`INSERT OR IGNORE INTO users (username, email, password_hash, role) VALUES
            ('admin', 'admin@swastiktransport.com', '${adminPassword}', 'admin')`);

        console.log('Sample data inserted successfully');
        console.log('\n=== Database Setup Complete ===');
        console.log('Admin credentials:');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('\nSample tracking numbers to test:');
        console.log('TRK12345678 (In transit)');
        console.log('TRK12345679 (Delivered)');
        console.log('\nDatabase file: transport.db');
        console.log('================================\n');

    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('Database connection closed');
            }
            process.exit(0);
        });
    }
}

function runQuery(sql) {
    return new Promise((resolve, reject) => {
        db.run(sql, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
}

// Handle process termination
process.on('SIGINT', () => {
    console.log('\nShutting down database setup...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        }
        process.exit(0);
    });
});