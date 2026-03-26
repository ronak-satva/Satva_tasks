function StatusItem({ server }) {

    const statusClass =
      server.status === "Online"
        ? "status-online"
        : "status-maintenance";
  
    return (
      <div className="server-card">
        <span>{server.name}</span>
        <span className={statusClass}>
          {server.status}
        </span>
      </div>
    );
  }
  
  export default StatusItem;