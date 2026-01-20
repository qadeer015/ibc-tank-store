const db = require('./config/db');

async function run() {
    try {
        const tables = ["categories", "contacts", "products", "sessions", "settings", "slides", "users"];

        if (!tables.length) {
            console.log('No tables found.');
            return;
        }

        for (const table of tables) {
            const tableName = table;

            const [schema] = await db.execute(
                `DESCRIBE \`${tableName}\``
            );

            console.log(`\nSchema for ${tableName}:`);
            console.table(schema);
        }
    } catch (err) {
        console.error('Error executing query:', err);
    } finally {
        // ✅ properly close the pool instead of process.exit
        await db.end();
    }
}


run();