/**
 * @description Canary test to verify the test harness is working.
 * If this fails, the environment is broken.
 */
describe('Environment Setup', () => {
  test('should verify that Jest is working correctly', () => {
    expect(true).toBe(true);
  });
});