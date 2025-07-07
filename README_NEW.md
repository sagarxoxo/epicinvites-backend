# Epic Invites Backend - User Role Management API

A professional Node.js backend API for managing user roles with a scalable architecture designed for growth and maintainability.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start the server
npm start
```

Visit [http://localhost:8080/api-docs](http://localhost:8080/api-docs) for interactive API documentation.

## 📁 Project Structure

```
src/
├── app.js              # Express app configuration
├── config/             # Configuration files
├── controllers/        # Request handlers
├── middleware/         # Custom middleware
├── models/            # Data models and schemas
├── routes/            # API routes
├── services/          # Business logic
└── utils/             # Utility functions
```

## 🎯 Features

- **Role-based User Management**: Admin, Designer, Sales, User roles
- **Professional Architecture**: Clean separation of concerns
- **Comprehensive Validation**: Input validation with detailed error messages
- **Secure Authentication**: bcrypt password hashing and token authentication
- **Pagination Support**: Efficient data retrieval with pagination
- **Advanced Filtering**: Search by email, filter by role
- **Swagger Documentation**: Interactive API documentation
- **Scalable Structure**: Ready for multiple API modules

## 📚 API Endpoints

| Method   | Endpoint                   | Description                   |
| -------- | -------------------------- | ----------------------------- |
| `GET`    | `/api/users`               | Get all users with pagination |
| `GET`    | `/api/users/:id`           | Get user by ID                |
| `GET`    | `/api/users/search?email=` | Search user by email          |
| `GET`    | `/api/users/role/:role`    | Get users by role             |
| `POST`   | `/api/users`               | Create new user               |
| `PUT`    | `/api/users/:id`           | Update user                   |
| `DELETE` | `/api/users/:id`           | Delete user                   |

## 🔐 Authentication

All endpoints require an admin token:

```
Headers:
admin-token: your_admin_secret_token
```

## 🧪 Testing

```bash
# Run API tests
node tests/api.test.js
```

## 📖 Documentation

- **[Complete Documentation](./docs/README.md)** - Detailed setup and usage guide
- **[API Documentation](http://localhost:8080/api-docs)** - Interactive Swagger docs
- **[Database Schema](./database/schema.sql)** - Database structure

## 🛠️ Development

```bash
# Development mode with auto-reload
npm run dev

# Run tests
npm test
```

## 🎯 Future Modules

The architecture is ready for additional API modules:

- Invitations API
- Events API
- Templates API
- Analytics API

Each module follows the same pattern: Controller → Service → Model → Routes
