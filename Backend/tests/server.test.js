const request = require('supertest');
const app = require('../app');

describe('Server Tests', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Welcome to ZenAura API');
    });
  });

  describe('Basic Routes', () => {
    it('should handle 404 routes', async () => {
      const response = await request(app).get('/nonexistent-route');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });

  describe('API Endpoints', () => {
    it('should handle invalid JSON', async () => {
      const response = await request(app)
        .post('/api/personality-traits')
        .set('Content-Type', 'application/json')
        .send('invalid json');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Error Handling', () => {
    it('should handle server errors', async () => {
      const response = await request(app)
        .post('/api/personality-traits')
        .set('Content-Type', 'application/json')
        .send({});
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 