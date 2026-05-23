import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'white',
              color: 'var(--text-dark)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '12px',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              boxShadow: '0 8px 32px rgba(61,26,10,0.12)',
            },
            success: {
              iconTheme: { primary: 'var(--gold)', secondary: 'white' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: 'white' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
