import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import './App1.css';


function App1()
{
    return (
        <div>
        <Navbar title="DEMO"/>

        <div className="layout">
           <Sidebar />
           <MainContent /> 
        </div>

        <Footer />
        </div>
    );
}
export default App1;