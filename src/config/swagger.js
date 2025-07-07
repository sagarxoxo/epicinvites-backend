// src/config/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Epic Invites Backend API",
      version: "1.0.0",
      description: "API for managing user roles, invitations, and more",
      contact: {
        name: "Epic Invites Team",
        email: "dev@epicinvites.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8080}`,
        description: "Development server",
      },
      {
        url: "https://api.epicinvites.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        AdminToken: {
          type: "apiKey",
          in: "header",
          name: "admin-token",
          description: "Admin token for accessing protected endpoints",
        },
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT token for user authentication",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "User ID",
            },
            fullName: {
              type: "string",
              description: "User's full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            role: {
              type: "string",
              enum: ["admin", "designer", "sales", "user"],
              description: "User's role",
            },
            extras: {
              type: "object",
              description:
                "JSON field for storing additional user data such as invitations, preferences, etc.",
              example: { inviteData: {} },
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "User creation timestamp",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "User last update timestamp",
            },
          },
          required: ["id", "fullName", "email", "role"],
        },
        UserResponse: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "User ID",
            },
            fullName: {
              type: "string",
              description: "User's full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            role: {
              type: "string",
              enum: ["admin", "designer", "sales", "user"],
              description: "User's role",
            },
            extras: {
              type: "object",
              description:
                "JSON field for storing additional user data such as invitations, preferences, etc.",
              example: { inviteData: {} },
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "User creation timestamp",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "User last update timestamp",
            },
          },
          required: ["id", "fullName", "email", "role"],
        },
        CreateUserRequest: {
          type: "object",
          properties: {
            fullName: {
              type: "string",
              minLength: 2,
              maxLength: 100,
              description: "User's full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            password: {
              type: "string",
              minLength: 8,
              description:
                "User's password (must contain uppercase, lowercase, number, and special character)",
            },
            role: {
              type: "string",
              enum: ["designer", "sales", "user"],
              description: "User's role",
            },
            extras: {
              type: "object",
              description: "Additional user data stored as JSON",
              example: { inviteData: {} },
            },
          },
          required: ["fullName", "email", "password", "role"],
        },
        UpdateUserRequest: {
          type: "object",
          properties: {
            fullName: {
              type: "string",
              minLength: 2,
              maxLength: 100,
              description: "User's full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            password: {
              type: "string",
              minLength: 8,
              description:
                "User's password (must contain uppercase, lowercase, number, and special character)",
            },
            role: {
              type: "string",
              enum: ["admin", "designer", "sales", "user"],
              description: "User's role",
            },
            extras: {
              type: "object",
              description: "Additional user data stored as JSON",
              example: { inviteData: {} },
            },
          },
          minProperties: 1,
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
              description: "Indicates if the request was successful",
            },
            message: {
              type: "string",
              description: "Error message",
            },
            error: {
              type: "string",
              description: "Detailed error information",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              description: "Error timestamp",
            },
          },
          required: ["success", "message"],
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
              description: "Indicates if the request was successful",
            },
            message: {
              type: "string",
              description: "Success message",
            },
            data: {
              type: "object",
              description: "Response data",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              description: "Response timestamp",
            },
          },
          required: ["success", "message"],
        },
        ValidationError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
              description: "Indicates if the request was successful",
            },
            message: {
              type: "string",
              example: "Validation failed",
              description: "Error message",
            },
            errors: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of validation errors",
            },
          },
          required: ["success", "message", "errors"],
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "integer", description: "Category ID" },
            name: { type: "string", description: "Category name" },
            description: {
              type: "string",
              description: "Category description",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Created timestamp",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "Updated timestamp",
            },
          },
          required: ["id", "name"],
        },
        CreateCategoryRequest: {
          type: "object",
          properties: {
            name: { type: "string", description: "Category name" },
            description: {
              type: "string",
              description: "Category description",
            },
          },
          required: ["name"],
        },
        UpdateCategoryRequest: {
          type: "object",
          properties: {
            name: { type: "string", description: "Category name" },
            description: {
              type: "string",
              description: "Category description",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js", "./src/models/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
