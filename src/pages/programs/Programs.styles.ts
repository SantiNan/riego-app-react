import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 16px;
  padding-top: env(safe-area-inset-top, 0);
  background: ${({ theme }) => theme.bg};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  flex-shrink: 0;
`;

export const HeaderLeft = styled.div`display: flex; align-items: center; gap: 8px;`;
export const HeaderRight = styled.div`display: flex; align-items: center; gap: 4px;`;

export const StatusDot = styled.div<{ $online: boolean }>`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${({ $online, theme }) => $online ? theme.green : theme.text3};
  box-shadow: ${({ $online, theme }) => $online ? `0 0 8px ${theme.green}` : 'none'};
  transition: background 0.3s;
`;

export const HeaderTitle = styled.span`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.3px;
`;

export const IconBtn = styled.button`
  width: 40px; height: 40px;
  border-radius: 50%;
  color: ${({ theme }) => theme.text2};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  svg { width: 22px; height: 22px; }
  &:active { background: ${({ theme }) => theme.surface}; }
`;

export const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  padding-bottom: calc(120px + env(safe-area-inset-bottom, 0px));
  -webkit-overflow-scrolling: touch;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 12px;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  color: ${({ theme }) => theme.text3};
  svg { width: 64px; height: 64px; }
`;

export const Spinner = styled.svg`
  animation: ${spin} 1s linear infinite;
`;

export const EmptyTitle = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text2};
`;

export const EmptySub = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text3};
  line-height: 1.5;
  strong { color: ${({ theme }) => theme.text2}; }
`;