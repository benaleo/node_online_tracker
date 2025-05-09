import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'node_tracker',
    logging: false,
    define: {
        timestamps: true
    }
});

// Initialize models
const Users = (await import('../models/Users.js')).default(sequelize);
const PendingMessage = (await import('../models/PendingMessage.js')).default(sequelize);

// Define associations
Users.hasMany(PendingMessage, {
    foreignKey: 'userId',
    as: 'pendingMessages',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

PendingMessage.belongsTo(Users, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// Sync database
async function syncDatabase() {
    try {
        await sequelize.sync({ force: false });
        console.log('Database synced successfully!');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
}

// Sync when module is imported
syncDatabase();

// Export models and sequelize instance
export { Users, PendingMessage, sequelize };
