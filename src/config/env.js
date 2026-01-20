import dotenv from 'dotenv';
dotenv.config();

/**
 * @description Centralized Configuration.
 * The 'Next Guy' only needs to look here to see what the app depends on.
 */
export const config = {
  PORT: process.env.PORT || 3000,
  // This is where we will send the data (e.g., n8n or Zapier URL)
  AUTOMATION_WEBHOOK_URL: process.env.AUTOMATION_WEBHOOK_URL || 'https://webhook.site/test',
  NODE_ENV: process.env.NODE_ENV || 'development',

    // Daraja Config
  DARAJA: {
    CONSUMER_KEY: process.env.DARAJA_CONSUMER_KEY,
    CONSUMER_SECRET: process.env.DARAJA_CONSUMER_SECRET,
    PASSKEY: process.env.DARAJA_PASSKEY,
    SHORTCODE: process.env.DARAJA_SHORTCODE,
    CALLBACK_URL: process.env.DARAJA_CALLBACK_URL
  }
};