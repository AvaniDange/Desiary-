import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI with API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const Itinerary = () => {
  const [place, setPlace] = useState('');
  const [days, setDays] = useState(null);
  const [aiResponse, setAIResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlaceChange = (e) => {
    setPlace(e.target.value);
  };

  const handleDayChange = (e) => {
    setDays(e.target.value);
  };

  // Function to format text with bold styling and line breaks
  const formatItineraryText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Replace **text** with bold
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')      // Replace *text* with bold
      .replace(/## (.*?)/g, '<strong>$1</strong>')       // Replace # Heading with bold
      .replace(/\n/g, '<br />');                        // Retain line breaks for structure
  };

  // Function to trigger AI generation
  const generateItinerary = async () => {
    setLoading(true);
    setAIResponse('');
    const prompt = `Generate a detailed, day-by-day travel itinerary for a ${days}-day trip to ${place} with daily activities, meal suggestions, and recommendations. The response should be formatted in clear paragraphs with bold headers for each day and key sections like Morning, Afternoon, and Evening. Avoid using symbols like **, *, or #. Use emojis for warmth and visual appeal where appropriate.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      setAIResponse(formatItineraryText(text));
    } catch (error) {
      console.error("Error generating AI response:", error);
      setAIResponse("Failed to generate itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold ml-10">Generate Itinerary</h1>
      <div className="w-full p-8 rounded-lg space-y-6">
        
        {/* Input fields and Button in one row */}
        <div className="flex w-full gap-4 items-center">
          <input
            type="text"
            onChange={handlePlaceChange}
            placeholder="Enter place"
            className="flex-1 border border-gray-300 rounded-md p-3 text-gray-800"
          />
          <input
            type="number"
            onChange={handleDayChange}
            placeholder="Enter number of days"
            className="border border-gray-300 rounded-md p-3 text-gray-800"
          />
          <button
            onClick={generateItinerary}
            className="bg-purple-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-purple-700 transition-colors"
            disabled={!place || !days || loading}
          >
            {loading ? 'Generating...' : 'Generate Itinerary'}
          </button>
        </div>
        
        {/* AI Response Section */}
        <div className="w-full">
          <p className="text-xl font-semibold text-purple-700 mb-2">AI Response:</p>
          <div
            className="w-full bg-gray-100 p-4 border border-gray-200 rounded-md max-h-[72vh] overflow-y-auto min-h-[72vh]"
            style={{ whiteSpace: 'pre-line' }}
            dangerouslySetInnerHTML={{ __html: aiResponse || 'Your generated itinerary will appear here.' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Itinerary;
