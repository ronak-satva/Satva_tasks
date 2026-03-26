import { useState, useEffect, useCallback } from "react";
import ListItem from "./ListItem";

function Dashboard() {
  // List state

  console.log('Dashboard rendering');
  const [items, setItems] = useState([
    { id: 1, name: "Apple" },
    { id: 2, name: "Banana" },
    { id: 3, name: "Orange" },
  ]);

  // Current time state
  const [time, setTime] = useState(
    new Date().toLocaleTimeString()
  );

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Optimized delete function
  const handleDelete = useCallback((id) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Optimized List</h2>
      <h3>Current Time: {time}</h3>

      {items.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default Dashboard;