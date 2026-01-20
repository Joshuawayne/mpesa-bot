import { jest } from '@jest/globals'; // <--- THIS IS THE FIX
import { AutomationService } from '../src/infrastructure/AutomationService.js';

// Mock the global fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
);

describe('Automation Service (The Bridge)', () => {
  
  beforeEach(() => {
    fetch.mockClear();
  });

  test('should send transaction data to the webhook URL', async () => {
    const service = new AutomationService();
    const mockTransaction = {
      id: 'QWE12345',
      amount: 1000,
      phoneNumber: '254700000000',
      createdAt: new Date()
    };

    await service.trigger(mockTransaction);

    // Verify fetch was called with the right data
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('http'), // Expects a URL
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(mockTransaction)
      })
    );
  });

  test('should fail gracefully if webhook is down (logging error)', async () => {
    // Simulate network error
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network Down')));
    
    const service = new AutomationService();
    const mockTransaction = { id: 'FAIL123', amount: 500, phoneNumber: '254700000000' };

    // We expect it NOT to throw an error (it should just log and continue)
    await expect(service.trigger(mockTransaction)).resolves.not.toThrow();
  });
});