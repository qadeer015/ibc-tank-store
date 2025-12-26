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
























Schema for categories:
┌─────────┬────────┬────────────────┬──────┬───────┬─────────┬──────────────────┐
│ (index) │ Field  │ Type           │ Null │ Key   │ Default │ Extra            │
├─────────┼────────┼────────────────┼──────┼───────┼─────────┼──────────────────┤
│ 0       │ 'id'   │ 'int(11)'      │ 'NO' │ 'PRI' │ null    │ 'auto_increment' │
│ 1       │ 'name' │ 'varchar(255)' │ 'NO' │ ''    │ null    │ ''               │
└─────────┴────────┴────────────────┴──────┴───────┴─────────┴──────────────────┘

Schema for contacts:
┌─────────┬──────────────┬────────────────┬───────┬───────┬─────────────────────┬──────────────────┐
│ (index) │ Field        │ Type           │ Null  │ Key   │ Default             │ Extra            │
├─────────┼──────────────┼────────────────┼───────┼───────┼─────────────────────┼──────────────────┤
│ 0       │ 'id'         │ 'int(11)'      │ 'NO'  │ 'PRI' │ null                │ 'auto_increment' │
│ 1       │ 'name'       │ 'varchar(255)' │ 'YES' │ ''    │ null                │ ''               │
│ 2       │ 'email'      │ 'varchar(255)' │ 'YES' │ ''    │ null                │ ''               │
│ 3       │ 'contact_no' │ 'varchar(20)'  │ 'YES' │ ''    │ null                │ ''               │
│ 4       │ 'message'    │ 'text'         │ 'YES' │ ''    │ null                │ ''               │
│ 5       │ 'created_at' │ 'timestamp'    │ 'YES' │ ''    │ 'CURRENT_TIMESTAMP' │ ''               │
└─────────┴──────────────┴────────────────┴───────┴───────┴─────────────────────┴──────────────────┘

Schema for products:
┌─────────┬───────────────┬─────────────────┬───────┬───────┬─────────────────────┬──────────────────┐
│ (index) │ Field         │ Type            │ Null  │ Key   │ Default             │ Extra            │
├─────────┼───────────────┼─────────────────┼───────┼───────┼─────────────────────┼──────────────────┤
│ 0       │ 'id'          │ 'int(11)'       │ 'NO'  │ 'PRI' │ null                │ 'auto_increment' │
│ 1       │ 'name'        │ 'varchar(255)'  │ 'YES' │ ''    │ null                │ ''               │
│ 2       │ 'description' │ 'text'          │ 'YES' │ ''    │ null                │ ''               │
│ 3       │ 'price'       │ 'decimal(10,2)' │ 'YES' │ ''    │ null                │ ''               │
│ 4       │ 'image'       │ 'varchar(255)'  │ 'YES' │ ''    │ null                │ ''               │
│ 5       │ 'category_id' │ 'int(11)'       │ 'YES' │ ''    │ null                │ ''               │
│ 6       │ 'condition'   │ 'varchar(100)'  │ 'YES' │ ''    │ null                │ ''               │
│ 7       │ 'stock'       │ 'int(11)'       │ 'YES' │ ''    │ '0'                 │ ''               │
│ 8       │ 'rating'      │ 'decimal(3,2)'  │ 'YES' │ ''    │ '0.00'              │ ''               │
│ 9       │ 'created_at'  │ 'timestamp'     │ 'YES' │ ''    │ 'CURRENT_TIMESTAMP' │ ''               │
└─────────┴───────────────┴─────────────────┴───────┴───────┴─────────────────────┴──────────────────┘

Schema for sessions:
┌─────────┬──────────────┬────────────────────┬───────┬───────┬─────────┬───────┐
│ (index) │ Field        │ Type               │ Null  │ Key   │ Default │ Extra │
├─────────┼──────────────┼────────────────────┼───────┼───────┼─────────┼───────┤
│ 0       │ 'session_id' │ 'varchar(128)'     │ 'NO'  │ 'PRI' │ null    │ ''    │
│ 1       │ 'expires'    │ 'int(11) unsigned' │ 'NO'  │ ''    │ null    │ ''    │
│ 2       │ 'data'       │ 'mediumtext'       │ 'YES' │ ''    │ null    │ ''    │
└─────────┴──────────────┴────────────────────┴───────┴───────┴─────────┴───────┘

Schema for settings:
┌─────────┬─────────┬────────────────┬──────┬───────┬─────────┬──────────────────┐
│ (index) │ Field   │ Type           │ Null │ Key   │ Default │ Extra            │
├─────────┼─────────┼────────────────┼──────┼───────┼─────────┼──────────────────┤
│ 0       │ 'id'    │ 'int(11)'      │ 'NO' │ 'PRI' │ null    │ 'auto_increment' │
│ 1       │ 'key'   │ 'varchar(255)' │ 'NO' │ ''    │ null    │ ''               │
│ 2       │ 'value' │ 'text'         │ 'NO' │ ''    │ null    │ ''               │
└─────────┴─────────┴────────────────┴──────┴───────┴─────────┴──────────────────┘

Schema for slides:
┌─────────┬─────────────────┬────────────────┬───────┬───────┬─────────────────────┬──────────────────┐
│ (index) │ Field           │ Type           │ Null  │ Key   │ Default             │ Extra            │
├─────────┼─────────────────┼────────────────┼───────┼───────┼─────────────────────┼──────────────────┤
│ 0       │ 'id'            │ 'int(11)'      │ 'NO'  │ 'PRI' │ null                │ 'auto_increment' │
│ 1       │ 'product_id'    │ 'int(11)'      │ 'NO'  │ ''    │ null                │ ''               │
│ 2       │ 'image'         │ 'varchar(255)' │ 'NO'  │ ''    │ null                │ ''               │
│ 3       │ 'title'         │ 'varchar(255)' │ 'YES' │ ''    │ null                │ ''               │
│ 4       │ 'description'   │ 'text'         │ 'YES' │ ''    │ null                │ ''               │
│ 5       │ 'link'          │ 'varchar(255)' │ 'YES' │ ''    │ null                │ ''               │
│ 6       │ 'display_order' │ 'int(11)'      │ 'YES' │ ''    │ '0'                 │ ''               │
│ 7       │ 'created_at'    │ 'timestamp'    │ 'YES' │ ''    │ 'CURRENT_TIMESTAMP' │ ''               │
└─────────┴─────────────────┴────────────────┴───────┴───────┴─────────────────────┴──────────────────┘

Schema for users:
┌─────────┬──────────────────┬────────────────────────────┬───────┬───────┬─────────────────────┬──────────────────┐
│ (index) │ Field            │ Type                       │ Null  │ Key   │ Default             │ Extra            │
├─────────┼──────────────────┼────────────────────────────┼───────┼───────┼─────────────────────┼──────────────────┤
│ 0       │ 'id'             │ 'int(11)'                  │ 'NO'  │ 'PRI' │ null                │ 'auto_increment' │
│ 1       │ 'google_id'      │ 'varchar(255)'             │ 'YES' │ 'UNI' │ null                │ ''               │
│ 2       │ 'name'           │ 'varchar(255)'             │ 'YES' │ ''    │ null                │ ''               │
│ 3       │ 'email'          │ 'varchar(255)'             │ 'YES' │ 'UNI' │ null                │ ''               │
│ 4       │ 'password'       │ 'varchar(255)'             │ 'YES' │ ''    │ null                │ ''               │
│ 5       │ 'profile_photo'  │ 'text'                     │ 'YES' │ ''    │ null                │ ''               │
│ 6       │ 'created_at'     │ 'timestamp'                │ 'YES' │ ''    │ 'CURRENT_TIMESTAMP' │ ''               │
│ 7       │ 'role'           │ "enum('customer','admin')" │ 'YES' │ ''    │ 'customer'          │ ''               │
│ 8       │ 'email_verified' │ 'tinyint(1)'               │ 'YES' │ ''    │ '0'                 │ ''               │
└─────────┴──────────────────┴────────────────────────────┴───────┴───────┴─────────────────────┴──────────────────┘
  * write mysql queries to create these tables with this schema * 
