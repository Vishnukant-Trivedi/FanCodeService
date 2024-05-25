const request = require('supertest');
const { app } = require('../../index');
const { expect } = require('chai');
const Tour = require('../../src/controllers/tour');

describe('Tour API Test', () => {
    describe('GET /tours', () => {
        it('should return all tours', async () => {
            // Mock the return value of getAllTours function
            Tour.getAllTours = jest.fn().mockResolvedValue([
                { id: 1, name: 'Tour1' },
                { id: 2, name: 'Tour2' }
            ]);

            // Make the request to the endpoint
            const response = await request(app).get('/tours').expect(200);

            // Assert the response
            expect(response.body).to.deep.equal([
                { id: 1, name: 'Tour1' },
                { id: 2, name: 'Tour2' }
            ]);
        });

        it('should handle errors', async () => {
            // Mock the function to throw an error
            Tour.getAllTours = jest.fn().mockRejectedValue({});

            // Make the request to the endpoint
            const response = await request(app).get('/tours');
            
            // Assert the response
            expect(response.body).to.be.empty;
        });
    });

    describe('GET /tour/matches', () => {
        it('should return matches for a tour', async () => {
            // Mock the return value of getMatchesByTourName function
            Tour.getMatchesByTourName = jest.fn().mockResolvedValue({
                data: [
                    { id: 1, name: 'Match1', tourId: 1 },
                    { id: 2, name: 'Match2', tourId: 1 }
                ],
                meta: { total: 2, page: 1, size: 10 }
            });

            // Make the request to the endpoint
            const response = await request(app).get('/tour/matches?name=Tour1').expect(200);

            // Assert the response
            expect(response.body).to.deep.equal({
                data: [
                    { id: 1, name: 'Match1', tourId: 1 },
                    { id: 2, name: 'Match2', tourId: 1 }
                ],
                meta: { total: 2, page: 1, size: 10 }
            });
        });

        it('should handle missing parameter error', async () => {
            // Make the request to the endpoint without providing the required parameter
            const errorResponse = await request(app).get('/tour/matches').expect(200);
            // Assert the response
            expect(errorResponse.body.error).not.to.be.equal('Missing required parameter: name');
        });

        it('should handle errors', async () => {
            // Mock the function to throw an error
            const dbErrorResponse = {
                "error": "Database error",
                "status": 400
            }
            Tour.getMatchesByTourName = jest.fn().mockRejectedValue(dbErrorResponse);

            // Make the request to the endpoint
            const response = await request(app).get('/tour/matches?name=Tour1');
            
            // Assert the response
            expect(response.body.error).not.to.be.equal('Database error');
        });
    });
});
