import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//  Async Thunk
export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (searchTerm) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?q=${searchTerm}`
    );

    const data = await response.json();
    return data;
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},

  //  Async states handled here
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to fetch movies";
      });
  },
});

export default movieSlice.reducer;