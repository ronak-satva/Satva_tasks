import { useReducer, useState } from "react";
import "./App.css";

const initialState = {
  count: 0,
  history: []
};

function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return {
        count: state.count + 1,
        history: [...state.history, state.count]
      };

    case "DECREMENT":
      return {
        count: state.count - 1,
        history: [...state.history, state.count]
      };

    case "RESET":
      return {
        count: 0,
        history: [...state.history, state.count]
      };

    case "SET_VALUE":
      return {
        count: Number(action.payload),
        history: [...state.history, state.count]
      };

    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="app">
      <div className="counter-card">
        <h1>Count: {state.count}</h1>

        <div className="button-group">
          <button onClick={() => dispatch({ type: "INCREMENT" })}>
            Increment
          </button>

          <button onClick={() => dispatch({ type: "DECREMENT" })}>
            Decrement
          </button>

          <button onClick={() => dispatch({ type: "RESET" })}>
            Reset
          </button>
        </div>

        <div className="set-value">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
          />

          <button
            onClick={() =>
              dispatch({ type: "SET_VALUE", payload: inputValue })
            }
          >
            Set Value
          </button>
        </div>

        <h3>History</h3>
        <ul className="history-list">
          {state.history.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
