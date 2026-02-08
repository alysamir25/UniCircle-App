# UniCircle - Computing Society Portal
**Project Brief | University Presentation Document**

## 📋 Project Overview
**UniCircle** is a comprehensive digital platform designed specifically for the Solent University Computing Society (CompSoc) to streamline society management, enhance member engagement, and provide committee members with powerful administrative tools.

**Tagline:** *"Connecting Students, Empowering Committees"*

## 🔍 Problem Statement
The Computing Society currently faces several challenges:
- **Manual Processes:** Event registration, attendance tracking, and communication are handled manually
- **Limited Engagement:** No centralized platform for members to interact and stay updated
- **Committee Overload:** Administrative tasks consume valuable time that could be spent on society development
- **Data Silos:** Member information, event statistics, and engagement metrics are scattered and inaccessible
- **Scalability Issues:** As membership grows, manual systems become increasingly inefficient

## 🎯 Solution: UniCircle Platform
UniCircle provides a unified solution with three core user experiences:

### For Members:
- **Single Sign-On:** Secure authentication using Solent University credentials
- **Event Discovery:** Browse and register for workshops, hackathons, and social events
- **Community Posts:** Engage with announcements, resources, and discussions
- **Personal Profiles:** Track event attendance and society involvement

### For Committee Members:
- **Admin Dashboard:** Centralized control panel for all society operations
- **Event Management:** Create, edit, and monitor events with capacity tracking
- **Content Management:** Schedule announcements and resources
- **Member Directory:** View and manage society membership
- **Waitlist Management:** Automatic handling of oversubscribed events

### For Society Leadership:
- **Analytics Dashboard:** Real-time insights into member engagement and event performance
- **Export Capabilities:** Generate reports for university reporting and funding applications
- **Permission Controls:** Granular access management for different committee roles

## ✨ Key Features

### 🔐 Authentication & Security
- Solent University OAuth2.0 integration (planned)
- Role-based access control (Member/Committee/Admin)
- Secure session management

### 📅 Event Management System
- Event creation with capacity limits
- Automated registration and waitlisting
- Real-time attendance tracking
- Calendar integration
- Automated email notifications (confirmation, reminders)

### 📢 Content Management
- Rich text editor for announcements
- Category-based organization (Events, Resources, Opportunities)
- Scheduled publishing
- Like and comment functionality

### 📊 Analytics & Reporting
- Registration trend analysis
- Member engagement metrics
- Event popularity rankings
- Capacity utilization statistics
- Export to CSV/PDF for reporting

### 👥 Member Engagement
- Event attendance tracking
- Achievement recognition
- Discussion forums
- Profile customization

## 🛠️ Technical Stack

### Frontend
- **React 18** - Component-based UI development
- **TypeScript** - Type-safe JavaScript for better maintainability
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Recharts** - Data visualization library for analytics
- **React Router** - Client-side routing

### State Management & Architecture
- React Context API for global state
- Component-based architecture
- Custom hooks for business logic
- Responsive design (mobile-first approach)

### Development Tools
- ESLint for code quality
- Prettier for code formatting
- Git for version control
- Mock authentication for development

### Future Backend Integration
- Node.js/Express REST API (planned)
- PostgreSQL database (planned)
- Solent University OAuth2.0 (awaiting API access)
- Real-time notifications (planned)

## 📈 Project Status

### ✅ Completed
- User authentication system (mock)
- Member dashboard
- Admin dashboard with full functionality
- Event management (create, edit, delete, view attendees)
- Post management with rich text editor
- Analytics dashboard with charts
- Responsive mobile design
- CSV export functionality

### 🔄 In Development
- Real Solent University OAuth2.0 integration
- Database integration
- Email notification system
- Mobile app (future phase)

### 📅 Planned Features
- Discussion forums
- Resource library
- Achievement badges
- Integration with university calendar
- Mobile push notifications

## 💡 Value Proposition

### For Students:
- **Simplified Access:** One login for all society activities
- **Enhanced Experience:** Easy event discovery and registration
- **Community Building:** Connect with peers and industry professionals
- **Skill Development:** Access workshops and learning resources

### For Committee Members:
- **Time Savings:** Automate administrative tasks
- **Better Insights:** Data-driven decision making
- **Professional Tools:** University-standard platform
- **Scalable Solution:** Grow the society without technical constraints

### For the University:
- **Enhanced Student Experience:** Supports student engagement metrics
- **Professional Development:** Practical project experience for computing students
- **Society Excellence:** Elevates CompSoc to national standard
- **Scalable Template:** Can be adapted for other university societies

## 🗺️ Implementation Roadmap

### Phase 1: Core Platform (Current)
- Basic authentication
- Event and post management
- Admin dashboard
- **Status: COMPLETE**

### Phase 2: University Integration
- Solent OAuth2.0 implementation
- Database migration
- Email system integration
- **Timeline: Awaiting API access**

### Phase 3: Enhanced Features
- Mobile application
- Advanced analytics
- Integration with university systems
- **Timeline: Semester 2, 2024**

## 🤝 Support Required from University

### Immediate Needs:
1. **OAuth2.0 API Access** - For secure university authentication
2. **Development Sandbox** - Testing environment for integration
3. **Technical Liaison** - Point of contact in IT department

### Future Support:
1. **Server Hosting** - Production environment
2. **Database Resources** - For member data storage
3. **SSL Certificate** - Secure HTTPS implementation

## 👥 Project Team & Contact

**Development Team:** Solent Computing Society Tech Committee  
**GitHub Repository:** `https://github.com/alysamir25/unicircle-app`  
**Figma Prototype:** `https://www.figma.com/design/WZSqchu46aE2u2Ze9gGApT/UniCircle`  


---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/alysamir25/unicircle-app

# Navigate to project directory
cd unicircle-app

# Install dependencies
npm install

# Start development server
npm run dev
