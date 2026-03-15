import styled from 'styled-components';

export const BottomBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 90;
  background: ${({ theme }) => theme.bg};
  padding-bottom: env(safe-area-inset-bottom, 0);
`;

export const TabBarWrapper = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 56px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

export const TabItem = styled.button<{ $active: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
  padding: 6px 0;
  color: ${({ $active, theme }) => $active ? theme.accent : theme.text3};
  transition: color 0.15s;
  svg { width: 24px; height: 24px; }
  &:active { opacity: 0.7; }
`;

export const TabLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
`;

export const StatusDot = styled.div<{ $online: boolean }>`
  width: 6px; height: 6px;
  border-radius: 50%;
  position: absolute;
  top: 6px;
  right: calc(50% - 25px);
  background: ${({ $online, theme }) => $online ? theme.green : theme.text3};
  box-shadow: ${({ $online, theme }) => $online ? `0 0 6px ${theme.green}` : 'none'};
  transition: background 0.3s;
`;
