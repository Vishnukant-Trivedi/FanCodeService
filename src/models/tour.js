const mysql = require('../lib/mysql');

const getAllTours = async () => {
    const statement = 'select * from tours;';
    const parameters = [];
    return await mysql.query(statement, parameters);
}

const getMatchesByTourName = async params => {
    const { name, page = 1, size = 10 } = params;
    const offset = (page - 1) * size;
    const limit = parseInt(size, 10);
    const parameters = [name, limit, offset];
    const matchByTourNameStatement = 'select matches.id AS `matches.id`,matches.name AS `matches.name`,matches.tourId AS `matches.tourId`,matches.status AS `matches.status`,matches.format AS `matches.format`,'+
    'matches.startTime AS `matches.startTime`,matches.endTime AS `matches.endTime`,matches.recUpdatedAt AS `matches.recUpdatedAt`,matches.createdAt AS `matches.createdAt`,tours.name AS `tours.name`'+
    'from matches left join tours on matches.tourId = tours.id where tours.name = ? LIMIT ? OFFSET ?';
    const matchByTourNameResult = await mysql.query(matchByTourNameStatement, parameters);
    const countMatchByTourNameStatement = 'select COUNT(*) as count FROM matches LEFT JOIN tours ON matches.tourId = tours.id WHERE tours.name = ?';
    const count = await mysql.query(countMatchByTourNameStatement, [ name ]);
    const response = {
        data: matchByTourNameResult,
        meta: {
            total: count[0].count,
            page: parseInt(page, 10),
            size: parseInt(size, 10)
        }
    };
    return response;
}

const getMatchesByTourName1 = async params => {
    const statement = 'select * from matches left join tours on matches.tourId = tours.id where tours.name = ?';
    return await mysql.query(statement, parameters);
}

module.exports = {
    getAllTours: getAllTours,
    getMatchesByTourName: getMatchesByTourName
}