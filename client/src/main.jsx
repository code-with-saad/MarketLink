import { useState } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AppInit from './components/AppInit';
import './index.css';
import App from './App.jsx';

const Root = () => {
  const [ready, setReady] = useState(false);

  return (
    <Provider store={store}>
      <AppInit onReady={() => setReady(true)}>
        {ready ? <App /> : (
          <div className="min-h-screen flex items-center justify-center bg-warm-cream">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-forest-800 border-t-accent-lime rounded-full animate-spin" />
              <span className="text-sm text-earth-700 font-medium">Loading...</span>
            </div>
          </div>
        )}
      </AppInit>
    </Provider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
