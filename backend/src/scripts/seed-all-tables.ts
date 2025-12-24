import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../config/typeorm.config';

async function seedTablesForAllVenues() {
    const dataSource = new DataSource(typeOrmConfig as any);

    try {
        await dataSource.initialize();
        console.log('📡 Connected to database');

        // Get ALL nightclubs
        const nightclubs = await dataSource.query('SELECT id, name FROM nightclubs');

        if (nightclubs.length === 0) {
            console.log('❌ No nightclubs found. Please add nightclubs first.');
            return;
        }

        console.log(`✅ Found ${nightclubs.length} nightclubs`);

        // Add tables to EACH nightclub
        for (const nightclub of nightclubs) {
            console.log(`\n📍 Adding tables to: ${nightclub.name}`);

            const tables = [
                { name: 'VIP Table 1', capacity: 4, price: 300, available: true },
                { name: 'Premium Table 2', capacity: 6, price: 450, available: true },
                { name: 'VIP Table 3', capacity: 8, price: 600, available: true },
                { name: 'Exclusive Table 4', capacity: 10, price: 800, available: true },
                { name: 'Platinum Table 5', capacity: 12, price: 1000, available: true },
            ];

            for (const table of tables) {
                await dataSource.query(
                    `INSERT INTO "tables" (name, capacity, price, "nightclubId", available, date, time, "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
                    [table.name, table.capacity, table.price, nightclub.id, table.available, '2024-12-31', '22:00']
                );
                console.log(`  ✅ ${table.name} (${table.capacity} guests - €${table.price})`);
            }
        }

        console.log(`\n🎉 Successfully added tables to ${nightclubs.length} venues!`);
    } catch (error) {
        console.error('❌ Error seeding tables:', error);
    } finally {
        await dataSource.destroy();
    }
}

seedTablesForAllVenues();
