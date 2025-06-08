import React from "react";

const quotes = [
  "Stay curious, keep learning",
  "You got this",
  "Choose and focus",
  "Focus = Freedom",
  "One deep breath, one big goal",
  "Make your brain proud",
  "Create > Consume",
  "Choose and focus",
  "Done is better than perfect",
  "You're not behind, you're building",
  "Progress, not pressure",
  "Reset Refocus Restart",
  "Work smarter Then harder",
  "Choose and focus",
  "One task at a time",
  "Less scroll, more soul",
  "You're doing better than you think",
  "Small steps = big wins",
  "Protect your focus like it's gold",
  "Every minute counts Make it yours",
  "Distraction is the enemy of dreams",
  "Win today Repeat tomorrow",
  "Rest is productive too",
  "Choose and focus",
];

const getRandomQuote = () => {
  const idx = Math.floor(Math.random() * quotes.length);
  return quotes[idx];
};

const QuoteSection = () => {
  const quote = React.useMemo(getRandomQuote, []); // Memoize to avoid recalculating on every render
  return (
    <div className="text-center text-white text-2xl px-4 mt-10 font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
      “{quote}”
    </div>
  );
};

export default QuoteSection;
