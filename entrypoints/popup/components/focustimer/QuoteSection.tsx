import React from "react";

const quotes = [
    "Work hard, smart.",
    "Dream big, act bigger.",
    "Stay curious, keep learning.",
    "Progress, not perfection.",
    "Make it happen.",
    "Think different.",
    "Create your future.",
    "Embrace the challenge.",
    "Focus and win.",
    "Start now, not later.",
];

const getRandomQuote = () => {
    const idx = Math.floor(Math.random() * quotes.length); 
    return quotes[idx];
};

const QuoteSection = () => {
    const quote = React.useMemo(getRandomQuote, []); // Memoize to avoid recalculating on every render
    return (
        <div className="text-center text-white text-lg font-semibold px-4 py-4">
            “{quote}”
        </div>
    );
};

export default QuoteSection;
