import { useReducer, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const initialState = {
  data: [],
  loading: false,
  error: null
}

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null }

    case "FETCH_SUCCESS":
      return { data: action.payload, loading: false, error: null }

    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload }

    default:
      return state
  }
}

function GlobalSearch() {
  const [query, setQuery] = useState("")
  const [state, dispatch] = useReducer(reducer, initialState)
  const navigate = useNavigate()

  useEffect(() => {
    if (!query) return   // if empty stop

    dispatch({ type: "FETCH_START" }) 

    fetch(`https://jsonplaceholder.typicode.com/users?q=${query}`)
      .then(res => res.json())
      .then(data => {
        dispatch({ type: "FETCH_SUCCESS", payload: data })
      })
      .catch(() => {
        dispatch({ type: "FETCH_ERROR", payload: "Something went wrong!" })
      })

  }, [query])

  return (
    <div className="container">
    <div className="card">
      <h2>Global Search</h2>

      <input
        type="text"
        placeholder="Search user..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {state.loading && <p className="loading">Loading...</p>}

      {state.error && <p className="error">{state.error}</p>}

      <ul>
        {state.data.map(user => (
          <li
            key={user.id}
            onClick={() => navigate(`/user/${user.id}`)}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  </div>
  )
}

export default GlobalSearch