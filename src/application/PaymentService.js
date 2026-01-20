import { Transaction } from '../domain/Transaction.js';

/**
 * @class PaymentService
 * @description Application layer logic.
 * Responsible for parsing external API data (M-Pesa) and converting it to Domain Entities.
 */
export class PaymentService {
  
  /**
   * Processes the raw M-Pesa STK Push Callback.
   * @param {Object} payload - The raw JSON from Safaricom.
   * @returns {Transaction} - A clean Transaction entity.
   */
  processCallback(payload) {
    const callback = payload?.Body?.stkCallback;

    if (!callback) {
      throw new Error('Invalid M-Pesa Payload');
    }

    // 1. Check if the user actually paid (ResultCode 0 = Success)
    if (callback.ResultCode !== 0) {
      throw new Error(`Payment failed or cancelled: ${callback.ResultDesc}`);
    }

    // 2. Extract the Metadata safely
    const items = callback.CallbackMetadata?.Item;
    if (!items) {
      throw new Error('Missing Callback Metadata');
    }

    // 3. Helper function to find values in the Array (Clean Code)
    const findValue = (name) => items.find(item => item.Name === name)?.Value;

    const amount = findValue('Amount');
    const mpesaCode = findValue('MpesaReceiptNumber');
    // M-Pesa sends phone as number, we want string
    const phoneNumber = String(findValue('PhoneNumber')); 

    // 4. Return the clean Domain Entity
    return new Transaction(mpesaCode, amount, phoneNumber);
  }
}