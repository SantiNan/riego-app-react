import { useNavigate, useLocation } from 'react-router-dom';
import { MiniPlayer } from '../../components/MiniPlayer';
import { BottomBar, TabBarWrapper, TabItem, TabLabel } from './TabBar.styles';

export function TabBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <BottomBar>
      <MiniPlayer />
      <TabBarWrapper>
        <TabItem $active={pathname === '/'} onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <TabLabel>Programs</TabLabel>
        </TabItem>
        <TabItem $active={pathname === '/manual'} onClick={() => navigate('/manual')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 11V6a2 2 0 0 0-4 0v5"/>
            <path d="M14 10V4a2 2 0 0 0-4 0v6"/>
            <path d="M10 10.5V6a2 2 0 0 0-4 0v8"/>
            <path d="M18 11a2 2 0 0 1 4 0v3a8 8 0 0 1-8 8h-2c-2.5 0-4.5-1-6.2-2.8L3 16.5a2 2 0 0 1 2.8-2.8L8 16"/>
          </svg>
          <TabLabel>Manual</TabLabel>
        </TabItem>
      </TabBarWrapper>
    </BottomBar>
  );
}
