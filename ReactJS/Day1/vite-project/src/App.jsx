import './App1.css';
import UserCard from './components/UserCard';

function App() {
  

  return (
    <>
      <div className="container">
        <UserCard name ="Ronak" role ="Developer" is_available={true}/>

        <UserCard name ="Ishan" role ="Designer" is_available={true}/>

        <UserCard name ="Dev" role ="Manager" is_available={false}/>

      </div>
    </>
  )
}

export default App;
