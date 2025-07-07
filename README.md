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
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **User Extras Field**: Flexible JSON field for storing additional user data (preferences, settings, metadata)
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
- **[Authentication Guide](./docs/authentication.md)** - JWT authentication setup and usage
- **[Extras Field Guide](./docs/extras-field.md)** - Using the flexible JSON extras field
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

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=8080
```

### 3. Database Setup

Run the SQL schema in your Supabase dashboard:

```sql
-- See database/schema.sql for the complete schema
```

### 4. Start the Server

```bash
npm start
```

The server will run on `http://localhost:8080`

## API Endpoints

### Authentication

All user management endpoints require an admin token in the header:

```
admin-token: admin-secret-token
```

### Endpoints

#### Get All Users

```
GET /api/users
```

#### Get User by ID

```
GET /api/users/:id
```

#### Create User

```
POST /api/users
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "designer"
}
```

#### Update User

```
PUT /api/users/:id
Content-Type: application/json

{
  "fullName": "Updated Name",
  "email": "updated@example.com",
  "role": "sales"
}
```

#### Delete User

```
DELETE /api/users/:id
```

## Validation Rules

### Password Requirements

- Minimum 8 characters
- Must contain at least one uppercase letter
- Must contain at least one lowercase letter
- Must contain at least one number
- Must contain at least one special character (@$!%\*?&)

### Email

- Must be a valid email format

### Role

- Must be one of: `designer`, `sales`, `user`

## API Documentation

Interactive API documentation is available at:

```
http://localhost:8080/api-docs
```

## Sample API Calls

### Create a Designer User

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -H "admin-token: admin-secret-token" \
  -d '{
    "fullName": "Jane Designer",
    "email": "jane@example.com",
    "password": "DesignPass123!",
    "role": "designer"
  }'
```

### Get All Users

```bash
curl -X GET http://localhost:8080/api/users \
  -H "admin-token: admin-secret-token"
```

### Update a User

```bash
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -H "admin-token: admin-secret-token" \
  -d '{
    "fullName": "Updated Name",
    "role": "sales"
  }'
```

## Security Features

- Password hashing with bcrypt (12 rounds)
- Input validation and sanitization
- Admin-only access control
- Email uniqueness validation
- SQL injection prevention through Supabase

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

## Success Responses

Successful operations return:

```json
{
  "success": true,
  "data": {
    /* user data */
  },
  "message": "Operation successful"
}
```

## Database Schema

The `users` table includes:

- `id`: Primary key
- `full_name`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `role`: User role (admin, designer, sales, user)
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

## Future Enhancements

- JWT token authentication
- Role-based permissions middleware
- Email verification
- Password reset functionality
- Rate limiting
- Audit logging

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all validations pass
