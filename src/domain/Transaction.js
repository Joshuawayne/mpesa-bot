/**
 * @class Transaction
 * @description Represents a core financial transaction entity.
 * Follows DDD (Domain Driven Design) - Encapsulates validation logic.
 */
export class Transaction {
  
  /**
   * @param {string} id - The M-Pesa Receipt Number (e.g., QWE12345)
   * @param {number} amount - The transaction amount
   * @param {string} phoneNumber - The payer's phone number
   */
  constructor(id, amount, phoneNumber) {
    this._validate(amount, phoneNumber);
    
    this.id = id;
    this.amount = amount;
    this.phoneNumber = phoneNumber;
    this.createdAt = new Date();
  }

  /**
   * @private
   * @description Validates the business rules for a transaction.
   * Throws errors immediately if data is dirty (Fail Fast).
   */
  _validate(amount, phoneNumber) {
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount: Amount must be greater than zero');
    }

    if (!phoneNumber || typeof phoneNumber !== 'string' || phoneNumber.trim() === '') {
      throw new Error('Invalid phone number');
    }
  }
}