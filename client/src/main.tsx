import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from "react-hot-toast";
import './index.css';
import {SessionProvider} from "./context/SessionContext";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <SessionProvider>
        <React.Fragment>
          <App />
          <Toaster position="top-center" reverseOrder={false} />
        </React.Fragment>
      </SessionProvider>
    </AuthProvider>
  </React.StrictMode>

);
