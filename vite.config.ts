import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Cambiá 'riego-app' por el nombre de tu repo en GitHub
// Si el repo se llama 'riego-app', la app queda en tuusuario.github.io/riego-app/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/riego-app-react/' : '/',
});
