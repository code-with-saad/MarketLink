import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add more slice reducers here as features are built
    // farmer: farmerReducer,
    // customer: customerReducer,
    // admin: adminReducer,
  },
});

export default store;
