import { DataTypes, Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default function defineUsers(sequelize) {
    const Users = sequelize.define('Users', {
        id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true
        },
        domain: {
            type: DataTypes.STRING,
            allowNull: false
        },
        license: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isValid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        validUntil: {
            type: DataTypes.DATE,
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

    Users.validateLicense = async function(license, domain) {
        console.log(`Checking user for domain: ${domain}, license: ${license}`);
        
        const user = await Users.findOne({
            where: {
                license,
                domain
            }
        });

        if (user) {
            console.log('User found:', {
                userId: user.id,
                domain: user.domain,
                license: user.license,
                isValid: user.isValid,
                validUntil: user.validUntil,
                createdAt: user.createdAt,
                lastActivity: user.lastActivity
            });
            return user;
        } else {
            console.log('User not found');
            return null;
        }
    };

    return Users;

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
