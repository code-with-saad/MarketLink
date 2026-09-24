import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../api/authApi';
import { setCredentials, logout, selectToken } from '../store/slices/authSlice';

const AppInit = ({ children, onReady }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  useEffect(() => {
    if (!token) {
      onReady();
      return;
    }

    getMe()
      .then((res) => {
        const user = res.data.user;
        dispatch(setCredentials({ user, token }));
        onReady();
      })
      .catch(() => {
        dispatch(logout());
        onReady();
      });
  }, []);

  return children;
};

export default AppInit;
