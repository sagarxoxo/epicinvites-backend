# Epic Invites Backend - Folder Structure

```
EpicInvitesBackend/
├── 📁 src/                      # Source code
│   ├── 📄 app.js                # Express app configuration
│   ├── 📁 config/               # Configuration files
│   │   ├── 📄 constants.js      # Application constants
│   │   ├── 📄 database.js       # Database connection
│   │   └── 📄 swagger.js        # Swagger configuration
│   ├── 📁 controllers/          # Request handlers
│   │   └── 📄 userController.js # User business logic
│   ├── 📁 middleware/           # Custom middleware
│   │   ├── 📄 auth.js           # Authentication middleware
│   │   ├── 📄 errorHandler.js   # Error handling
│   │   └── 📄 validation.js     # Input validation
│   ├── 📁 models/               # Data models
│   │   └── 📄 User.js           # User model and schemas
│   ├── 📁 routes/               # API routes
│   │   ├── 📄 index.js          # Main routes
│   │   └── 📄 userRoutes.js     # User-specific routes
│   ├── 📁 services/             # Business logic
│   │   └── 📄 userService.js    # User data access layer
│   └── 📁 utils/                # Utility functions
│       ├── 📄 passwordHelper.js # Password utilities
│       ├── 📄 responseHelper.js # Response formatting
│       └── 📄 validationHelper.js # Validation utilities
├── 📁 tests/                    # Test files
│   └── 📄 api.test.js           # API test suite
├── 📁 docs/                     # Documentation
│   └── 📄 README.md             # Detailed documentation
├── 📁 database/                 # Database files
│   └── 📄 schema.sql            # Database schema
├── 📄 server.js                 # Application entry point
├── 📄 package.json              # Project dependencies
├── 📄 .env.example              # Environment variables template
└── 📄 README.md                 # Project overview

# Legacy Files (can be removed after migration)
├── 📄 supabaseClient.js         # OLD: Moved to src/config/database.js
├── 📁 middleware/               # OLD: Moved to src/middleware/
├── 📁 routes/                   # OLD: Moved to src/routes/
├── 📁 services/                 # OLD: Moved to src/services/
└── 📁 test/                     # OLD: Moved to tests/
```

## 🎯 Architecture Benefits

### **Clean Separation of Concerns**

- **Config**: Environment and application configuration
- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic and data access
- **Models**: Data structures and validation
- **Middleware**: Cross-cutting concerns (auth, validation, etc.)
- **Utils**: Reusable utility functions

### **Scalable for Multiple APIs**

Ready to add new API modules:

- `src/controllers/invitationController.js`
- `src/services/invitationService.js`
- `src/routes/invitationRoutes.js`
- `src/models/Invitation.js`

### **Easy Testing**

- Centralized test directory
- Modular components for unit testing
- Comprehensive API integration tests

### **Professional Standards**

- Industry-standard folder structure
- Clear file naming conventions
- Logical grouping of related functionality
- Easy navigation and maintenance
