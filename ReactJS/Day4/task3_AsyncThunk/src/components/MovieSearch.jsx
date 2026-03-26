import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../features/movies/movieSlice";
import { Input, Spin, Card, Row, Col } from "antd";

const { Search } = Input;

function MovieSearch() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(
    (state) => state.movies
  );

  const onSearch = (value) => {
    dispatch(fetchMovies(value));
  };

  return (
    <div style={{ padding: "20px" }}>
      <Search
        placeholder="Search movies..."
        enterButton
        size="large"
        onSearch={onSearch}
      />

      <br />
      <br />

      {loading && <Spin size="large" />}

      {error && <p>{error}</p>}

      <Row gutter={[16, 16]}>
        {items.map((movie) => (
          <Col xs={24} sm={12} md={8} lg={6} key={movie.id}>
            <Card title={movie.title}>
              {movie.body}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default MovieSearch;