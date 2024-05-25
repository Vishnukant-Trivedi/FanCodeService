const mysql = require('../lib/mysql');

const getAllSportsToursAndMatches = async () => {
    const statement = `
        SELECT s.name AS sportName, t.name AS tourName, m.id AS matchId, m.name AS matchName, 
               m.startTime, m.format
        FROM matches m 
        INNER JOIN tours t ON m.tourId = t.id 
        INNER JOIN sports s ON t.sportId = s.id
    `;
    const parameters = [];
    return await mysql.query(statement, parameters);
}

module.exports = {
    getAllSportsToursAndMatches: getAllSportsToursAndMatches
}