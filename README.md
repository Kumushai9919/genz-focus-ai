# 🌟 "GenZ Focus AI" Chrome Extension – Your Gen Z Productivity Companion



GenZ Focus AI is a beautifully designed Chrome extension crafted to help modern users stay focused, block distractions, and optimize their time with a touch of AI. With customizable timers, task tracking, site blockers, and friendly visual feedback, this extension transforms productivity into an engaging and empowering daily habit.

![Screenshot 2025-06-08 at 6 21 44 PM](https://github.com/user-attachments/assets/3d803a46-3da7-44de-8324-b251802834db)


## 🚀 Try It Now!
 

➡️ [Install GenZ Focus AI from Chrome Web Store](https://chromewebstore.google.com/detail/genz-focus-ai/ijmibddbbenkciahmnjnifamnlnnpcnc?hl=en-US&utm_source=ext_sidebar)


## ✨ Features

### 🧠 AI-Powered Productivity Insights

- Get instant, personalized productivity insights based on your daily focus time, break usage, and task completions.
- Uses Gemini AI to analyze local usage and encourage smarter focus patterns.
  
![screenshot-ai-insights-4](https://github.com/user-attachments/assets/8de9f85a-546b-4587-89fc-b6a11f7aaaa2)


### ⏱️ Focus Timer (Pomodoro Style)

- Toggle between **Focus** and **Break** modes with customizable durations.
- Clean gradient UI with visual countdown and animated progress bar.
- Smart session logging with daily stats saved in local storage.

  
![screenshot-pomodoro-2](https://github.com/user-attachments/assets/7d29b0d0-96ff-48bd-a57d-d66e7f4cf82e)

### ✅ Task Management

- Create a personalized to-do list with time estimates.
- Start timers for individual tasks, and track focus sessions per task.
- Completed tasks automatically update your focus log for the day.
- Beautifully scrollable layout after n+ tasks.
- Friendly **ding** sound notification when a focus or break session ends.
  
![screenshot-task-manager-3](https://github.com/user-attachments/assets/e8bbafb0-3179-4ec1-adec-c8c3a81deab1)

### 🚫 Site Blocker

- Block distracting websites with customizable URL entries.
- Use **Quick Block** toggles for common distractions like:
  - Instagram, Facebook, Slack, Discord.
- Lightweight UI and scrollable blocked site list.


 ![screenshot-block-sites-5](https://github.com/user-attachments/assets/bb36b5ae-3e8c-4a81-8629-b06ad9996c41)


## 📦 Installation

🔧 **Local Development Mode**

1. Clone both repositories:
```bash
# Clone the extension repository
git clone https://github.com/Kumushai9919/genz-focus-ai.git
cd genz-focus-ai

# Clone the Gemini proxy repository
git clone https://github.com/Kumushai9919/gemini-proxy.git
cd gemini-proxy
```

2. Set up Gemini Proxy Server:
```bash
cd gemini-proxy
npm install
```

3. Configure Gemini API:
- Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create `.env` in the proxy server directory:
```env
GEMINI_API_KEY=your_api_key_here
```

4. Start the proxy server:
```bash
npm run dev
```

5. Set up the extension:
```bash
cd ../genz-focus-ai
pnpm install

# Create .env for the extension
echo "VITE_GEMINI_PROXY_URL=http://localhost:3000" > .env

# Build the extension
pnpm wxt build
```

6. Load in Chrome:
- Navigate to `chrome://extensions`
- Enable Developer Mode
- Click "Load Unpacked" and select `dist/chrome-mv3-dev`

### 🔒 Security Notes
- The proxy server handles all Gemini API interactions securely
- API keys are stored only on the server side
- Extension communicates with proxy via REST API
- For production deployment, consider hosting the proxy on a secure server


###  🛠️ Tech Stack
- React + TypeScript
- Tailwind CSS
- WXT (Web Extension Toolkit)
- Lucide Icons
- use-sound for notifications
- Gemini AI (API integration)


### 🔐 Permissions Used
Permission	Purpose
- storage	Save tasks, timer states, focus logs, and AI insight caching.
- activeTab	Required for certain UI permissions and future integrations.
- scripting	Support site blocker dynamic control.
- host_permissions	*://*/* to allow blocking or interaction with any tab.


### 👩‍💻 Author
Built with ❤️ by Kumushai9919 and powered by Gen Z creative energy.