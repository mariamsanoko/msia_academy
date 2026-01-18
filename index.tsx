
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Initialisation globale de process pour éviter les erreurs ReferenceError sur Netlify
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: { API_KEY: "" } };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Impossible de trouver l'élément root pour le montage de l'application.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
