# JWT Authentication System Documentation

This document provides comprehensive information about the JWT-based authentication system implemented in the Epic Invites Backend.

## Overview

The authentication system provides secure user authentication using JSON Web Tokens (JWT) with the following features:

- **User Login/Logout**: Email and password authentication
- **Token Management**: Access tokens and refresh tokens
- **Role-Based Access Control**: Admin, Designer, Sales, and User roles
- **Token Verification**: Middleware for protecting routes
- **Profile Management**: User profile retrieval and updates
- **Security**: Password hashing, token expiration, and validation

## Authentication Flow

### 1. User Registration

Users are created by administrators through the `/api/users` endpoint with proper role assignment.

### 2. Login Process

```
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

### 3. Token Usage

Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### 4. Token Refresh

```
POST /api/auth/refresh
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint            | Description              | Authentication |
| ------ | ------------------- | ------------------------ | -------------- |
| POST   | `/api/auth/login`   | User login               | None           |
| POST   | `/api/auth/refresh` | Refresh access token     | None           |
| GET    | `/api/auth/profile` | Get current user profile | Bearer Token   |
| POST   | `/api/auth/logout`  | User logout              | Bearer Token   |
| GET    | `/api/auth/verify`  | Verify token validity    | Bearer Token   |

### Protected Routes

| Method | Endpoint         | Description    | Required Role  |
| ------ | ---------------- | -------------- | -------------- |
| GET    | `/api/users`     | Get all users  | Admin          |
| POST   | `/api/users`     | Create user    | Admin          |
| GET    | `/api/users/:id` | Get user by ID | Admin or Owner |
| PUT    | `/api/users/:id` | Update user    | Admin or Owner |
| DELETE | `/api/users/:id` | Delete user    | Admin          |

## Middleware

### AuthMiddleware.requireAuth

Validates JWT token and attaches user to request object.

```javascript
router.get("/protected", AuthMiddleware.requireAuth, (req, res) => {
  // req.user contains authenticated user data
  res.json({ user: req.user });
});
```

### AuthMiddleware.requireAdmin

Validates JWT token and ensures user has admin role.

```javascript
router.post("/admin-only", AuthMiddleware.requireAdmin, (req, res) => {
  // req.admin contains admin user data
  res.json({ admin: req.admin });
});
```

### AuthMiddleware.requireRole

Validates JWT token and ensures user has specific role(s).

```javascript
router.get(
  "/designer-route",
  AuthMiddleware.requireRole("designer"),
  (req, res) => {
    // User has designer role
    res.json({ message: "Welcome designer!" });
  }
);

// Multiple roles
router.get(
  "/sales-designer",
  AuthMiddleware.requireRole(["designer", "sales"]),
  (req, res) => {
    // User has either designer or sales role
    res.json({ message: "Welcome!" });
  }
);
```

### AuthMiddleware.requireAdminOrOwner

Validates JWT token and ensures user is admin or owns the resource.

```javascript
router.get(
  "/users/:id",
  AuthMiddleware.requireAdminOrOwner("id"),
  (req, res) => {
    // User is admin or accessing their own profile
    res.json({ user: req.user || req.admin });
  }
);
```

## Token Configuration

### JWT Settings

```javascript
// src/config/constants.js
JWT: {
  SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  EXPIRES_IN: '24h',
  REFRESH_EXPIRES_IN: '7d',
  ALGORITHM: 'HS256'
}
```

### Environment Variables

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

## Security Features

### Password Security

- **Bcrypt Hashing**: Passwords are hashed with salt rounds of 12
- **Password Requirements**: Minimum 8 characters with uppercase, lowercase, number, and special character

### Token Security

- **Short-lived Access Tokens**: 24-hour expiration
- **Refresh Tokens**: 7-day expiration for token renewal
- **Token Validation**: Format and signature verification
- **User Verification**: Database lookup to ensure user still exists and has proper role

### Error Handling

- **Specific Error Messages**: Clear feedback for different error types
- **Token Expiration**: Automatic handling of expired tokens
- **Invalid Tokens**: Proper rejection of malformed or invalid tokens

## Usage Examples

### Client-side Login

```javascript
// Login
const loginResponse = await fetch("/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "user@example.com",
    password: "userpassword",
  }),
});

const { data } = await loginResponse.json();
const { accessToken, refreshToken } = data;

// Store tokens securely (e.g., in httpOnly cookies or secure storage)
localStorage.setItem("accessToken", accessToken);
localStorage.setItem("refreshToken", refreshToken);
```

### Making Authenticated Requests

```javascript
const token = localStorage.getItem("accessToken");

const response = await fetch("/api/users", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

if (response.status === 401) {
  // Token expired, try to refresh
  await refreshToken();
  // Retry request with new token
}
```

### Token Refresh

```javascript
async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");

  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (response.ok) {
    const { data } = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
  } else {
    // Refresh failed, redirect to login
    window.location.href = "/login";
  }
}
```

## Testing

### Running Authentication Tests

```bash
# Run all tests including authentication
npm test

# Run Jest tests (if using Jest)
npm run test:jest
```

### Test Coverage

The authentication system includes comprehensive tests for:

- User login with valid/invalid credentials
- Token refresh functionality
- Protected route access
- Role-based access control
- Token verification
- Error handling

### Manual Testing with cURL

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"userpassword"}'

# Use token for protected route
curl -X GET http://localhost:8080/api/auth/profile \
  -H "Authorization: Bearer <your_token_here>"

# Refresh token
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<your_refresh_token_here>"}'
```

## Best Practices

### Security

1. **Environment Variables**: Always use environment variables for JWT secrets
2. **Token Expiration**: Keep access tokens short-lived (24 hours or less)
3. **Refresh Tokens**: Use refresh tokens for longer sessions
4. **HTTPS**: Always use HTTPS in production
5. **Token Storage**: Store tokens securely on the client side

### Implementation

1. **Error Handling**: Provide clear error messages without exposing sensitive information
2. **Token Validation**: Always validate tokens on the server side
3. **User Verification**: Check if user still exists and has proper roles
4. **Logging**: Log authentication events for security monitoring

### Frontend Integration

1. **Token Management**: Implement automatic token refresh
2. **Route Protection**: Protect routes based on authentication state
3. **Error Handling**: Handle 401/403 errors gracefully
4. **User Experience**: Provide clear feedback for authentication states

## Troubleshooting

### Common Issues

1. **Token Expired Error**

   - Solution: Implement token refresh mechanism
   - Check token expiration times

2. **Invalid Token Error**

   - Solution: Verify token format and signature
   - Check if JWT_SECRET is consistent

3. **User Not Found Error**

   - Solution: Verify user still exists in database
   - Check if user was deleted after token creation

4. **Role Access Denied**
   - Solution: Verify user has required role
   - Check if user role was changed after token creation

### Debugging

1. Enable detailed logging in development
2. Use token verification endpoint to debug tokens
3. Check database for user existence and roles
4. Verify environment variables are set correctly

## Migration from Legacy System

If migrating from the legacy admin-token system:

1. **Backward Compatibility**: The system supports both JWT and legacy admin tokens
2. **Gradual Migration**: Update clients to use JWT tokens progressively
3. **Admin Token Deprecation**: Plan to remove admin-token support in future versions

## Future Enhancements

Potential improvements for the authentication system:

1. **Token Blacklisting**: Implement token blacklist for logout
2. **Multi-factor Authentication**: Add 2FA support
3. **OAuth Integration**: Support for third-party authentication
4. **Rate Limiting**: Add login attempt rate limiting
5. **Session Management**: Track active sessions
6. **Email Verification**: Require email verification for new accounts
