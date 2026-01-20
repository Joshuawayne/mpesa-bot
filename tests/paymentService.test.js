import { PaymentService } from '../src/application/PaymentService.js';

describe('Payment Service (M-Pesa Logic)', () => {
  
  test('should parse a successful M-Pesa callback and return a Transaction', () => {
    // 1. Simulate the EXACT messy JSON Safaricom sends
    const mockMpesaPayload = {
      Body: {
        stkCallback: {
          MerchantRequestID: "29115-34620561-1",
          CheckoutRequestID: "ws_CO_191220191020363925",
          ResultCode: 0,
          ResultDesc: "The service request is processed successfully.",
          CallbackMetadata: {
            Item: [
              { Name: "Amount", Value: 150.00 },
              { Name: "MpesaReceiptNumber", Value: "NLJ7RT61SV" },
              { Name: "TransactionDate", Value: 20191219102115 },
              { Name: "PhoneNumber", Value: 254708374149 }
            ]
          }
        }
      }
    };

    const service = new PaymentService();
    const transaction = service.processCallback(mockMpesaPayload);

    // 2. Expect clean data extraction
    expect(transaction.id).toBe('NLJ7RT61SV');
    expect(transaction.amount).toBe(150);
    expect(transaction.phoneNumber).toBe('254708374149');
  });

  test('should throw error if payment failed (ResultCode not 0)', () => {
    const failedPayload = {
      Body: {
        stkCallback: {
          ResultCode: 1032,
          ResultDesc: "Request cancelled by user"
        }
      }
    };

    const service = new PaymentService();
    expect(() => {
      service.processCallback(failedPayload);
    }).toThrow('Payment failed or cancelled');
  });
});