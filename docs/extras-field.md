# User Extras Field Documentation

## Overview

The `extras` field is a JSONB column in the users table that allows storing additional user data as JSON. This field is flexible and can store various types of user-specific information like preferences, settings, metadata, and custom data.

## Database Schema

```sql
-- Column definition
extras JSONB DEFAULT '{}'

-- Index for better performance
CREATE INDEX idx_users_extras ON users USING GIN (extras);
```

## Usage Examples

### 1. User Preferences

```json
{
  "preferences": {
    "theme": "dark",
    "language": "en",
    "notifications": true,
    "timezone": "UTC"
  }
}
```

### 2. User Settings

```json
{
  "settings": {
    "emailNotifications": true,
    "smsNotifications": false,
    "privacy": {
      "profileVisible": true,
      "showEmail": false
    }
  }
}
```

### 3. Metadata

```json
{
  "metadata": {
    "source": "registration_form",
    "campaign": "summer_2025",
    "referrer": "google_ads",
    "lastLogin": "2025-07-07T10:00:00Z"
  }
}
```

### 4. Custom Application Data

```json
{
  "profile": {
    "avatar": "https://example.com/avatar.jpg",
    "bio": "Software developer passionate about Node.js",
    "socialLinks": {
      "twitter": "@username",
      "linkedin": "linkedin.com/in/username"
    }
  }
}
```

**Example of the `extras` field:**

```json
{
  "inviteData": {}
}
```

## API Usage

### Creating a User with Extras

```javascript
POST /api/users
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "user",
  "extras": {
    "inviteData": {}
  }
}
```

### Updating User Extras

```javascript
PUT /api/users/123
{
  "extras": {
    "preferences": {
      "theme": "light",
      "notifications": false,
      "language": "es"
    },
    "settings": {
      "emailNotifications": true
    }
  }
}
```

### Retrieving User with Extras

```javascript
GET /api/users/123
// Response:
{
  "success": true,
  "data": {
    "id": 123,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "extras": {
      "preferences": {
        "theme": "light",
        "notifications": false,
        "language": "es"
      },
      "settings": {
        "emailNotifications": true
      }
    },
    "createdAt": "2025-07-07T10:00:00Z",
    "updatedAt": "2025-07-07T10:30:00Z"
  }
}
```

## Frontend Integration

### React Example

```javascript
// Store user preferences
const updateUserPreferences = async (userId, preferences) => {
  const response = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      extras: {
        ...user.extras,
        preferences: preferences,
      },
    }),
  });

  return response.json();
};

// Get user theme preference
const getUserTheme = (user) => {
  return user.extras?.preferences?.theme || "light";
};

// Update specific preference
const updateTheme = async (userId, theme) => {
  const currentExtras = user.extras || {};
  const currentPreferences = currentExtras.preferences || {};

  await updateUserPreferences(userId, {
    ...currentPreferences,
    theme: theme,
  });
};
```

### Vue.js Example

```javascript
// Composable for user preferences
export const useUserPreferences = () => {
  const updatePreference = async (key, value) => {
    const user = getCurrentUser();
    const extras = { ...user.extras };

    if (!extras.preferences) {
      extras.preferences = {};
    }

    extras.preferences[key] = value;

    await updateUser(user.id, { extras });
  };

  const getPreference = (key, defaultValue = null) => {
    const user = getCurrentUser();
    return user.extras?.preferences?.[key] || defaultValue;
  };

  return {
    updatePreference,
    getPreference,
  };
};
```

## Database Queries

### PostgreSQL/Supabase Examples

```sql
-- Get users with specific preference
SELECT * FROM users
WHERE extras->>'preferences'->>'theme' = 'dark';

-- Get users with email notifications enabled
SELECT * FROM users
WHERE (extras->'settings'->>'emailNotifications')::boolean = true;

-- Update specific preference for a user
UPDATE users
SET extras = jsonb_set(extras, '{preferences,theme}', '"light"')
WHERE id = 123;

-- Add new preference without overwriting existing ones
UPDATE users
SET extras = jsonb_set(
  COALESCE(extras, '{}'),
  '{preferences,newSetting}',
  '"value"'
)
WHERE id = 123;

-- Remove a preference
UPDATE users
SET extras = extras #- '{preferences,oldSetting}'
WHERE id = 123;
```

## Best Practices

### 1. Structure Your Data

```json
{
  "preferences": {
    // User interface preferences
  },
  "settings": {
    // Application settings
  },
  "metadata": {
    // System metadata
  },
  "profile": {
    // Extended profile information
  }
}
```

### 2. Validate JSON Structure

```javascript
// Client-side validation
const validateExtras = (extras) => {
  const schema = {
    preferences: {
      theme: ["light", "dark"],
      language: ["en", "es", "fr"],
      notifications: "boolean",
    },
    settings: {
      emailNotifications: "boolean",
    },
  };

  // Validation logic here
};
```

### 3. Default Values

```javascript
const getDefaultExtras = () => ({
  preferences: {
    theme: "light",
    language: "en",
    notifications: true,
  },
  settings: {
    emailNotifications: true,
    smsNotifications: false,
  },
});
```

### 4. Migration Strategy

```javascript
// Handle extras field migration
const migrateUserExtras = (user) => {
  if (!user.extras) {
    user.extras = getDefaultExtras();
  }

  // Add new fields with defaults
  if (!user.extras.preferences) {
    user.extras.preferences = {};
  }

  // Set defaults for new preferences
  if (user.extras.preferences.theme === undefined) {
    user.extras.preferences.theme = "light";
  }

  return user;
};
```

## Performance Considerations

### 1. Indexing

- GIN index is created for efficient JSON queries
- Consider partial indexes for frequently queried fields

### 2. Query Optimization

```sql
-- Good: Use JSON operators efficiently
SELECT * FROM users
WHERE extras @> '{"preferences": {"theme": "dark"}}';

-- Better: Use GIN index effectively
CREATE INDEX idx_users_theme ON users USING GIN ((extras->'preferences'));
```

### 3. Size Limits

- Keep extras field reasonable in size (< 1KB recommended)
- Use separate tables for large JSON data

## Security Considerations

### 1. Input Validation

```javascript
const sanitizeExtras = (extras) => {
  // Remove potentially dangerous fields
  const sanitized = { ...extras };
  delete sanitized.admin;
  delete sanitized.permissions;

  return sanitized;
};
```

### 2. Access Control

```javascript
const canUpdateExtras = (user, targetUser) => {
  // Users can only update their own extras
  return user.id === targetUser.id || user.role === "admin";
};
```

## Testing

### Unit Tests

```javascript
describe("User Extras Field", () => {
  it("should create user with extras", async () => {
    const userData = {
      fullName: "Test User",
      email: "test@example.com",
      password: "TestPass123!",
      role: "user",
      extras: {
        preferences: { theme: "dark" },
      },
    };

    const user = await UserService.createUser(userData);
    expect(user.extras.preferences.theme).toBe("dark");
  });

  it("should update user extras", async () => {
    const user = await UserService.createUser(testUserData);

    const updatedUser = await UserService.updateUser(user.id, {
      extras: {
        preferences: { theme: "light" },
      },
    });

    expect(updatedUser.extras.preferences.theme).toBe("light");
  });
});
```

### Integration Tests

```javascript
describe("Extras API Integration", () => {
  it("should handle extras in user creation", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("admin-token", "admin-secret-token")
      .send({
        fullName: "Test User",
        email: "test@example.com",
        password: "TestPass123!",
        role: "user",
        extras: {
          preferences: { theme: "dark" },
        },
      });

    expect(response.status).toBe(201);
    expect(response.body.data.extras.preferences.theme).toBe("dark");
  });
});
```

## Troubleshooting

### Common Issues

1. **JSON Parsing Errors**

   - Ensure valid JSON format
   - Check for special characters

2. **Performance Issues**

   - Use appropriate indexes
   - Limit JSON size

3. **Data Inconsistency**
   - Implement validation
   - Use transactions for updates

### Debugging

```javascript
// Log extras field updates
const logExtrasUpdate = (userId, oldExtras, newExtras) => {
  console.log("Extras Update:", {
    userId,
    before: oldExtras,
    after: newExtras,
    timestamp: new Date().toISOString(),
  });
};
```

## Migration Guide

To add the extras field to your existing database:

1. **Run the migration SQL** in your Supabase dashboard
2. **Update your application code** to handle the new field
3. **Test thoroughly** with the provided test script
4. **Deploy incrementally** to avoid downtime

The extras field provides flexibility for storing additional user data without requiring schema changes, making your application more extensible and maintainable.
