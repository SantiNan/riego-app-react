import styled from 'styled-components';

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

export const HeaderTitle = styled.span`font-size: 18px; font-weight: 600; letter-spacing: -0.3px;`;

export const BackBtn = styled.button`
  width: 40px; height: 40px;
  border-radius: 50%;
  color: ${({ theme }) => theme.accent2};
  display: flex; align-items: center; justify-content: center;
  svg { width: 22px; height: 22px; }
`;

export const SaveBtn = styled.button`
  height: 36px;
  padding: 0 14px;
  border-radius: 20px;
  background: ${({ theme }) => theme.accent};
  color: white;
  font-size: 14px;
  font-weight: 600;
  transition: opacity 0.15s;
  &:active { opacity: 0.75; }
`;

export const FormContent = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px));
`;

export const Section = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  &:last-child { border-bottom: none; }
`;

export const Row = styled.div`display: flex; align-items: center; justify-content: space-between;`;
export const Label = styled.span`font-size: 16px; font-weight: 500;`;

export const SectionLabel = styled.p`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text3};
  margin-bottom: 14px;
`;

export const Hint = styled.span`
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
  font-size: 11px;
`;

export const TimeInput = styled.input`
  font-family: ${({ theme }) => theme.fontMono};
  font-size: 52px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  text-align: center;
  letter-spacing: -2px;
  padding: 8px 0;
  -webkit-appearance: none;
  &::-webkit-calendar-picker-indicator { display: none; }
`;

export const DaysRow = styled.div`display: flex; gap: 6px; justify-content: space-between;`;

export const DayBtn = styled.button<{ $selected: boolean }>`
  flex: 1;
  height: 40px;
  border-radius: 10px;
  border: 1px solid ${({ $selected, theme }) => $selected ? theme.accent : theme.border2};
  background: ${({ $selected, theme }) => $selected ? theme.accent : theme.surface};
  color: ${({ $selected, theme }) => $selected ? 'white' : theme.text3};
  font-size: 13px;
  font-weight: 600;
  box-shadow: ${({ $selected, theme }) => $selected ? `0 0 12px ${theme.accentGlow}` : 'none'};
  transition: all 0.15s;
  &:active { opacity: 0.7; }
`;

export const ZonesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

export const ZoneItem = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radiusSm};
  padding: 12px;
`;

export const ZoneLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.text2};
  font-weight: 500;
  margin-bottom: 10px;
`;

export const ZoneDot = styled.div<{ $color: string }>`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  box-shadow: 0 0 6px ${({ $color }) => $color};
`;

export const Stepper = styled.div`display: flex; align-items: center; gap: 8px;`;

export const StepBtn = styled.button`
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.border2};
  background: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text2};
  font-size: 18px;
  display: flex; align-items: center; justify-content: center;
  line-height: 1;
  transition: background 0.12s;
  &:active { background: ${({ theme }) => theme.surface2}; }
`;

export const StepVal = styled.span`
  min-width: 28px;
  text-align: center;
  font-family: ${({ theme }) => theme.fontMono};
  font-size: 18px;
  font-weight: 500;
`;

export const StepUnit = styled.span`font-size: 12px; color: ${({ theme }) => theme.text3};`;

export const DeleteBtn = styled.button`
  width: 100%;
  height: 48px;
  border-radius: ${({ theme }) => theme.radiusSm};
  border: 1px solid rgba(239,68,68,0.3);
  background: ${({ theme }) => theme.redDim};
  color: ${({ theme }) => theme.red};
  font-size: 15px;
  font-weight: 600;
  transition: background 0.15s;
  &:active { background: rgba(239,68,68,0.25); }
`;
