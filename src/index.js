import { createApp } from './infrastructure/app.js';
import { config } from './config/env.js';

const startServer = () => {
  // 1. Force Port 4000 if 3000 is causing issues
  const PORT = config.PORT === 3000 ? 4000 : config.PORT;
  
  const app = createApp();

  console.log('Attempting to start server...');

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`
      ################################################
      ✅ SERVER IS ALIVE
      🛡️  Running on Port: ${PORT}
      ################################################
      ➜ Browser:  http://localhost:${PORT}/health
      ➜ Webhook:  POST http://localhost:${PORT}/api/mpesa-callback
    `);
  });

  // 2. Catch Startup Errors (Silent Crashes)
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is busy! Please stop other Node processes or change the port.`);
    } else {
      console.error('❌ Server Error:', err);
    }
  });

  // 3. Prevent the process from closing instantly
  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
  });
};

startServer();