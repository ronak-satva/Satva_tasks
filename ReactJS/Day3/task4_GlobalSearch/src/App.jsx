import { Routes, Route } from "react-router-dom"
import GlobalSearch from "./components/GlobalSearch"
import UserDetail from "./components/UserDetail"
import "./App.css"

function App() {
  return (
    <Routes>
      <Route path="/" element={<GlobalSearch />} />
      <Route path="/user/:id" element={<UserDetail />} />
    </Routes>
  )
}

export default App;