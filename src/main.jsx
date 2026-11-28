import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Router } from './router.jsx'
import { ThemeProvider } from './theme/ThemeContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>
)
