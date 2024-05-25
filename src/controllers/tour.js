const Tour = require('../models/tour');

const getAllTours = async () => {
    return await Tour.getAllTours();
}

const getMatchesByTourName = async params => {
    let { name } = params;
    if (!name) {
        return {
            error: 'Missing required parameter: name',
            status: 400
        };
    }
    return await Tour.getMatchesByTourName(params);
}

module.exports = {
    getAllTours: getAllTours,
    getMatchesByTourName: getMatchesByTourName
}