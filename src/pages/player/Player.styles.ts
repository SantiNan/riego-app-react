import styled, { keyframes } from 'styled-components';

export const drip = keyframes`
  0%   { transform: translateY(0) scale(1);   opacity: 1; }
  60%  { transform: translateY(24px) scale(0.9); opacity: 0.8; }
  100% { transform: translateY(40px) scale(0.6); opacity: 0; }
`;

export const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: flex-end;
`;

export const Bg = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(5,12,26,0.92);
  backdrop-filter: blur(30px);
`;

export const Content = styled.div`
  position: relative;
  width: 100%;
  padding: 24px 28px;
  padding-top: 60px;
  padding-bottom: calc(120px + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

export const CloseBtn = styled.button`
  position: absolute;
  top: 20px; right: 20px;
  width: 36px; height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  color: ${({ theme }) => theme.text2};
  display: flex; align-items: center; justify-content: center;
  svg { width: 18px; height: 18px; }
`;

export const IconRing = styled.div<{ $paused: boolean }>`
  width: 120px; height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 40%, #1a3a6e, #0a1628);
  border: 1px solid rgba(59,130,246,0.3);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 60px rgba(59,130,246,0.2);
  opacity: ${({ $paused }) => $paused ? 0.5 : 1};
`;

export const WaterDrops = styled.div<{ $paused: boolean }>`
  position: relative;
  width: 48px; height: 56px;
  animation-play-state: ${({ $paused }) => $paused ? 'paused' : 'running'};
`;

export const Drop = styled.div`
  position: absolute;
  width: 12px; height: 16px;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  background: linear-gradient(180deg, ${({ theme }) => theme.accent2}, ${({ theme }) => theme.accent});
  animation: ${drip} 1.8s ease-in-out infinite;

  &:nth-child(1) { left: 0; top: 0; }
  &:nth-child(2) { left: 18px; top: -8px; }
  &:nth-child(3) { left: 36px; top: 4px; }
`;

export const ModeLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2.5px;
  color: ${({ theme }) => theme.accent2};
  text-transform: uppercase;
`;

export const ZoneTitle = styled.div`
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.5px;
`;

export const ProgressContainer = styled.div`width: 100%;`;

export const ProgressBar = styled.div`
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${({ theme }) => theme.accent}, ${({ theme }) => theme.accent2});
  border-radius: 2px;
  transition: width 1s linear;
`;

export const ProgressTimes = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.text3};
  font-family: ${({ theme }) => theme.fontMono};
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

export const PauseBtn = styled.button<{ $paused: boolean }>`
  width: 64px; height: 64px;
  border-radius: 50%;
  background: ${({ $paused, theme }) => $paused ? theme.surface2 : theme.accent};
  color: white;
  display: flex; align-items: center; justify-content: center;
  box-shadow: ${({ $paused, theme }) => $paused ? 'none' : `0 0 24px ${theme.accentGlow}`};
  transition: all 0.15s;
  &:active { opacity: 0.8; transform: scale(0.94); }
`;

export const StopBtn = styled.button`
  height: 44px;
  padding: 0 20px;
  border-radius: 22px;
  background: ${({ theme }) => theme.redDim};
  color: ${({ theme }) => theme.red};
  border: 1px solid rgba(239,68,68,0.25);
  font-size: 15px;
  font-weight: 600;
  display: flex; align-items: center; gap: 8px;
  transition: opacity 0.15s;
  &:active { opacity: 0.8; transform: scale(0.94); }
`;

export const ZoneChips = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const ZoneChip = styled.div<{ $active: boolean; $color: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  background: ${({ $active, $color }) => $active ? `${$color}18` : 'rgba(255,255,255,0.05)'};
  border: 1px solid ${({ $active, $color }) => $active ? `${$color}44` : 'transparent'};
  font-size: 13px;
  color: ${({ $active, $color, theme }) => $active ? $color : theme.text2};
`;

export const ChipDot = styled.div<{ $color: string }>`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;
