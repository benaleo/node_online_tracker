const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
    // For production with connection string
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        define: {
            timestamps: true,
            underscored: true,
        },
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
} else {
    // For local development
    sequelize = new Sequelize(
        process.env.DB_NAME || 'node_tracker',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASSWORD || '',
        {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            dialect: 'postgres',
            logging: process.env.NODE_ENV === 'development' ? console.log : false,
            define: {
                timestamps: true,
                underscored: true,
            },
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }
    );
}

// Initialize models
const Users = require('../models/Users')(sequelize);
const PendingMessage = require('../models/PendingMessage')(sequelize);

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

// Test connection
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

// Sync database
async function syncDatabase() {
    try {
        await sequelize.sync({ force: false });
        console.log('Database synced successfully!');
    } catch (error) {
        console.error('Error syncing database:', error);
        process.exit(1);
    }
}

// Test and sync database
(async () => {
    await testConnection();
    await syncDatabase();
})();

// Export models and sequelize instance
module.exports = {
    Users,
    PendingMessage,
    sequelize,
    testConnection,
    syncDatabase
};
