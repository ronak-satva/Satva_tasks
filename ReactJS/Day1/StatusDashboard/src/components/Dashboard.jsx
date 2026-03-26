import StatusItem from "./StatusItem";'./components/StatusItem';

function Dashboard({servers})
{

    return(
        <div>
            <h2>Server Status Dashboard</h2>
            <div className="dashboard">
            {servers.map((server) => (
            <StatusItem key={server.id} server={server} />
            ))}
            </div>
        </div>
    );
}

export default Dashboard;