import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../config/typeorm.config';

async function seedTables() {
    const dataSource = new DataSource(typeOrmConfig as any);

    try {
        await dataSource.initialize();
        console.log('📡 Connected to database');

        // Get a nightclub ID first
        const nightclubResult = await dataSource.query('SELECT id FROM nightclubs LIMIT 1');

        if (nightclubResult.length === 0) {
            console.log('❌ No nightclubs found. Please add nightclubs first.');
            return;
        }

        const nightclubId = nightclubResult[0].id;
        console.log(`✅ Using nightclub ID: ${nightclubId}`);

        // Insert sample tables
        const tables = [
            { name: 'VIP Table 1', capacity: 4, price: 300, nightclubId, available: true },
            { name: 'Premium Table 2', capacity: 6, price: 450, nightclubId, available: true },
            { name: 'VIP Table 3', capacity: 8, price: 600, nightclubId, available: true },
            { name: 'Exclusive Table 4', capacity: 10, price: 800, nightclubId, available: true },
            { name: 'Platinum Table 5', capacity: 12, price: 1000, nightclubId, available: true },
        ];

        for (const table of tables) {
            await dataSource.query(
                `INSERT INTO "tables" (name, capacity, price, "nightclubId", available, date, time, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
                [table.name, table.capacity, table.price, table.nightclubId, table.available, '2024-12-31', '22:00']
            );
            console.log(`✅ Added ${table.name} for ${table.capacity} guests (€${table.price})`);
        }

        console.log('🎉 Successfully seeded 5 tables!');
    } catch (error) {
        console.error('❌ Error seeding tables:', error);
    } finally {
        await dataSource.destroy();
    }
}

seedTables();
