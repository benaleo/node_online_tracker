import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PendingMessage = sequelize.define('PendingMessage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.JSON,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    sentAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'pending_messages',
    timestamps: false
});

export default PendingMessage;
