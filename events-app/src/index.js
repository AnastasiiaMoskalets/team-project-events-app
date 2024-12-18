import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css'
import { UserProvider } from './UserContext';
import 'primereact/resources/primereact.min.css'; // core styles
import 'primeicons/primeicons.css'; // icon library styles
import 'primereact/resources/themes/saga-blue/theme.css'; // theme styles (optional)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
        <App />
    </UserProvider>
  </React.StrictMode>
);


reportWebVitals();
