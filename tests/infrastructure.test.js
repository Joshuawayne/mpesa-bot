import request from 'supertest';
import { createApp } from '../src/infrastructure/app.js';

const app = createApp();

describe('Infrastructure & Security Layer', () => {
  
  test('should return 200 and standard response structure on health check', async () => {
    const res = await request(app).get('/health');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.timestamp).toBeDefined(); // Ensures our API Standard wrapper is working
    expect(res.headers['x-dns-prefetch-control']).toBeDefined(); // Ensures Helmet is working
  });

  test('should block large payloads (Security)', async () => {
    const largeData = 'a'.repeat(20000); // 20kb string (limit is 10kb)
    
    const res = await request(app)
      .post('/health')
      .send({ data: largeData });

    // Depending on Express version, 413 = Payload Too Large
    expect(res.statusCode).toBe(413);
  });
});