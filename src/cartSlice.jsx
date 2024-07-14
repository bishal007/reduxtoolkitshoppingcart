import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  "cart/fetchProducts",
  async () => {
    // Simulating API call
    const response = await new Promise((resolve) =>
      setTimeout(
        () =>
          resolve([
            { id: 1, name: "Product 1", price: 10 },
            { id: 2, name: "Product 2", price: 20 },
            { id: 3, name: "Product 3", price: 30 },
          ]),
        1000
      )
    );
    return response;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    products: [],
    discount: 0,
    status: "idle",
    error: null,
    history: [],
    future: [],
  },
  reducers: {
    addToCart: (state, action) => {
      state.items.push({ ...action.payload, quantity: 1 });
      state.history.push([...state.items]);
      state.future = [];
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.history.push([...state.items]);
      state.future = [];
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
      state.history.push([...state.items]);
      state.future = [];
    },
    applyDiscount: (state, action) => {
      state.discount = action.payload;
      state.history.push([...state.items]);
      state.future = [];
    },
    undo: (state) => {
      if (state.history.length > 0) {
        state.future.unshift([...state.items]);
        state.items = state.history.pop();
      }
    },
    redo: (state) => {
      if (state.future.length > 0) {
        state.history.push([...state.items]);
        state.items = state.future.shift();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyDiscount,
  undo,
  redo,
} = cartSlice.actions;

export default cartSlice.reducer;
