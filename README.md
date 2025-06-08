# 🌟 "GenZ Focus AI" Chrome Extension – Your Gen Z Productivity Companion

GenZ Focus AI is a beautifully designed Chrome extension crafted to help modern users stay focused, block distractions, and optimize their time with a touch of AI. With customizable timers, task tracking, site blockers, and friendly visual feedback, this extension transforms productivity into an engaging and empowering daily habit.



## ✨ Features

### 🧠 AI-Powered Productivity Insights

- Get instant, personalized productivity insights based on your daily focus time, break usage, and task completions.
- Uses Gemini AI to analyze local usage and encourage smarter focus patterns.

### ⏱️ Focus Timer (Pomodoro Style)

- Toggle between **Focus** and **Break** modes with customizable durations.
- Clean gradient UI with visual countdown and animated progress bar.
- Smart session logging with daily stats saved in local storage.

### ✅ Task Management

- Create a personalized to-do list with time estimates.
- Start timers for individual tasks, and track focus sessions per task.
- Completed tasks automatically update your focus log for the day.
- Beautifully scrollable layout after n+ tasks.
- Friendly **ding** sound notification when a focus or break session ends.

### 🚫 Site Blocker

- Block distracting websites with customizable URL entries.
- Use **Quick Block** toggles for common distractions like:
  - Instagram, Facebook, YouTube, Slack, Discord.
- Lightweight UI and scrollable blocked site list.

 

## 📦 Installation

🔧 **Local Development Mode**

1. Clone this repository:

```bash
   git clone https://github.com/Kumushai9919/genz-focus-ai.git
 
```

2. Install dependencies:

```bash
pnpm install

```

3. Build the extension:

```bash
pnpm wxt build

```

4. Open Chrome and navigate to:

```bash
chrome://extensions

```
5. Enable Developer Mode.

6. Click Load Unpacked and select the dist/chrome-mv3-dev folder.


🛠️ Tech Stack
- React + TypeScript
- Tailwind CSS
- WXT (Web Extension Toolkit)
- Lucide Icons
- use-sound for notifications
- Gemini AI (API integration)


🔐 Permissions Used
Permission	Purpose
- storage	Save tasks, timer states, focus logs, and AI insight caching.
- activeTab	Required for certain UI permissions and future integrations.
- scripting	Support site blocker dynamic control.
- host_permissions	*://*/* to allow blocking or interaction with any tab.








👩‍💻 Author
Built with ❤️ by Kumushai9919 and powered by Gen Z creative energy.