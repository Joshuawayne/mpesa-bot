import { PaymentService } from '../application/PaymentService.js';
import { AutomationService } from '../infrastructure/AutomationService.js';
import { DarajaService } from '../infrastructure/DarajaService.js'; // <--- NEW IMPORT
import { ApiResponse } from '../utils/ApiResponse.js';

export class PaymentController {
  
  constructor() {
    this.paymentService = new PaymentService();
    this.automationService = new AutomationService();
    this.darajaService = new DarajaService(); // <--- NEW INSTANCE
  }

  /**
   * @description Triggered when User clicks "Buy Now"
   * POST /api/pay
   */
  initiatePayment = async (req, res, next) => {
    try {
      const { phoneNumber, amount } = req.body;

      // Basic Validation
      if (!phoneNumber || !amount) {
        return ApiResponse.error(res, 400, 'Please provide phoneNumber and amount');
      }

      // Call Safaricom
      const result = await this.darajaService.triggerStkPush(phoneNumber, amount);

      return ApiResponse.success(res, 200, 'STK Push Sent. Check your phone.', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @description Receives the Webhook from Safaricom
   * POST /api/mpesa-callback
   */
  handleCallback = async (req, res, next) => {
    try {
      const transaction = this.paymentService.processCallback(req.body);

      // Trigger Automation (Send to n8n/Zapier)
      await this.automationService.trigger(transaction);

      return ApiResponse.success(res, 200, 'Transaction processed successfully', transaction);
    
    } catch (error) {
      if (error.message.includes('Payment failed') || error.message.includes('Invalid')) {
        return ApiResponse.error(res, 400, error.message);
      }
      next(error);
    }
  }
}