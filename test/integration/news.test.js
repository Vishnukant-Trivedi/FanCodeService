const request = require('supertest');
const { expect } = require('chai');
const { app }  = require('../../index');
const mysql = require('../../src/lib/mysql'); // Path to your MySQL setup
const { setupTestDatabase, teardownTestDatabase } = require('./testDatabaseSetup');

describe('News API Test', () => {

    beforeAll(async () => {
        await setupTestDatabase();
    });

    afterAll(async () => {
        await teardownTestDatabase();
    });

    describe('POST /news', () => {
        it('should create news for a match', async () => {
            // Arrange: Prepare test data
            const matchId = 1; // Assuming a match with ID 1 exists in the test DB
            const newsData = {
                title: 'Match News Title',
                description: 'Match News Description',
                matchId: matchId
            };

            // Act: Make the API request
            const res = await request(app)
                .post('/news')
                .send(newsData)
                .expect(200);

            // Assert: Check the response
            expect(res.body).to.have.property('id');
            expect(res.body.title).to.equal(newsData.title);
            expect(res.body.description).to.equal(newsData.description);
            expect(res.body.matchId).to.equal(newsData.matchId);
            expect(res.body).to.have.property('tourId');
            expect(res.body).to.have.property('sportId');
        });

        it('should create news for a tour', async () => {
            // Arrange: Prepare test data
            const tourId = 1; // Assuming a tour with ID 1 exists in the test DB
            const newsData = {
                title: 'Tour News Title',
                description: 'Tour News Description',
                tourId: tourId
            };

            // Act: Make the API request
            const res = await request(app)
                .post('/news')
                .send(newsData)
                .expect(200);

            // Assert: Check the response
            expect(res.body).to.have.property('id');
            expect(res.body.title).to.equal(newsData.title);
            expect(res.body.description).to.equal(newsData.description);
            expect(res.body.tourId).to.equal(newsData.tourId);
            expect(res.body).to.have.property('sportId');
        });

        it('should return an error if title or description is missing', async () => {
            // Arrange: Prepare test data with missing title
            const newsData = {
                description: 'News Description',
                matchId: 1
            };

            // Act: Make the API request
            const res = await request(app)
                .post('/news')
                .send(newsData)
                .expect(200);

            // Assert: Check the response
            expect(res).to.have.property('body');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.equal('Title and description are required.');
        });

        it('should return an error if neither matchId nor tourId is provided', async () => {
            // Arrange: Prepare test data without matchId and tourId
            const newsData = {
                title: 'News Title',
                description: 'News Description'
            };

            // Act: Make the API request
            const res = await request(app)
                .post('/news')
                .send(newsData)
                .expect(200);

            // Assert: Check the response
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.equal('Please send matchId or tourId to create the news');
        });
    });

    describe('GET /news/:id', () => {
        // Additional test cases for fetching news by matchId, tourId, sportId
        it('should fetch news by match id', async () => {
            const matchId = 1;
            const res = await request(app)
                .get(`/news/match/${matchId}`)
                .expect(200);

            expect(res.body).to.be.an('array');
            res.body.forEach(news => {
                expect(news).to.have.property('matchId', matchId);
            });
        });

        it('should fetch news by tour id', async () => {
            const tourId = 1;
            const res = await request(app)
                .get(`/news/tour/${tourId}`)
                .expect(200);

            expect(res.body).to.be.an('array');
            res.body.forEach(news => {
                expect(news).to.have.property('tourId', tourId);
            });
        });

        it('should fetch news by sport id', async () => {
            const sportId = 1;
            const res = await request(app)
                .get(`/news/sport/${sportId}`)
                .expect(200);

            expect(res.body).to.be.an('array');
            res.body.forEach(news => {
                expect(news).to.have.property('sportId', sportId);
            });
        });
    });
});
