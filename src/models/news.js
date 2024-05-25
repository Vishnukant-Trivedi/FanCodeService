const mysql = require('../lib/mysql');

const createNews = async (news) => {
    const { title, description, matchId, tourId, sportId } = news;
    const statement = `
        INSERT INTO news (title, description, matchId, tourId, sportId)
        VALUES (?, ?, ?, ?, ?)
    `;
    const parameters = [title, description, matchId, tourId, sportId];
    return await mysql.query(statement, parameters);
};

const getNewsByMatchId = async (matchId) => {
    const statement = `
        SELECT * FROM news WHERE matchId = ?
    `;
    return await mysql.query(statement, [matchId]);
};

const getNewsByTourId = async (tourId) => {
    const statement = `
        SELECT * FROM news WHERE tourId = ?
    `;
    return await mysql.query(statement, [tourId]);
};

const getNewsBySportId = async (sportId) => {
    const statement = `
        SELECT * FROM news WHERE sportId = ?
    `;
    return await mysql.query(statement, [sportId]);
};

module.exports = {
    createNews,
    getNewsByMatchId,
    getNewsByTourId,
    getNewsBySportId
};
