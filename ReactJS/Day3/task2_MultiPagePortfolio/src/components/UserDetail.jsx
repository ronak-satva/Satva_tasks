import { useParams } from "react-router-dom";

function UserDetail() {
  const { id } = useParams();

  return (
    <div className="page-content">
      <h2>User Detail Page</h2>
      <p>User ID: {id}</p>
      <p>
        This ID is coming dynamically from the URL using useParams().
      </p>
    </div>
  );
}

export default UserDetail;