import axios from 'axios';
import { config } from '../config/env.js'; // We will update env.js next

export class DarajaService {
  
  constructor() {
    this.baseUrl = 'https://sandbox.safaricom.co.ke'; // Change to live URL for production
    this.consumerKey = process.env.DARAJA_CONSUMER_KEY;
    this.consumerSecret = process.env.DARAJA_CONSUMER_SECRET;
    this.passkey = process.env.DARAJA_PASSKEY;
    this.shortcode = process.env.DARAJA_SHORTCODE;
    this.callbackUrl = process.env.DARAJA_CALLBACK_URL;
  }

  /**
   * 1. GET ACCESS TOKEN
   * Safaricom requires Basic Auth (Base64 of Key:Secret) to give us a token.
   */
  async _getAccessToken() {
    const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
    
    try {
      const response = await axios.get(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: {
          Authorization: `Basic ${auth}`
        }
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Auth Failed:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Safaricom');
    }
  }

  /**
   * 2. TRIGGER STK PUSH
   * This is what makes the phone beep.
   */
  async triggerStkPush(phoneNumber, amount) {
    const token = await this._getAccessToken();
    
    // Format Date: YYYYMMDDHHmmss
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    
    // Generate Password: Base64(Shortcode + Passkey + Timestamp)
    const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: this.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phoneNumber, // Customer Phone
      PartyB: this.shortcode, // Business Shortcode
      PhoneNumber: phoneNumber,
      CallBackURL: this.callbackUrl,
      AccountReference: "Sneakers", // What the user sees
      TransactionDesc: "Payment for Sneakers"
    };

    try {
      console.log(`[DARAJA] Sending STK Push to ${phoneNumber} for KES ${amount}...`);
      
      const response = await axios.post(`${this.baseUrl}/mpesa/stkpush/v1/processrequest`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data; // { MerchantRequestID, ResponseCode, ... }
    } catch (error) {
      console.error('STK Push Failed:', error.response?.data || error.message);
      throw new Error('Failed to initiate M-Pesa payment');
    }
  }
}