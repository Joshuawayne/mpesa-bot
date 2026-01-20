import request from 'supertest';
import { createApp } from '../src/infrastructure/app.js';

const app = createApp();

describe('M-Pesa Callback Integration', () => {
  
  test('POST /api/mpesa-callback should process valid transaction', async () => {
    const mockPayload = {
      Body: {
        stkCallback: {
          MerchantRequestID: "REQ123",
          CheckoutRequestID: "CHK123",
          ResultCode: 0,
          ResultDesc: "Success",
          CallbackMetadata: {
            Item: [
              { Name: "Amount", Value: 500 },
              { Name: "MpesaReceiptNumber", Value: "QWE12345" },
              { Name: "PhoneNumber", Value: 254700000000 }
            ]
          }
        }
      }
    };

    const res = await request(app)
      .post('/api/mpesa-callback')
      .send(mockPayload);

    // We expect 200 OK because the payment was successful
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('processed successfully');
  });

  test('POST /api/mpesa-callback should return 400 for failed payment', async () => {
    const failedPayload = {
      Body: { stkCallback: { ResultCode: 1032, ResultDesc: "Cancelled" } }
    };

    const res = await request(app)
      .post('/api/mpesa-callback')
      .send(failedPayload);

    // We expect 400 Bad Request because the logic throws an error
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});