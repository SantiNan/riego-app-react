import styled, { keyframes } from 'styled-components';

export const dropPulse = keyframes`
  0%, 100% { transform: scale(1) translateY(0); opacity: 0.7; }
  50%       { transform: scale(1.15) translateY(-2px); opacity: 1; }
`;

export const Wrapper = styled.div`display: flex; flex-direction: column; height: 100%;`;

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

export const BackBtn = styled.button`
  width: 40px; height: 40px;
  border-radius: 50%;
  color: ${({ theme }) => theme.accent2};
  display: flex; align-items: center; justify-content: center;
  svg { width: 22px; height: 22px; }
`;

export const HeaderTitle = styled.span`font-size: 18px; font-weight: 600;`;
export const Spacer = styled.div`width: 40px;`;

export const Warning = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 16px 0;
  padding: 10px 14px;
  background: rgba(245,158,11,0.1);
  border: 1px solid rgba(245,158,11,0.25);
  border-radius: ${({ theme }) => theme.radiusSm};
  font-size: 13px;
  color: ${({ theme }) => theme.amber};
`;

export const ZoneList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  padding-bottom: calc(120px + env(safe-area-inset-bottom, 0px));
  -webkit-overflow-scrolling: touch;
`;

export const ZoneRow = styled.div<{ $active: boolean; $colorIndex: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: ${({ $active, theme }) => $active ? theme.surface2 : theme.surface};
  border-radius: ${({ theme }) => theme.radius};
  border: 1px solid ${({ $active, theme }) => $active ? 'rgba(59,130,246,0.35)' : theme.border};
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;
  transition: background 0.15s;
`;

export const ActiveBar = styled.div<{ $color: string }>`
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: ${({ $color }) => $color};
`;

export const ZoneLeft = styled.div`display: flex; align-items: center; gap: 14px;`;

export const ZoneIcon = styled.div<{ $color: string; $dim: string; $active: boolean }>`
  width: 40px; height: 40px;
  border-radius: 12px;
  background: ${({ $dim }) => $dim};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &::after {
    content: '';
    display: block;
    width: 14px;
    height: 18px;
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    background: ${({ $color }) => $color};
    opacity: 0.7;
    animation: ${({ $active }) => $active ? dropPulse : 'none'} 1.2s ease-in-out infinite;
  }
`;

export const ZoneInfo = styled.div`display: flex; flex-direction: column; gap: 2px;`;
export const ZoneName = styled.span`font-size: 16px; font-weight: 500;`;

export const ZoneStatus = styled.span<{ $active: boolean }>`
  font-size: 13px;
  color: ${({ $active, theme }) => $active ? theme.accent2 : theme.text3};
  transition: color 0.2s;
`;
