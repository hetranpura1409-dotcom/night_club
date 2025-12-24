import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../config/typeorm.config';

async function testReview() {
    const dataSource = new DataSource(typeOrmConfig as any);

    try {
        await dataSource.initialize();
        console.log('📡 Connected to database');

        // Check reviews table structure
        const tableInfo = await dataSource.query(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'reviews'
            ORDER BY ordinal_position;
        `);

        console.log('✅ Reviews table structure:');
        console.table(tableInfo);

        // Try to insert a test review
        console.log('\n📝 Attempting to insert test review...');
        const result = await dataSource.query(`
            INSERT INTO reviews (
                "userId", 
                "nightclubId", 
                rating, 
                comment, 
                "isVerified", 
                "helpfulCount"
            ) VALUES (
                '00000000-0000-0000-0000-000000000001',
                '91d43c00-5c30-4fec-a709-32ba3205cc13',
                5,
                'Test review from script',
                false,
                0
            ) RETURNING *;
        `);

        console.log('✅ Test review inserted successfully!');
        console.log(result);

        // Clean up test review
        await dataSource.query(`DELETE FROM reviews WHERE comment = 'Test review from script'`);
        console.log('🗑️ Test review deleted');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await dataSource.destroy();
    }
}

testReview();
