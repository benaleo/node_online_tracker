import { DataTypes } from 'sequelize';

export default function definePendingMessage(sequelize) {
    const PendingMessage = sequelize.define('PendingMessage', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
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

    return PendingMessage;
}
