# mpesa-bot
# M-Pesa Automation Service

A robust, **SOLID-compliant** Node.js middleware that bridges Safaricom's Daraja API (M-Pesa) with no-code automation tools like **n8n**, **Zapier**, and **Google Sheets**.

Designed for high reliability, security, and scalability using **Clean Architecture**.

## Architecture
This project follows **Domain-Driven Design (DDD)** principles:
- **Domain Layer:** Pure business entities (Transaction validation).
- **Application Layer:** Business logic (M-Pesa payload parsing).
- **Infrastructure Layer:** External tools (Express Server, Safaricom API, Automation Webhooks).
- **Interfaces Layer:** HTTP Controllers and Routes.

##  Features
- ** Secure:** Implements Helmet, Rate Limiting, and CORS protection.
- ** STK Push:** Initiate M-Pesa prompts directly from the API.
- ** Webhook Listener:** Robust parsing of complex Safaricom callbacks.
- ** Automation Bridge:** "Fire-and-forget" forwarding to external automation tools (n8n/Zapier).
- ** 100% Tested:** Comprehensive Unit and Integration tests using Jest.

## Prerequisities
- Node.js (v18+)
- A Safaricom Daraja Account (Sandbox/Live)
- Ngrok (for local development)

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/mpesa-bot.git
cd mpesa-bot
npm install
2. Environment Setup
Create a .env file in the root directory:
code
Env
PORT=4000
NODE_ENV=development

# The URL where you want the data to end up (n8n/Zapier)
AUTOMATION_WEBHOOK_URL=https://webhook.site/your-id

# Safaricom Daraja Credentials
DARAJA_CONSUMER_KEY=your_key_here
DARAJA_CONSUMER_SECRET=your_secret_here
DARAJA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
DARAJA_SHORTCODE=174379
DARAJA_CALLBACK_URL=https://your-app-url.com/api/mpesa-callback

3. Run Locally
code
Bash
# Start in Development Mode (with Nodemon)
npm run dev

# Run Tests
npm test
📡 API Reference
1. Initiate Payment (STK Push)
Triggers the PIN prompt on the user's phone.
Endpoint: POST /api/pay
Body:
code
JSON
{
  "phoneNumber": "254712345678",
  "amount": 100
}
2. M-Pesa Callback (Webhook)
Endpoint for Safaricom to send transaction results.
Endpoint: POST /api/mpesa-callback
Note: This endpoint automatically parses the JSON and forwards it to AUTOMATION_WEBHOOK_URL.

 Deployment (Render.com)
Push code to GitHub.
Create a new Web Service on Render.
Add the Environment Variables from step 2.
Update DARAJA_CALLBACK_URL to match your new Render URL.

 Contributing
Built with "Next Guy" mentality. Code is heavily commented and strictly typed (via JSDoc).
Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request
