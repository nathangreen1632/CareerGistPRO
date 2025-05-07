import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SessionProvider } from './context/SessionContext';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <SessionProvider>
          <App />
          <Toaster position="top-center" reverseOrder={false} />
        </SessionProvider>
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);
