import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NextUIProvider } from "@nextui-org/react";
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="1046741513914-iprcol8k4pqgu1h1ivpgsla0km5aj4qp.apps.googleusercontent.com">
      <NextUIProvider>
        <App />
      </NextUIProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
