const mysql = require('../lib/mysql');

const getAllMatches = async () => {
    try {
        const statement = 'select * from matches';
        const parameters = [];
        return await mysql.query(statement, parameters);   
    } catch (error) {
        return {
            error: 'Database error',
            status: 400
        };
    }
}

module.exports = {
    getAllMatches: getAllMatches
}