import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Host domain strict policy verification
const ALLOWED_FRONTEND_HOSTS = [
  "localhost",
  "127.0.0.1",
  "kanji.fishiden.com",
];

if (!ALLOWED_FRONTEND_HOSTS.includes(window.location.hostname)) {
  document.body.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; background-color: #fcebeb; color: #8f0020; text-align: center; padding: 20px;">
      <h1 style="font-size: 24px; margin-bottom: 10px;">Akses Ditolak</h1>
      <p style="font-size: 16px; font-weight: bold;">Domain (${window.location.hostname}) tidak diizinkan untuk mengakses aplikasi ini.</p>
    </div>
  `;
  throw new Error("Akses Ditolak: Rute domain tidak sah.");
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
