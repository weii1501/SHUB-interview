import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API Documentation',
            version: '1.0.0',
            description: 'API documentation for my Express application',
        },
        servers: [
            {
                url: 'http://localhost:3000', // URL server của bạn
                description: 'Local server',
            },
        ],
    },
    apis: ['src/routes/**/*.ts'], // Đường dẫn tới các file có chứa tài liệu Swagger
};

export default swaggerOptions;
