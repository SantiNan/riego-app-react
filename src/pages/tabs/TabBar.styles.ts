import styled from 'styled-components';

export const TabBarWrapper = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 56px;
  padding-bottom: env(safe-area-inset-bottom, 0);
  background: ${({ theme }) => theme.bg};
  border-top: 1px solid ${({ theme }) => theme.border};
  flex-shrink: 0;
`;

export const TabItem = styled.button<{ $active: boolean }>`
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
