import { Transaction } from '../src/domain/Transaction.js';

/**
 * @description Unit tests for the Transaction Entity.
 * Ensures data integrity before any business logic is applied.
 */
describe('Transaction Entity', () => {

  test('should create a valid transaction', () => {
    const data = {
      id: 'RC12345678',
      amount: 1000,
      phoneNumber: '254700000000'
    };
    
    const transaction = new Transaction(data.id, data.amount, data.phoneNumber);
    
    expect(transaction.id).toBe(data.id);
    expect(transaction.amount).toBe(data.amount);
    expect(transaction.phoneNumber).toBe(data.phoneNumber);
  });

  test('should throw error if amount is negative or zero', () => {
    expect(() => {
      new Transaction('RC123', -500, '254700000000');
    }).toThrow('Invalid amount');
  });

  test('should throw error if phone number is missing', () => {
    expect(() => {
      new Transaction('RC123', 500, '');
    }).toThrow('Invalid phone number');
  });

});