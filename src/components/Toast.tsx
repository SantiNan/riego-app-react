import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';

type ToastType = 'info' | 'success' | 'error';
interface ToastItem { id: number; msg: string; type: ToastType; }

interface ToastContextValue {
  showToast: (msg: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((msg: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Container>
        {toasts.map(t => (
          <ToastEl key={t.id} $type={t.type}>
            <span style={{ opacity: 0.7 }}>
              {t.type === 'success' ? '✓' : t.type === 'error' ? '✗' : 'ℹ'}
            </span>
            {t.msg}
          </ToastEl>
        ))}
      </Container>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  position: fixed;
  top: calc(60px + 12px + env(safe-area-inset-top, 0px));
  left: 50%;
  transform: translateX(-50%);
  z-index: 300;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: calc(100% - 32px);
  max-width: 380px;
  pointer-events: none;
`;

const ToastEl = styled.div<{ $type: ToastType }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.surface2};
  border-radius: ${({ theme }) => theme.radiusSm};
  border: 1px solid ${({ $type, theme }) =>
    $type === 'success' ? 'rgba(34,197,94,0.4)' :
    $type === 'error'   ? 'rgba(239,68,68,0.4)' :
    theme.border2};
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  animation: ${slideIn} 0.25s ease-out;
`;
