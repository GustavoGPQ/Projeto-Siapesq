import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import TokenProvider from './context/TokenContext.jsx';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TokenProvider>
      <App />
    </TokenProvider>
  </React.StrictMode>
);