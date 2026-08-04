import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const appBase = new URL('./', document.baseURI);
    const serviceWorkerUrl = new URL('sw.js', appBase);

    navigator.serviceWorker
      .register(serviceWorkerUrl.href, { scope: appBase.pathname })
      .catch((error: unknown) => console.error('Service worker registration failed:', error));
  });
}
