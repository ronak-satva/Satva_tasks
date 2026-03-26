import Dashboard from "./components/Dashboard";
import './App.css'

function App() {
  const servers = [
    { id: 1, name: "Database", status: "Online" },
    { id: 2, name: "API Server", status: "Maintenance" },
    { id: 3, name: "Auth Server", status: "Online" }
     ];

  return (
    <>
      <Dashboard servers ={servers}/>
    </>
  )

  }
export default App;
