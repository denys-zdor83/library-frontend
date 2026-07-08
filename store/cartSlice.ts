import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api';
import type { Cart } from '@/types';

interface CartState {
  cart: Cart | null;
  loading: boolean;
}

const initialState: CartState = {
  cart: null,
  loading: false,
};

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  return api.get<Cart>('/cart/');
});

export const addToCart = createAsyncThunk('cart/add', async (bookId: number) => {
  return api.post<Cart>('/cart/add/', { book_id: bookId });
});

export const removeFromCart = createAsyncThunk('cart/remove', async (bookId: number) => {
  return api.delete<Cart>(`/cart/remove/${bookId}/`);
});

export const bookAll = createAsyncThunk('cart/bookAll', async () => {
  return api.post<{ booked: string[]; errors: { book: string; error: string }[] }>('/cart/book-all/');
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.cart = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state) => { state.loading = false; })
      .addCase(addToCart.fulfilled, (state, action) => { state.cart = action.payload; })
      .addCase(removeFromCart.fulfilled, (state, action) => { state.cart = action.payload; })
      .addCase(bookAll.fulfilled, (state) => {
        if (state.cart) state.cart.items = [];
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
