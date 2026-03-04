import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { NightclubsModule } from './modules/nightclubs/nightclubs.module';
import { EventsModule } from './modules/events/events.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TablesModule } from './modules/tables/tables.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { FavoritesModule } from './modules/favorites/favorites.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                url: config.get('DATABASE_URL'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
                ssl: {
                    rejectUnauthorized: false,
                },
            }),
        }),
        AuthModule,
        NightclubsModule,
        EventsModule,
        NotificationsModule,
        TablesModule,
        BookingsModule,
        ReviewsModule,
        FavoritesModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule { }



