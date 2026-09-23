import { createSlice } from '@reduxjs/toolkit';

// Auth state shape:
// {
//   user: { _id, name, email, role, contact_number, address, status, stall_name } | null,
//   token: string | null,
//   isLoading: boolean,
//   error: string | null,
// }

const getStoredUser = () => {
  try {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

const initialState = {
  user: getStoredUser(),
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      // payload: { user, token }
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
      if (action.payload.user) {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setCredentials, updateUser, logout, setLoading, setError, clearError } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token && state.auth.user);
export const selectUserRole = (state) => state.auth.user?.role;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;

