import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { PredictionProvider } from './context/PredictionContext'
import './index.css'

import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PredictionProvider>
        <App />
        <Toaster position="top-right" reverseOrder={false} />
      </PredictionProvider>
    </BrowserRouter>
  </React.StrictMode>
)
