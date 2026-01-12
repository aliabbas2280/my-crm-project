# 🏢 Mini CRM Application

A modern, professional React-based Customer Relationship Management (CRM) system with beautiful UI, comprehensive features, and real-time data management.

## ✨ Features

### 🎯 Core Features
- **📊 Dashboard** - KPI cards, interactive charts, recent activity feed
- **👥 Client Management** - Full CRUD operations with search and filtering
- **💼 Deal Management** - Complete sales pipeline with status tracking
- **🔐 Authentication** - Secure login system
- **📱 Responsive Design** - Works perfectly on all devices

### 🚀 Advanced Features
- **Search & Filter** - Find clients by name/company, filter deals by status
- **Status Flow** - Lead → Qualified → Proposal → Won/Lost
- **Real-time Charts** - Revenue tracking and deal status visualization
- **Activity Tracking** - Complete audit trail of all actions
- **Modern UI** - Gradient backgrounds, smooth animations, professional design

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router, Bootstrap 5
- **Charts**: Chart.js with react-chartjs-2
- **Backend**: JSON Server (mock API)
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Styling**: Bootstrap + Custom CSS with gradients

## 📁 Project Structure

```
src/
├── CSS/                    # Stylesheets
│   ├── Dashboard.css       # Modern dashboard styles
│   └── LoginNew.css        # Login page styles
├── Pages/                  # Page components
│   ├── Dashboard/
│   │   └── Dashboard.jsx   # Main dashboard with KPIs & charts
│   ├── ClientsPage.jsx     # Client management
│   ├── DealsPage.jsx       # Deal management
│   └── Login.jsx           # Authentication
├── utils/                  # Utilities
│   └── api.js              # API service functions
├── App.jsx                 # Main app with routing
└── main.jsx                # Entry point
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Application
**Option A: Use the batch file (Windows)**
```bash
start.bat
```

**Option B: Manual start**
```bash
# Terminal 1: Start JSON Server
npm run server

# Terminal 2: Start React App
npm run dev
```

### 3. Access the Application
- **React App**: http://localhost:5173
- **API Server**: http://localhost:5000
- **Login**: admin@crm.com / password

## 📊 API Endpoints

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

### Users & Activities
- `GET /users` - Get all users
- `GET /activities` - Get activity log
- `POST /activities` - Log new activity

## 🎨 Features Overview

### 📊 Dashboard
- **KPI Cards**: Total Clients, Active Deals, Won Revenue, Conversion Rate
- **Charts**: Revenue over time (Bar chart), Deals by status (Doughnut chart)
- **Recent Activity**: Real-time activity feed
- **Recent Deals**: Latest deals with status badges

### 👥 Client Management
- Add/Edit/Delete clients with validation
- Search by name, company, or email
- Filter by status (Active/Inactive)
- Professional table with action buttons
- Modal forms for data entry

### 💼 Deal Management
- Complete deal lifecycle management
- Status flow: Lead → Qualified → Proposal → Won/Lost
- Assign deals to clients and users
- Sort by value, date, or title
- Filter by status and search functionality
- Quick status change buttons

### 🔍 Search & Filter
- **Client Search**: Name, company, email
- **Deal Search**: Title, client name
- **Filters**: Status, user assignment, date ranges
- **Sorting**: Value (high/low), date, alphabetical

## 🎯 Data Models

### Client
```javascript
{
  id: number,
  name: string,
  email: string,
  phone: string,
  company: string,
  status: "Active" | "Inactive",
  createdAt: string
}
```

### Deal
```javascript
{
  id: number,
  title: string,
  clientId: number,
  clientName: string,
  userId: number,
  userName: string,
  value: number,
  status: "Lead" | "Qualified" | "Proposal" | "Won" | "Lost",
  expectedCloseDate: string,
  createdAt: string
}
```

### Activity
```javascript
{
  id: number,
  type: string,
  message: string,
  date: string,
  userId: number
}
```

## 🎨 Design Features

- **Modern Gradients**: Purple to blue gradient backgrounds
- **Glass Morphism**: Semi-transparent cards with backdrop blur
- **Smooth Animations**: Hover effects and transitions
- **Professional Typography**: Clean, readable fonts
- **Responsive Grid**: Works on all screen sizes
- **Interactive Charts**: Hover effects and animations
- **Status Badges**: Color-coded status indicators

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run server` - Start JSON Server
- `npm run lint` - Run ESLint

### Key Components
- **Dashboard**: Main analytics and overview
- **ClientsPage**: Client management with CRUD
- **DealsPage**: Deal pipeline management
- **Login**: Authentication with validation

## 🚀 Production Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

3. **Replace JSON Server** with a real backend API

## 📱 Mobile Responsive

The application is fully responsive and works great on:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Laptops (1024px+)
- 🖥️ Desktops (1200px+)

## 🎯 Future Enhancements

- Real backend integration
- User roles and permissions
- Email notifications
- Advanced reporting
- Export functionality
- Calendar integration
- File attachments

## 📄 License

MIT License - Feel free to use this project for learning and development!

---

**Built with ❤️ using modern React patterns and professional UI/UX design**