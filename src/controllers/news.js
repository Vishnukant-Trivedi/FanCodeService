const News = require('../models/news');

const createNews = async newsBody => {
    const {title, description} = newsBody;
    if (!title || !description) {
        return {
            error: 'Title and description are required.',
            status: 400
        };
    }
    const { matchId, tourId} = newsBody;
    if (matchId) {
        return await News.createMatchNews(newsBody);
    }
    else if (tourId) {
        return await News.createTourNews(newsBody);
    }
    return {
        error: 'Please send matchId or tourId to create the news',
        status: 400
    };
}

const getNewsByMatchId = async matchId => {
    return await News.getNewsByMatchId(matchId);
}

const getNewsByTourId = async tourId => {
    return await News.getNewsByTourId(tourId);
}

const getNewsBySportId = async sportId => {
    return await News.getNewsBySportId(sportId);
}

module.exports = {
    createNews,
    getNewsByMatchId,
    getNewsByTourId,
    getNewsBySportId
}