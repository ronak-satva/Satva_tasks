import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [
    { id: 1, name: "Laptop", price: 1000 },
    { id: 2, name: "Mobile", price: 500 },
    { id: 3, name: "Headphones", price: 100 },
  ],
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    deleteProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },
  },
});

export const { deleteProduct } = inventorySlice.actions;
export default inventorySlice.reducer;