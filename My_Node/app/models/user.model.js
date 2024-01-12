module.exports = (Sequelize, sequelize) => {
    const user = sequelize.define('users_table', {
        name: {
            type: Sequelize.STRING(150)
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        age: {
            type: Sequelize.INTEGER
        },
        address: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.BIGINT
        },
        isMarried: {
            type: Sequelize.BOOLEAN
        },
        // id: {
        //     type: Sequelize.INTEGER,
        //     unique: true,
        //     allowNull: false,
        //     primaryKey: true,
        //     autoIncrement: true
        // }
    });
    return user;
}