import sequelize from './config/database.js';
import PendingMessage from './models/PendingMessage.js';

async function syncDatabase() {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synced successfully!');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
}

syncDatabase();
