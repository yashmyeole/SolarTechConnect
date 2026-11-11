import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import '@fontsource-variable/source-sans-3/wght.css';
import '@fontsource-variable/instrument-sans/wdth.css';
import { router } from './router';
import './styles/tokens.css';
import './styles/base.css';
import './styles/utilities.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
