import { StrictMode } from 'react'
import { hydrate } from 'react-dom'
import App from './App.jsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async';

hydrate(
    <HelmetProvider>
        {/* <StrictMode> */}
            <App />
        {/* </StrictMode> */}
    </HelmetProvider>,
    document.getElementById('root')
)
