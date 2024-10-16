import { useState, useEffect } from 'react'
import axios from "axios";
import './App.css'

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      setLoadingTime(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      generateAnswer();
      event.preventDefault();
    }
  }
  
  async function generateAnswer() {
    setIsLoading(true);
    setAnswer("");
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
        method: "post",
        data: {
          contents: [{ "parts": [{ "text": question }] }]
        },
      });
      setAnswer(response.data.candidates[0].content.parts[0].text);
    } catch (error) {
      setAnswer("An error occurred while generating the answer. Please try again.");
      console.error("Error generating answer:", error);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen w-screen max-w-[1200px] mx-auto bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 sm:p-8 flex flex-col">
      <div className="w-full max-w-3xl mx-auto flex-grow flex flex-col">
        <h1 className='text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center text-blue-400'>AI ChatBot</h1>
        
        <div className="flex-grow flex flex-col">
          <div className="mb-6 flex-shrink-0">
            <input
              type="text"
              onKeyDown={handleKeyDown}
              className="w-full py-3 px-4 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder='Ask me anything...'
            />
          </div>
          
          <div className="text-center mb-6 flex-shrink-0">
            <button
              onClick={generateAnswer}
              className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105'
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Ask AI'}
            </button>
          </div>
          
          <div className="flex-grow overflow-auto">
            {isLoading ? (
              <div className='bg-gray-700 rounded-lg p-6 text-center'>
                <div className='flex justify-center items-center mb-4'>
                  <div className="spinner mr-3"></div>
                  <span className="text-lg">AI is thinking...</span>
                </div>
                <p className='text-gray-400'>
                  Crafting a thoughtful response just for you. This might take a moment.
                </p>
              </div>
            ) : answer && (
              <div className='bg-gray-700 rounded-lg p-6 shadow-lg'>
                <h2 className="text-xl font-semibold mb-4 text-blue-400">AI Response:</h2>
                <pre className='whitespace-pre-wrap text-gray-300'>{answer}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
