# 🤖 APRA (Autonomous Portfolio Risk Auditor)

APRA is an automated, AI-driven portfolio analysis engine and live-syncing dashboard. It continuously monitors market conditions, evaluates financial news, and provides real-time trade recommendations (BUY/SELL/HOLD) based on complex geopolitical and business risk factors.

## 🌟 Project Architecture

This project consists of three tightly integrated components:

### 1. n8n Automation Engine (The Brain)
An automated workflow that orchestrates the entire data pipeline:
* **Data Ingestion:** Fetches real-time financial news (NewsAPI) and pulls current portfolio holdings from a spreadsheet.
* **AI Analysis:** Feeds the market context into an OpenAI (GPT) agent. The AI evaluates the news against the user's specific stock holdings to calculate risk scores and determine trade actions.
* **Distribution:** Generates a clean HTML report. It simultaneously emails this report to the user (via Gmail) and pushes it to the Live Dashboard via a webhook.

### 2. Node.js Express Server (The Middleware)
A lightweight Node.js backend (`server.js`) designed for zero-latency data pass-through:
* Listens for incoming POST requests (`/api/update`) from the n8n workflow.
* Persists the latest AI analysis in memory and on disk.
* Serves the frontend assets and exposes a GET endpoint (`/api/data`) for the dashboard to consume.
* Configured for seamless deployment on cloud platforms like Render.com.

### 3. Live Syncing Dashboard (The Frontend)
A premium, dark-mode terminal UI built with Vanilla JavaScript and Tailwind CSS:
* **Auto-Sync:** Polls the backend every 10 seconds to instantly reflect new trades without requiring a page reload.
* **Smart Parsing:** Features a custom DOMParser that magically reverse-engineers the HTML email template sent by n8n, extracting the raw data into JSON on the fly (meaning zero complex data formatting is required on the n8n side).
* **Dynamic UI:** Automatically highlights the "Strongest Buy Signal" based on risk scores, or gracefully falls back to a "Portfolio is Stable" state when the AI recommends holding all assets.

## 🚀 Deployment

**Backend (Render.com):**
1. Connect this repository to Render.com and create a new "Web Service".
2. Render will automatically detect Node.js, run `npm install`, and start `server.js`.
3. Copy your live Render URL.

**n8n Workflow:**
1. Point your HTTP Request node to `https://YOUR_RENDER_URL/api/update`.
2. Ensure the node is running in parallel with your Gmail node, sending the exact same payload.

## 🛠️ Tech Stack
* **Frontend:** HTML5, Tailwind CSS, FontAwesome, Vanilla JS
* **Backend:** Node.js, Express, CORS
* **Automation:** n8n, OpenAI API, Gmail API, NewsAPI
