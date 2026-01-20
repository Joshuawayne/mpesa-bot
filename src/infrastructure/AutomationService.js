import { config } from '../config/env.js';

/**
 * @class AutomationService
 * @description Handles external communication.
 * Sends the cleaned data to downstream tools (n8n, Zapier, Slack).
 */
export class AutomationService {
  
  /**
   * Triggers the external webhook.
   * Uses "Fire and Forget" - we don't want to hold up the M-Pesa response.
   * @param {Object} transaction 
   */
  async trigger(transaction) {
    const url = config.AUTOMATION_WEBHOOK_URL;
    
    if (!url || url.includes('webhook.site/test')) {
      console.warn('[WARN] No production Webhook URL configured. Using default/test.');
    }

    try {
      console.log(`[AUTOMATION] Sending Transaction ${transaction.id} to ${url}...`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mpesa-Automation-Bot/1.0'
        },
        body: JSON.stringify(transaction)
      });

      if (!response.ok) {
        console.error(`[AUTOMATION ERROR] Remote server responded with ${response.status}`);
      }
      
    } catch (error) {
      // We catch errors here so they don't crash the main M-Pesa Controller
      console.error(`[AUTOMATION FAILED] Could not send data: ${error.message}`);
    }
  }
}