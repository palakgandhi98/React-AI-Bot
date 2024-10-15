import { useState } from 'react'
import axios from "axios";
import './App.css'

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer]=useState("");
  
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      generateAnswer(question);
      event.preventDefault();
    }
  }
  
  async function generateAnswer(){
    setAnswer("Loading your answer... \n It might take upto 10 seconds");
      const responce = await axios({
        url:`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
        method:"post",
        data:{
          contents:[{"parts":[{"text":question}] }]
        },
      });
      setAnswer(responce["data"]["candidates"][0]["content"]["parts"][0]["text"]);
  }
  
  

  
  
  return (
    <>
      <h1 className='text-2xl'>AI ChatBot</h1>
      <input type="text" onKeyDown={handleKeyDown} className=" border shadow rounded max-w-fit text-center w-full py-2 px-3  mb-3 leading-tight align-middle p-4 bg-slate-800 text-center'"  value={question} onChange={(e)=> setQuestion(e.target.value)} placeholder='Ask Me Anything?'></input>
      <div><button onClick={generateAnswer} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Generate Answer</button></div>
      <div className='my-10'>
      <pre className='bg-slate-600 text-pretty text-slate-950'>{answer}</pre>
      </div>
    </>
  )
}

export default App
