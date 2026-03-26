import { useState,useEffect } from "react";
import './App.css';

function LiveNews()
{

  const[posts, setPosts] = useState([]);
  const[loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);

    const response = await fetch (
      "https://jsonplaceholder.typicode.com/posts"
    );

    const data = await response.json();

    setPosts(data);
    setLoading(false);
  };
  
  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="container">
    <h1 className="title">Live News</h1>

    <button className="refresh-btn" onClick={fetchPosts}>
      Refresh
    </button>

    <div className="news-wrapper">
      {posts.map((post) => (
        <div key={post.id} className="news-card">
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  </div>
  );
}

export default LiveNews;