import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './styles/index.css'
import AuthProvider from './contexts/AuthProvider.tsx'
import ToastContainer from './contexts/ToastContainer.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ToastContainer>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ToastContainer>
  </BrowserRouter>,
)
