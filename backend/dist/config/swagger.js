"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.specs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'NoteTaker API',
            version: '1.0.0',
            description: 'Notes App for LFT by Satkar',
         
            
        },
        servers: [
            {
                url: 'https://notetaker-backend-jpgb.onrender.com',
                description: 'Development server'
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
                name: 'NoteTakerLFT',
                description: 'Note taking application'
            }
        ]
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};
exports.specs = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.js.map