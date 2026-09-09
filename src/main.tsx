import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import QueryProvider from './lib/providers/QueryProvider.tsx'
import { ToastProvider } from './lib/providers/ToastProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </QueryProvider>
  </StrictMode>,
)
