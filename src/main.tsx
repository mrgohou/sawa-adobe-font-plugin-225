import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { FirebaseProvider } from './context/FirebaseContext.tsx';
import { SYSTEM_FONTS_DATABASE } from './data/simulatorData.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FirebaseProvider initialSystemFonts={SYSTEM_FONTS_DATABASE}>
      <App />
    </FirebaseProvider>
  </StrictMode>,
);
