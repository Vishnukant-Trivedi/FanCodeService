const request = require('supertest');
const { app }  = require('../../index');
const { expect } = require('chai');
const Match = require('../../src/controllers/match');

describe('GET /matches', () => {
    it('should return all matches', async () => {
        // Mock the return value of getAllMatches function
        Match.getAllMatches = jest.fn().mockResolvedValue([
            { id: 1, name: 'Match 1', format: 'T20' },
            { id: 2, name: 'Match 2', format: 'Test' }
        ]);

        // Make the request to the endpoint
        const response = await request(app).get('/matches').expect(200);

        // Assert the response
        expect(response.body).to.deep.equal([
            { id: 1, name: 'Match 1', format: 'T20' },
            { id: 2, name: 'Match 2', format: 'Test' }
        ]);
    });

    it('should handle errors', async () => {
        // Mock the function to throw an error
        const errorResponse = {
            "error": "Database error",
            "status": 400
        }
        Match.getAllMatches = jest.fn().mockRejectedValue(errorResponse);

        // Make the request to the endpoint
        const response = await request(app).get('/matches');
        // Assert the response
        expect(response.body).to.be.empty;
    });
});
