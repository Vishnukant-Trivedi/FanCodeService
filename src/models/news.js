const mysql = require('../lib/mysql');

const createMatchNews = async (news) => {
    const { title, description, matchId } = news;
    const { tourId, sportId } = await getTourAndSportIdsForMatch(matchId);
    const statement = `
        INSERT INTO news (title, description, matchId, tourId, sportId)
        VALUES (?, ?, ?, ?, ?)
    `;
    const parameters = [title, description, matchId, tourId, sportId];
    await mysql.query(statement, parameters);
    return 'Created Successfully'
};

const createTourNews = async (news) => {
    const { title, description, tourId } = news;
    const { sportId } = await getSportIdForTour(tourId);
        console.log(sportId);
        const statement = `
            INSERT INTO news (title, description, matchId, tourId, sportId)
            VALUES (?, ?, ?, ?, ?)
        `;
        const parameters = [title, description, null, tourId, sportId];
        await mysql.query(statement, parameters);
        return 'Created Successfully'
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

const getTourAndSportIdsForMatch = async (matchId) => {
    const query = `
        SELECT matches.tourId, tours.sportId 
        FROM matches 
        INNER JOIN tours ON matches.tourId = tours.id 
        WHERE matches.id = ?
    `;
    const [result] = await mysql.query(query, [matchId]);
    
    if (!result) {
        throw new Error(`Match with ID ${matchId} not found.`);
    }
    
    const { tourId, sportId } = result;

    return { tourId, sportId };
};

const getSportIdForTour = async (tourId) => {
    const sportQuery = 'SELECT sportId FROM tours WHERE id = ?';
    const [tourRow] = await mysql.query(sportQuery, [tourId]);

    if (!tourRow) {
        throw new Error(`Tour with ID ${tourId} not found.`);
    }
    return tourRow;
};

module.exports = {
    createMatchNews,
    getNewsByMatchId,
    getNewsByTourId,
    getNewsBySportId,
    createTourNews
};
