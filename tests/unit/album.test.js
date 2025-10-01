const express = require('express');
const supertest = require('supertest');
const router = require('../../routes/album'); // Adjust the path as necessary
const Album = require('../../models/Album'); // Adjust the path as necessary

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use('/albums', router);

const request = supertest(app);

// Example mock data for testing
const mockAlbums = [
  { _id: '1', title: 'Album 1', imgs: [] },
  { _id: '2', title: 'Album 2', imgs: [{ imagePath: '/no-results.jpg', description: 'Ceci est un test', title: 'Image 1', date: new Date() }] }
];

// Mocking the find method of Album model
jest.mock('../../models/Album', () => ({
  find: jest.fn(() => ({
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(mockAlbums)
  }))
}));

describe('GET /albums', () => {
  it('should fetch albums and render them with last image', async () => {
    const response = await request.get('/albums');

    expect(response.status).toBe(200);
    expect(response.header['content-type']).toContain('text/html');

    // Check if albums are rendered correctly
    expect(response.text).toContain('no-results.jpg');
    expect(response.text).toContain('Cet album est vide');
  });

  it('should handle server errors', async () => {
    // Mocking exec function to simulate an error
    Album.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error('Database error'))
    });

    const response = await request.get('/albums');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Une erreur est survenue ...' });
  });
});