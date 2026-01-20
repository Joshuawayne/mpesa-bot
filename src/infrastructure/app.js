import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import { ApiResponse } from '../utils/ApiResponse.js';
import { PaymentController } from '../interfaces/PaymentController.js';

/**
 * @description Configures the Express Application with Security & Best Practices.
 * Separation of Concerns: This file configures the app, but doesn't start the server.
 */
export const createApp = () => {
  const app = express();

  // 1. SECURITY: Set various HTTP headers to prevent attacks
  app.use(helmet());

  // 2. SECURITY: Prevent Parameter Pollution
  app.use(hpp());

  // 3. SECURITY: Rate Limiting (Load Balancing/Spam protection)
  // Limits IP to 100 requests per 15 minutes
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use('/api', limiter);

  // 4. PERFORMANCE: Gzip compression
  app.use(compression());

  // 5. INFRASTRUCTURE: Body parsing
  app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DoS
  app.use(cors());

   // 6. DOMAIN ROUTES
const paymentController = new PaymentController();
  // The "Buy Now" Endpoint (NEW)
  app.post('/api/pay', paymentController.initiatePayment);
   // The Listener Endpoint
  app.post('/api/mpesa-callback', paymentController.handleCallback);

  // 7. API DESIGN: Health Check Route
  app.get('/health', (req, res) => {
    ApiResponse.success(res, 200, 'Server is healthy and secure', { status: 'UP' });
  });
 

 // Global Error Handler (Catch-all)
  app.use((err, req, res, next) => {
    // 1. Handle "Payload Too Large" specifically (Security)
    if (err.type === 'entity.too.large') {
      return ApiResponse.error(res, 413, 'Payload Too Large');
    }

    // 2. Log other unexpected errors
    console.error(err.stack);
    
    // 3. Return Generic 500 for everything else
    ApiResponse.error(res, 500, 'Internal Server Error');
  });

  return app;
};