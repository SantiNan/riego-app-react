import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { MQTTProvider } from './hooks/useMQTT';
import { ToastProvider } from './components/Toast';
import { MiniPlayer } from './components/MiniPlayer';
import { Home } from './pages/Home';
import { Manual } from './pages/Manual';
import { ProgramEdit } from './pages/ProgramEdit';
import { Player } from './pages/Player';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <MQTTProvider>
        <ToastProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
              <Route path="/"              element={<Home />} />
              <Route path="/manual"        element={<Manual />} />
              <Route path="/program/:id"   element={<ProgramEdit />} />
              <Route path="/player"        element={<Player />} />
            </Routes>
            <MiniPlayer />
          </BrowserRouter>
        </ToastProvider>
      </MQTTProvider>
    </ThemeProvider>
  );
}
