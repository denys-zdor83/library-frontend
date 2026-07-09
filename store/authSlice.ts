import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/lib/api';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  initialized: false,
};

export const fetchMe = createAsyncThunk('auth/fetchMe', async () => {
  return api.get<User>('/auth/me/');
});

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    return api.post<User>('/auth/login/', credentials);
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout/');
});

export const register = createAsyncThunk(
  'auth/register',
  async (data: { email: string; password: string; password2: string; first_name: string; last_name: string }) => {
    return api.post<User>('/auth/register/', data);
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.initialized = true;
    },
    clearUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => { state.loading = true; })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(login.pending, (state) => { state.loading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(login.rejected, (state) => { state.loading = false; })
      .addCase(logout.fulfilled, (state) => { state.user = null; })
      .addCase(register.pending, (state) => { state.loading = true; })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(register.rejected, (state) => { state.loading = false; });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
