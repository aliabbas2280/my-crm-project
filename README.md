# CRM Pro - Professional Customer Relationship Management System

A modern, full-featured React-based CRM application with professional UI/UX, complete authentication system, and comprehensive business management tools.

## 🚀 Features

### 🔐 Authentication System
- **User Registration** - Complete signup flow with validation
- **Secure Login** - Email/password authentication
- **Session Management** - Persistent login sessions
- **User Profiles** - User information management

### 📊 Professional Dashboard
- **KPI Cards** - Real-time business metrics
- **Interactive Charts** - Revenue trends and deal status visualization
- **Activity Feed** - Recent business activities
- **Responsive Design** - Works perfectly on all devices

### 👥 Client Management
- **Complete CRUD Operations** - Add, edit, delete, view clients
- **Advanced Search & Filter** - Find clients quickly
- **Client Status Tracking** - Active/Inactive status management
- **Contact Information** - Comprehensive client details

### 💼 Deal Pipeline Management
- **Deal Tracking** - Complete sales pipeline management
- **Status Management** - Lead → Qualified → Proposal → Won/Lost
- **Value Tracking** - Revenue and deal value monitoring
- **Client Association** - Link deals to specific clients
- **Date Management** - Expected close dates and timeline tracking

### 🎨 Professional UI/UX
- **Modern Design** - Clean, professional interface
- **Gradient Navbar** - Beautiful navigation with user dropdown
- **Smooth Animations** - Engaging user interactions
- **Consistent Styling** - Professional color scheme and typography
- **Mobile Responsive** - Perfect experience on all screen sizes

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with modern hooks
- **React Router** - Client-side routing
- **Bootstrap 5** - Professional UI components
- **Chart.js** - Interactive data visualization
- **Axios** - HTTP client for API calls

### Backend
- **JSON Server** - Mock REST API
- **Local Storage** - Session persistence

### Build Tools
- **Vite** - Fast development and build tool
- **ESLint** - Code quality and consistency

## 📁 Project Structure

```
src/
├── components/
│   └── Layout/
│       ├── Navbar.jsx          # Professional navigation component
│       └── Navbar.css          # Navbar styling
├── Pages/
│   ├── Dashboard/
│   │   └── Dashboard.jsx       # Main dashboard with KPIs and charts
│   ├── Login.jsx               # Login page with signup link
│   ├── Signup.jsx              # User registration page
│   ├── ClientsPage.jsx         # Client management interface
│   └── DealsPage.jsx           # Deal pipeline management
├── utils/
│   └── api.js                  # API service functions
├── hooks/
│   └── useAuth.js              # Authentication hook
├── CSS/
│   ├── Dashboard.css           # Main dashboard styling
│   ├── LoginNew.css            # Login page styling
│   └── Signup.css              # Signup page styling
├── App.jsx                     # Main application component
├── App.css                     # Global application styles
└── main.jsx                    # Application entry point
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   cd Practise-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   # Option 1: Use the batch file (Windows)
   start-app.bat
   
   # Option 2: Manual start
   # Terminal 1 - Start JSON Server
   npm run server
   
   # Terminal 2 - Start React App
   npm run dev
   ```

4. **Access the application**
   - React App: http://localhost:5173
   - JSON Server API: http://localhost:5000

### Default Login Credentials
- **Email:** admin@crm.com
- **Password:** password

## 📋 Available Scripts

- `npm run dev` - Start React development server
- `npm run server` - Start JSON Server (API)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm start` - Start both servers concurrently

## 🔧 API Endpoints

### Authentication
- `GET /users` - Get all users
- `POST /users` - Create new user

### Clients
- `GET /clients` - Get all clients
- `POST /clients` - Create new client
- `PUT /clients/:id` - Update client
- `DELETE /clients/:id` - Delete client

### Deals
- `GET /deals` - Get all deals
- `POST /deals` - Create new deal
- `PUT /deals/:id` - Update deal
- `DELETE /deals/:id` - Delete deal

### Activities
- `GET /activities` - Get all activities
- `POST /activities` - Create new activity

## 🎨 Design Features

### Professional Navbar
- Gradient background with modern styling
- User dropdown with profile information
- Active page highlighting
- Responsive mobile menu
- Smooth hover animations

### Dashboard KPIs
- Total Clients with active count
- Active Deals in pipeline
- Won Revenue tracking
- Conversion Rate calculation
- Interactive hover effects

### Modern Forms
- Professional input styling
- Real-time validation
- Error handling with user feedback
- Consistent button styling
- Loading states

### Data Visualization
- Revenue trend charts
- Deal status distribution
- Interactive chart elements
- Responsive chart sizing

## 📱 Responsive Design

The application is fully responsive and works perfectly on:
- **Desktop** - Full feature experience
- **Tablet** - Optimized layout and navigation
- **Mobile** - Touch-friendly interface with collapsible navigation

## 🔒 Security Features

- Input validation and sanitization
- XSS protection through React
- Secure password handling
- Session management
- Error handling without information leakage

## 🚀 Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

3. **Set up a real backend API** to replace JSON Server

4. **Configure environment variables** for production API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Test with the provided demo data

---

**CRM Pro** - Built with ❤️ using React, Bootstrap, and modern web technologies.