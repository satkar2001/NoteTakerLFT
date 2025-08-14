import swaggerJsdoc from 'swagger-jsdoc';
const options = {
    definition: {
        info: {
            title: 'NoteTaker API',
            description: 'Notes App for LFT by Satkar',
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? 'https://notetaker-backend-jpgb.onrender.com'
                    : 'https://notetaker-backend-jpgb.onrender.com',
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'User unique identifier'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address'
                        },
                        name: {
                            type: 'string',
                            description: 'User full name'
                        },
                        googleId: {
                            type: 'string',
                            description: 'Google OAuth ID'
                        },
                        avatar: {
                            type: 'string',
                            description: 'User avatar URL'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'User creation timestamp'
                        }
                    }
                },
                Note: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Note unique identifier'
                        },
                        title: {
                            type: 'string',
                            description: 'Note title'
                        },
                        content: {
                            type: 'string',
                            description: 'Note content'
                        },
                        tags: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Note tags'
                        },
                        userId: {
                            type: 'string',
                            format: 'uuid',
                            description: 'User ID who owns the note'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Note creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Note last update timestamp'
                        }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        token: {
                            type: 'string',
                            description: 'JWT authentication token'
                        },
                        user: {
                            $ref: '#/components/schemas/User'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Error message'
                        },
                        details: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: {
                                        type: 'string',
                                        description: 'Field name with error'
                                    },
                                    message: {
                                        type: 'string',
                                        description: 'Validation error message'
                                    }
                                }
                            }
                        }
                    }
                },
                PaginationResponse: {
                    type: 'object',
                    properties: {
                        notes: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Note'
                            }
                        },
                        pagination: {
                            type: 'object',
                            properties: {
                                page: {
                                    type: 'integer',
                                    description: 'Current page number'
                                },
                                limit: {
                                    type: 'integer',
                                    description: 'Number of items per page'
                                },
                                totalCount: {
                                    type: 'integer',
                                    description: 'Total number of items'
                                },
                                totalPages: {
                                    type: 'integer',
                                    description: 'Total number of pages'
                                },
                                hasNext: {
                                    type: 'boolean',
                                    description: 'Whether there is a next page'
                                },
                                hasPrev: {
                                    type: 'boolean',
                                    description: 'Whether there is a previous page'
                                }
                            }
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication and authorization endpoints'
            },
            {
                name: 'Notes',
                description: 'Note CRUD operations'
            }
        ]
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};
export const specs = swaggerJsdoc(options);
