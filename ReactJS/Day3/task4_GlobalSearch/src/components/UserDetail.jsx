import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(res => res.json())
      .then(data => {
        setUser(data)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load user")
        setLoading(false)
      })
  }, [id])

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>User Detail Page</h2>

      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone}</p>

      <button onClick={() => navigate("/")}>
        Go Back
      </button>
    </div>
  )
}

export default UserDetail