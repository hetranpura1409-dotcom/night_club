# Nightclub App - Admin Dashboard

Next.js-based admin panel for managing the Nightclub application.

## ✨ Features

- ✅ Dashboard with system stats
- ✅ User management
- ✅ Push notification sender
- ✅ Modern, responsive UI
- ✅ Real-time data updates

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Configuration

Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

Update the API base URL in `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Running Development Server

```bash
npm run dev
```

The dashboard will be available at `http://localhost:3001`

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Dashboard home
│   ├── users/
│   │   └── page.tsx          # Users management
│   ├── notifications/
│   │   └── page.tsx          # Send notifications
│   └── layout.tsx            # Root layout
├── components/
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── Header.tsx            # Page header
│   ├── StatsCard.tsx         # Dashboard stats card
│   └── UserTable.tsx         # Users data table
├── services/
│   └── api.ts                # API client
└── types/
    └── index.ts              # TypeScript types
```

## 📊 Dashboard Pages

### 1. Home Dashboard
- System version display
- Total registered users count
- Quick stats overview

### 2. Users Management
- View all registered users
- Search and filter users
- User details (name, mobile, registration date)
- Quick access to send notifications

### 3. Push Notifications
- Select target user
- Compose notification (title + message)
- Send push notification
- View send status

## 🎨 UI Components

### StatsCard
Displays key metrics with icons and values.

### UserTable
Sortable, searchable table for user management.

### Sidebar
Navigation menu with active state indicators.

## 🔌 API Integration

The dashboard communicates with the backend API:

- `GET /users` - Fetch all users
- `POST /notifications/send` - Send push notification

API client is configured in `src/services/api.ts`

## 🧪 Building for Production

```bash
# Build
npm run build

# Run production server
npm start
```

## 🎨 Styling

The dashboard uses modern CSS with:
- CSS Modules for component styling
- Glassmorphism effects
- Gradient backgrounds
- Smooth animations
- Responsive design

## 📱 Responsive Design

The admin panel is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (375px+)

## 🔐 Authentication

Currently, the POC does not include admin authentication. In production, you should add:
- Admin login
- Role-based access control
- Session management
- Protected routes

## 💡 Future Enhancements

- [ ] Admin authentication
- [ ] Nightclub management (CRUD)
- [ ] Events management
- [ ] Analytics dashboard
- [ ] Bulk notification sending
- [ ] User activity logs
- [ ] Export data to CSV/Excel

## 📚 Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- CSS Modules
- Axios (HTTP client)
- date-fns (date formatting)
