import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_URL ? undefined : (process.env.DATABASE_HOST || 'localhost'),
    port: process.env.DATABASE_URL ? undefined : parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_URL ? undefined : (process.env.DATABASE_USER || 'postgres'),
    password: process.env.DATABASE_URL ? undefined : (process.env.DATABASE_PASSWORD || 'postgres'),
    database: process.env.DATABASE_URL ? undefined : (process.env.DATABASE_NAME || 'nightclub_poc'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
};
