import Home from './components/Home';
import About from './components/About';
import UserDetail from './components/UserDetail';
import { Routes, Route, NavLink } from "react-router-dom";
import './App.css';

function App() {
  return (
    <div className="app-layout">

      {/* Header */}
      <header className="header">
        <nav className="navbar">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/user/1">User 1</NavLink>
          <NavLink to="/user/2">User 2</NavLink>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path='/dashboard' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/user/:id' element={<UserDetail />} />
        </Routes>
      </main>

    </div>
  );
}

export default App;