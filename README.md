# Swastik Transport Pvt. Ltd. - Complete Website

A modern, fully-featured transport and logistics website with animations, backend API, and database integration.

## 🚀 Features

### Frontend
- **Modern Design**: Responsive design with smooth animations and transitions
- **Multiple Pages**: Home, About, Services, Transport, Jobs/Careers, Contact
- **Interactive Forms**: Quote calculator, booking system, job applications
- **Real-time Tracking**: Shipment tracking with status updates
- **Mobile Responsive**: Optimized for all device sizes

### Backend
- **RESTful API**: Complete API for all website functionality
- **Database Integration**: SQLite database with proper schema
- **File Upload**: Resume upload for job applications
- **Data Validation**: Server-side validation for all forms
- **Error Handling**: Comprehensive error handling and logging

### Database
- **SQLite Database**: Lightweight, serverless database
- **Multiple Tables**: Quotes, bookings, tracking, applications, contacts
- **Sample Data**: Pre-populated with sample data for testing
- **Admin Panel Ready**: Database structure ready for admin interface

## 📁 Project Structure

```
Web project/
├── index.html          # Homepage
├── about.html          # About us page
├── services.html       # Services page
├── transport.html      # Transport booking & tracking
├── jobs.html           # Careers page
├── contact.html        # Contact page
├── styles.css          # Main stylesheet with animations
├── script.js           # Frontend JavaScript
├── server.js           # Node.js backend server
├── setup-db.js         # Database setup script
├── package.json        # Node.js dependencies
├── transport.db        # SQLite database (created after setup)
├── uploads/            # Directory for uploaded files
└── README.md           # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Database**
   ```bash
   node setup-db.js
   ```

3. **Start the Server**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Access the Website**
   Open your browser and go to: `http://localhost:3000`

## 🎯 API Endpoints

### Public APIs
- `POST /api/quote` - Generate price quote
- `POST /api/service-request` - Submit service request
- `POST /api/transport-booking` - Book transport
- `GET /api/track/:trackingNumber` - Track shipment
- `POST /api/job-application` - Submit job application
- `POST /api/contact` - Send contact message

### Admin APIs
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/bookings` - All bookings
- `GET /api/admin/applications` - All job applications

## 📊 Database Schema

### Tables
1. **quotes** - Price quotes generated
2. **service_requests** - Service inquiries
3. **transport_bookings** - Transport bookings
4. **tracking** - Shipment tracking history
5. **job_applications** - Job applications
6. **contact_messages** - Contact form submissions
7. **users** - Admin users

## 🧪 Testing

### Sample Data
The database comes pre-populated with sample data:

**Tracking Numbers:**
- `TRK12345678` - In transit shipment
- `TRK12345679` - Delivered shipment

**Admin Login:**
- Username: `admin`
- Password: `admin123`

### Test Features
1. **Quote Calculator**: Enter pickup/delivery locations and get instant quotes
2. **Booking System**: Book transport with real-time form validation
3. **Tracking System**: Track shipments using sample tracking numbers
4. **Job Applications**: Apply for jobs with resume upload
5. **Contact Forms**: Send messages through contact form

## 🎨 Animations & Effects

- **Fade-in animations** on scroll
- **Hover effects** on cards and buttons
- **Loading animations** for form submissions
- **Smooth transitions** between pages
- **Parallax effects** on hero sections
- **Bounce animations** for call-to-action buttons

## 📱 Responsive Design

- **Mobile-first approach**
- **Flexible grid layouts**
- **Responsive navigation**
- **Touch-friendly interfaces**
- **Optimized images and content**

## 🔧 Configuration

### Environment Variables
Create a `.env` file for production:
```
PORT=3000
JWT_SECRET=your_secret_key_here
NODE_ENV=production
```

### File Upload Limits
- Maximum file size: 5MB
- Allowed formats: PDF (for resumes)
- Upload directory: `./uploads/`

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Performance Features

- **Compressed responses**
- **Rate limiting**
- **Security headers**
- **Optimized database queries**
- **Efficient file handling**

## 🔒 Security Features

- **Input validation**
- **SQL injection prevention**
- **File upload security**
- **CORS configuration**
- **Helmet.js security headers**

## 🛠️ Customization

### Adding New Pages
1. Create HTML file with same header/footer structure
2. Add navigation link in all pages
3. Update CSS if needed
4. Add JavaScript functionality

### Modifying Database
1. Update schema in `server.js`
2. Run database migration
3. Update API endpoints
4. Test thoroughly

### Styling Changes
- Main styles in `styles.css`
- CSS variables for easy theming
- Responsive breakpoints defined
- Animation keyframes included

## 📞 Support

For technical support or questions:
- Email: support@swastiktransport.com
- Phone: +91 124 456 7890

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

**Swastik Transport Pvt. Ltd.** - Excellence in Logistics Since 1995