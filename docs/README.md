# Epic Invites Backend - Professional API Structure

A scalable Node.js backend API for managing user roles with a professional folder structure designed for growth and maintainability.

## 📁 Project Structure

```
EpicInvitesBackend/
├── src/
│   ├── app.js                  # Express app configuration
│   ├── config/
│   │   ├── constants.js        # Application constants
│   │   ├── database.js         # Database connection
│   │   └── swagger.js          # Swagger configuration
│   ├── controllers/
│   │   └── userController.js   # User business logic
│   ├── middleware/
│   │   ├── auth.js             # Authentication middleware
│   │   ├── errorHandler.js     # Error handling
│   │   └── validation.js       # Input validation
│   ├── models/
│   │   └── User.js             # User model and schemas
│   ├── routes/
│   │   ├── index.js            # Main routes
│   │   └── userRoutes.js       # User-specific routes
│   ├── services/
│   │   └── userService.js      # User data access layer
│   └── utils/
│       ├── passwordHelper.js   # Password utilities
│       ├── responseHelper.js   # Response formatting
│       └── validationHelper.js # Validation utilities
├── tests/
│   └── api.test.js             # API test suite
├── docs/
│   └── api-documentation.md    # Additional API docs
├── database/
│   └── schema.sql              # Database schema
├── server.js                   # Application entry point
├── package.json
├── .env.example
└── README.md
```

## 🚀 Features

- **Role-based User Management**: Admin, Designer, Sales, and User roles
- **Professional Architecture**: Clean separation of concerns
- **Comprehensive Validation**: Input validation with detailed error messages
- **Secure Authentication**: bcrypt password hashing and admin token authentication
- **Pagination Support**: Efficient data retrieval with pagination
- **Advanced Filtering**: Search by email, filter by role
- **Swagger Documentation**: Interactive API documentation
- **Error Handling**: Comprehensive error handling and logging
- **Scalable Structure**: Ready for multiple API modules

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Configure your environment variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=8080
ADMIN_SECRET_TOKEN=your_admin_secret_token
```

### 3. Database Setup

Execute the SQL schema in your Supabase dashboard:

```sql
-- See database/schema.sql for the complete schema
```

### 4. Start the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## 📚 API Documentation

### Base URL

```
http://localhost:8080/api
```

### Authentication

All user management endpoints require an admin token:

```
Headers:
admin-token: your_admin_secret_token
```

### Available Endpoints

#### Users API

| Method   | Endpoint                   | Description                   |
| -------- | -------------------------- | ----------------------------- |
| `GET`    | `/api/users`               | Get all users with pagination |
| `GET`    | `/api/users/:id`           | Get user by ID                |
| `GET`    | `/api/users/search?email=` | Search user by email          |
| `GET`    | `/api/users/role/:role`    | Get users by role             |
| `POST`   | `/api/users`               | Create new user               |
| `PUT`    | `/api/users/:id`           | Update user                   |
| `DELETE` | `/api/users/:id`           | Delete user                   |

#### System Endpoints

| Method | Endpoint      | Description           |
| ------ | ------------- | --------------------- |
| `GET`  | `/`           | API information       |
| `GET`  | `/api/health` | Health check          |
| `GET`  | `/api-docs`   | Swagger documentation |

### Pagination Parameters

```javascript
{
  page: 1,        // Page number (default: 1)
  limit: 10,      // Items per page (default: 10, max: 100)
  sortBy: 'createdAt',  // Sort field
  sortOrder: 'desc'     // Sort order: 'asc' or 'desc'
}
```

### Example API Calls

#### Create User

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -H "admin-token: admin-secret-token" \
  -d '{
    "fullName": "John Designer",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "role": "designer"
  }'
```

#### Get Users with Pagination

```bash
curl -X GET "http://localhost:8080/api/users?page=1&limit=5&sortBy=fullName&sortOrder=asc" \
  -H "admin-token: admin-secret-token"
```

#### Search User by Email

```bash
curl -X GET "http://localhost:8080/api/users/search?email=john@example.com" \
  -H "admin-token: admin-secret-token"
```

#### Get Users by Role

```bash
curl -X GET http://localhost:8080/api/users/role/designer \
  -H "admin-token: admin-secret-token"
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
node tests/api.test.js
```

The test suite includes:

- Health check validation
- User CRUD operations
- Pagination testing
- Validation error handling
- Authentication testing
- Role-based filtering

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    /* response data */
  },
  "count": 10 // For array responses
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": ["Detailed error messages"] // For validation errors
}
```

### Pagination Response

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      /* user array */
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

## 🔒 Security Features

- **Password Security**: bcrypt hashing with 12 rounds
- **Input Validation**: Comprehensive validation with Joi
- **Admin Authorization**: Token-based access control
- **Email Uniqueness**: Prevents duplicate registrations
- **Role Validation**: Ensures valid role assignments
- **SQL Injection Protection**: Parameterized queries via Supabase

## 📈 Scalability Features

- **Modular Architecture**: Easy to add new API modules
- **Separation of Concerns**: Clear separation between layers
- **Reusable Components**: Utility functions and middleware
- **Configuration Management**: Centralized constants and config
- **Error Handling**: Consistent error responses across all endpoints
- **Documentation**: Comprehensive Swagger documentation

## 🎯 Future API Modules

The structure is ready for additional API modules:

```javascript
// Future route additions in src/routes/index.js
router.use("/invitations", invitationRoutes);
router.use("/events", eventRoutes);
router.use("/templates", templateRoutes);
router.use("/analytics", analyticsRoutes);
```

Each new module will follow the same pattern:

- Controller in `src/controllers/`
- Service in `src/services/`
- Routes in `src/routes/`
- Model in `src/models/`
- Tests in `tests/`

## 🛠️ Development Guidelines

1. **Controllers**: Handle HTTP requests and responses
2. **Services**: Business logic and data access
3. **Middleware**: Cross-cutting concerns (auth, validation, etc.)
4. **Models**: Data structures and validation schemas
5. **Utils**: Reusable utility functions
6. **Config**: Application configuration and constants

## 📖 Additional Resources

- [Swagger Documentation](http://localhost:8080/api-docs)
- [Database Schema](./database/schema.sql)
- [API Tests](./tests/api.test.js)
- [Environment Setup](./.env.example)

## 🤝 Contributing

1. Follow the existing folder structure
2. Add tests for new features
3. Update documentation
4. Ensure all validations pass
5. Follow the established patterns and conventions
