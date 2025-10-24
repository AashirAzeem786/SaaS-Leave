# Leave Request Workflow - HR Platform

A complete SaaS-style Leave Request Workflow system built with React.js and Node.js, featuring role-based authentication and comprehensive leave management capabilities.

## 🚀 Features

### Core Functionality
- **Employee Dashboard**: Apply for leave with date range and reason
- **Manager Dashboard**: Review, approve, or reject leave requests
- **Role-based Access Control**: Separate interfaces for Employees and Managers
- **Real-time Validation**: Prevents overlapping requests and validates date constraints
- **Leave Balance Management**: Tracks available leave days per employee

### Technical Features
- **TypeScript**: Full type safety across frontend and backend
- **Modern UI**: Clean, responsive design with TailwindCSS
- **Form Validation**: Client-side and server-side validation
- **Mock Authentication**: Hardcoded credentials for demo purposes
- **Comprehensive Testing**: Unit tests for both frontend and backend
- **RESTful API**: Well-structured API endpoints with proper error handling

## 🏗️ Architecture

### Backend (Node.js + Express + TypeScript)
```
backend/
├── src/
│   ├── types/           # TypeScript interfaces
│   ├── data/            # Mock data and storage
│   ├── utils/            # Validation utilities
│   ├── middleware/       # Authentication middleware
│   ├── routes/          # API route handlers
│   ├── __tests__/       # Backend unit tests
│   └── index.ts         # Express server setup
├── package.json
└── tsconfig.json
```

### Frontend (React + TypeScript + TailwindCSS)
```
frontend/
├── src/
│   ├── components/      # React components
│   ├── contexts/        # React context providers
│   ├── services/        # API service layer
│   ├── types/          # TypeScript interfaces
│   ├── __tests__/      # Frontend unit tests
│   ├── App.tsx         # Main app component
│   └── index.tsx       # App entry point
├── public/
├── package.json
└── tailwind.config.js
```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Leave Management
- `POST /api/leave/apply` - Apply for leave (Employee only)
- `GET /api/leave/pending` - Get pending requests (Manager only)
- `POST /api/leave/approve/:id` - Approve/reject request (Manager only)
- `GET /api/leave/my-requests` - Get user's own requests
- `GET /api/leave/summary` - Get leave summary (Manager only)

## 🔐 Mock Users

The system includes pre-configured users for testing:

### Employee Accounts
- **Username**: `employee` | **Password**: `password123`
- **Username**: `alice` | **Password**: `alice123`

### Manager Account
- **Username**: `manager` | **Password**: `manager123`

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone and install dependencies**:
   ```bash
   # Install root dependencies
   npm install
   
   # Install all dependencies (backend + frontend)
   npm run install:all
   ```

2. **Start the development servers**:
   ```bash
   # Start both backend and frontend concurrently
   npm run dev
   
   # Or start them separately:
   npm run backend:dev  # Backend on http://localhost:3001
   npm run frontend:dev # Frontend on http://localhost:3000
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api
   - Health Check: http://localhost:3001/api/health

### Testing

```bash
# Run all tests
npm test

# Run backend tests only
npm run backend:test

# Run frontend tests only
npm run frontend:test
```

### Building for Production

```bash
# Build both applications
npm run backend:build
npm run frontend:build
```

## 🧪 Testing

### Backend Tests
- **Validation Utils**: Tests for date validation, overlap detection, and leave balance checks
- **API Endpoints**: Comprehensive testing of all REST endpoints
- **Business Logic**: Tests for leave request processing and approval workflows

### Frontend Tests
- **Component Testing**: React Testing Library tests for UI components
- **Form Validation**: Tests for leave application form validation
- **User Interactions**: Tests for user workflows and state management

## 📊 Business Rules & Validations

### Leave Request Rules
1. **Past Date Prevention**: Start date cannot be in the past
2. **Date Range Validation**: End date cannot be before start date
3. **Overlap Detection**: Prevents overlapping leave requests for the same employee
4. **Leave Balance**: Ensures sufficient leave days are available
5. **Role-based Access**: Only managers can approve/reject requests

### Leave Balance Management
- Each employee starts with 20 leave days per year
- Used days are tracked and deducted from available balance
- Balance is checked before approving new requests

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Primary blue, success green, danger red, warning yellow
- **Typography**: Clean, readable fonts with proper hierarchy
- **Components**: Reusable, accessible components with consistent styling
- **Responsive Design**: Mobile-first approach with responsive layouts

### User Experience
- **Intuitive Navigation**: Clear role-based dashboards
- **Real-time Feedback**: Toast notifications for all actions
- **Form Validation**: Immediate feedback on form errors
- **Loading States**: Proper loading indicators for async operations

## 🔧 Configuration

### Environment Variables
- `PORT`: Backend server port (default: 3001)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:3000)
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:3001/api)

### Customization
- **Mock Data**: Modify `backend/src/data/mockData.ts` to change users or initial data
- **Styling**: Update `frontend/tailwind.config.js` for custom themes
- **Validation Rules**: Adjust validation logic in `backend/src/utils/validation.ts`

## 🚀 Deployment Considerations

### Production Setup
1. **Environment Variables**: Set proper environment variables
2. **Database**: Replace in-memory storage with a real database (PostgreSQL, MongoDB)
3. **Authentication**: Implement JWT tokens instead of mock authentication
4. **Security**: Add rate limiting, input sanitization, and proper CORS configuration
5. **Monitoring**: Add logging, error tracking, and performance monitoring

### Scalability
- **Database**: Use connection pooling and proper indexing
- **Caching**: Implement Redis for session management and caching
- **Load Balancing**: Use reverse proxy (nginx) for multiple instances
- **CDN**: Serve static assets through a CDN

## 📝 Assumptions & Limitations

### Current Assumptions
1. **Mock Authentication**: Uses hardcoded credentials for demo purposes
2. **In-Memory Storage**: Data is not persisted between server restarts
3. **Single Instance**: Not designed for horizontal scaling
4. **Basic Validation**: Simplified business rules for demonstration

### Future Enhancements
1. **Real Database**: PostgreSQL or MongoDB integration
2. **JWT Authentication**: Proper token-based authentication
3. **Email Notifications**: Automated email alerts for leave requests
4. **Calendar Integration**: Sync with external calendar systems
5. **Advanced Reporting**: Detailed analytics and reporting features
6. **Mobile App**: React Native mobile application
7. **Multi-tenancy**: Support for multiple organizations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React**: For the amazing frontend framework
- **Express.js**: For the robust backend framework
- **TailwindCSS**: For the utility-first CSS framework
- **TypeScript**: For the type safety and developer experience
- **Jest**: For the comprehensive testing framework

---

**Built with ❤️ for modern HR workflows**
# SaaS-Leave
