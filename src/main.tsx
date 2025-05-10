
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create root with proper React 18 initialization
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

// Render the app inside StrictMode for better error detection
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
