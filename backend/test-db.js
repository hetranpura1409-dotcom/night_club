const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:MYivKzRsLuKGrQBQFlHJQEfEVcaMwVoG@yamanote.proxy.rlwy.net:57437/railway',
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect()
    .then(() => {
        console.log('✅ Connected successfully to Railway PostgreSQL!');
        return client.end();
    })
    .catch(err => {
        console.error('❌ Connection error:', err);
        process.exit(1);
    });
