import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
        origin: [
            'http://localhost:3001', // Admin Dashboard (local)
            'http://localhost:3002', // User Web App (local)
            'https://nightclub-user-app.vercel.app', // User Web App (production)
            'https://nightclub-admin-dashboard.vercel.app', // Admin Dashboard (production)
            /\.vercel\.app$/, // Allow all Vercel preview deployments
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Enable validation pipes
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Set global prefix
    app.setGlobalPrefix('api');

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`🚀 Server is running on: http://localhost:${port}/api`);
}

// For Vercel serverless deployment
let cachedApp;
export async function handler(req, res) {
    if (!cachedApp) {
        const app = await NestFactory.create(AppModule);

        app.enableCors({
            origin: [
                'http://localhost:3001',
                'http://localhost:3002',
                'https://nightclub-user-app.vercel.app',
                'https://nightclub-admin-dashboard.vercel.app',
                /\.vercel\.app$/,
            ],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        });

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        app.setGlobalPrefix('api');

        await app.init();
        cachedApp = app.getHttpAdapter().getInstance();
    }

    return cachedApp(req, res);
}

// Only run bootstrap() if not in Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    bootstrap();
}
