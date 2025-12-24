import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../config/typeorm.config';

async function createReviewsTable() {
    const dataSource = new DataSource(typeOrmConfig as any);

    try {
        await dataSource.initialize();
        console.log('📡 Connected to database');

        // Create reviews table
        await dataSource.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "userId" UUID NOT NULL,
                "nightclubId" UUID NOT NULL,
                rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
                title VARCHAR(200),
                comment TEXT NOT NULL,
                "isVerified" BOOLEAN DEFAULT false,
                "helpfulCount" INTEGER DEFAULT 0,
                "visitDate" DATE,
                "createdAt" TIMESTAMP DEFAULT NOW(),
                "updatedAt" TIMESTAMP DEFAULT NOW(),
                UNIQUE("userId", "nightclubId")
            );
        `);

        console.log('✅ Reviews table created successfully!');

        // Verify table exists
        const result = await dataSource.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name = 'reviews'
        `);

        if (result.length > 0) {
            console.log('✅ Verified: reviews table exists');
        }

    } catch (error) {
        console.error('❌ Error creating reviews table:', error);
    } finally {
        await dataSource.destroy();
    }
}

createReviewsTable();
