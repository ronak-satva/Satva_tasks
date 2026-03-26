import { useState, useMemo } from 'react';
import './App.css';

const bigList = Array.from({ length: 10 }, (_, index) => {
  return `Item ${index + 1}`;
});

function App()
{

  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

    const filteredItems = useMemo(() => {
    console.log(" Filtering running...");
    return bigList.filter((item) =>
      item.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]); 


   return (
  <div className={darkMode ? "app dark" : "app"}>
    <div className="container">
      <h1>Heavy Lifter Filter </h1>

      <button
        className="toggle-btn"
        onClick={() => setDarkMode(!darkMode)}
      >
        Toggle {darkMode ? "Light" : "Dark"} Mode
      </button>

      <input
        type="text"
        className="search-input"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h3>Total Results: {filteredItems.length}</h3>

      <div className="list-container">
        {filteredItems.map((item, index) => (
          <div key={index} className="list-item">
            {item}
          </div>
        ))}
      </div>
    </div>
  </div>
);
}

export default App;