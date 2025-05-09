import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default function defineUsers(sequelize) {
    const Users = sequelize.define('Users', {
        id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        domain: {
            type: DataTypes.STRING,
            allowNull: false
        },
        license: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        lastActivity: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'users',
        timestamps: false
    });

    // Add static method for validation
    Users.validateLicense = async function(license, domain) {
        const user = await Users.findOne({
            where: {
                license,
                domain
            }
        });

        return !!user;
    };

    return Users;
}
