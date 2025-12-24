import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            useFactory: () => typeOrmConfig,
        }),
        AuthModule,
        NightclubsModule,
        EventsModule,
        NotificationsModule,
        TablesModule,
        BookingsModule,
        ReviewsModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule { }



