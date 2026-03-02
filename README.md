# ibc-tank-store

## Authors

👤 **Abdul Qadeer**  
🔗 GitHub: *(https://github.com/qadeer015)*  

👤 **Zaheer Ahmed**  
🔗 GitHub: *(https://github.com/ZaheerAhmedkhan65)*  

👤 **Kafil**  
🔗 GitHub: *(https://github.com/RanaKafilAnwar)*  


## Installation

```bash
git clone git@github.com:qadeer015/ibc-tank-store.git
cd ibc-tank-store
npm install
```

Create a `.env` file in the root directory and add the following environment variables:

```bash
DB_USER=<your-database-username>
DB_PASS=<your-database-password>
DB_NAME=<your-database-name>
```

## Database Setup

Run the following commands to set up the database schema and seed data:

**Create tables**

```bash
npm run db:create
```

**Seed data**

```bash
npm run db:seed
```

**Reset everything(Tables and data)**

```bash
npm run db:reset
```

## Run the application

```bash
npm start 
```

**Run the application in development mode**

```bash
npm run dev
```
