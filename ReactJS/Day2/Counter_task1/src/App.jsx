import { useState, useEffect } from 'react'
import './App.css';

function App() {

  const [count, setCount] = useState(20);
  const [isActive, setIsActive] = useState(false);

  useEffect(
    () =>{
      let interval = null;

      if (isActive){
        interval = setInterval(() => {
          setCount((prevCount) => prevCount +1);
        },1000);
      }

      return () => {
        clearInterval(interval);
      };
    },[isActive]);

    
  return (
    <>
    <div className='box'>
      <h1>Smart Counter</h1>
      <h2>{count}</h2>

      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? "Pause" : "Start"}
      </button>

      <button onClick={() => {
        setCount(0);
        setIsActive(false);
      }}>
        Reset
      </button>
    </div>
    </>
  )
}

export default App
