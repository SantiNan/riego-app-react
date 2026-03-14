import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { ConfirmModal } from '../components/ConfirmModal';
import { useMQTT } from '../hooks/useMQTT';
import { useIrrigation } from '../hooks/useIrrigation';
import { useState } from 'react';

const ZONE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7'];

export function Player() {
  const navigate = useNavigate();
  const { status, programs } = useMQTT();
  const { togglePause, stopManual } = useIrrigation();
  const [confirmStop, setConfirmStop] = useState(false);

  // Si no hay riego activo, volver al home
  if (!status || status.mode === 'idle' || status.mode === 'manual') {
    navigate('/', { replace: true });
    return null;
  }

  const isPaused = status.mode === 'paused';
  const prog = programs.find(p => p.id === status.program);
  const rem  = status.remaining ?? 0;

  // Calcular progreso: buscar duración de la zona actual en el programa
  const zoneDuration = prog ? prog.zones[(status.zone ?? 1) - 1] : 0;
  const elapsed  = Math.max(0, zoneDuration - rem);
  const progress = zoneDuration > 0 ? Math.min(100, (elapsed / zoneDuration) * 100) : 0;

  return (
    <Wrapper>
      <Bg />
      <Content>
        <CloseBtn onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </CloseBtn>

        <IconRing $paused={isPaused}>
          <WaterDrops $paused={isPaused}>
            <Drop style={{ animationDelay: '0s' }} />
            <Drop style={{ animationDelay: '0.6s' }} />
            <Drop style={{ animationDelay: '1.2s' }} />
          </WaterDrops>
        </IconRing>

        <ModeLabel>{`PROGRAMA ${status.program ?? '?'}`}</ModeLabel>
        <ZoneTitle>Zona {status.zone ?? '?'}</ZoneTitle>

        <ProgressContainer>
          <ProgressBar>
            <ProgressFill style={{ width: `${progress}%` }} />
          </ProgressBar>
          <ProgressTimes>
            <span>{elapsed} min</span>
            <span>{rem} min</span>
          </ProgressTimes>
        </ProgressContainer>

        <Controls>
          <PauseBtn onClick={togglePause} $paused={isPaused}>
            {isPaused
              ? <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M5 3l14 9-14 9V3z"/></svg>
              : <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            }
          </PauseBtn>
          <StopBtn onClick={() => setConfirmStop(true)}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>
            Detener
          </StopBtn>
        </Controls>

        {prog && (
          <ZoneChips>
            {prog.zones.map((z, i) => {
              if (z === 0) return null;
              const isActive = (i + 1) === status.zone;
              return (
                <ZoneChip key={i} $active={isActive} $color={ZONE_COLORS[i]}>
                  <ChipDot $color={ZONE_COLORS[i]} />
                  Zona {i + 1} <strong>{z} min</strong>
                </ZoneChip>
              );
            })}
          </ZoneChips>
        )}
      </Content>

      {confirmStop && (
        <ConfirmModal
          title="¿Detener riego?"
          body="Se interrumpirá el programa en curso."
          confirmLabel="Detener"
          onConfirm={() => { setConfirmStop(false); stopManual(); navigate('/'); }}
          onCancel={() => setConfirmStop(false)}
        />
      )}
    </Wrapper>
  );
}

// ── Animations ────────────────────────────────────────

const drip = keyframes`
  0%   { transform: translateY(0) scale(1);   opacity: 1; }
  60%  { transform: translateY(24px) scale(0.9); opacity: 0.8; }
  100% { transform: translateY(40px) scale(0.6); opacity: 0; }
`;

// ── Styles ────────────────────────────────────────────

const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: flex-end;
`;

const Bg = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(5,12,26,0.92);
  backdrop-filter: blur(30px);
`;

const Content = styled.div`
  position: relative;
  width: 100%;
  padding: 24px 28px;
  padding-top: 60px;
  padding-bottom: calc(48px + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 20px; right: 20px;
  width: 36px; height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  color: ${({ theme }) => theme.text2};
  display: flex; align-items: center; justify-content: center;
  svg { width: 18px; height: 18px; }
`;

const IconRing = styled.div<{ $paused: boolean }>`
  width: 120px; height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 40%, #1a3a6e, #0a1628);
  border: 1px solid rgba(59,130,246,0.3);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 60px rgba(59,130,246,0.2);
  opacity: ${({ $paused }) => $paused ? 0.5 : 1};
`;

const WaterDrops = styled.div<{ $paused: boolean }>`
  position: relative;
  width: 48px; height: 56px;
  animation-play-state: ${({ $paused }) => $paused ? 'paused' : 'running'};
`;

const Drop = styled.div`
  position: absolute;
  width: 12px; height: 16px;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  background: linear-gradient(180deg, ${({ theme }) => theme.accent2}, ${({ theme }) => theme.accent});
  animation: ${drip} 1.8s ease-in-out infinite;

  &:nth-child(1) { left: 0; top: 0; }
  &:nth-child(2) { left: 18px; top: -8px; }
  &:nth-child(3) { left: 36px; top: 4px; }
`;

const ModeLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2.5px;
  color: ${({ theme }) => theme.accent2};
  text-transform: uppercase;
`;

const ZoneTitle = styled.div`
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.5px;
`;

const ProgressContainer = styled.div`width: 100%;`;

const ProgressBar = styled.div`
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${({ theme }) => theme.accent}, ${({ theme }) => theme.accent2});
  border-radius: 2px;
  transition: width 1s linear;
`;

const ProgressTimes = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.text3};
  font-family: ${({ theme }) => theme.fontMono};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const PauseBtn = styled.button<{ $paused: boolean }>`
  width: 64px; height: 64px;
  border-radius: 50%;
  background: ${({ $paused, theme }) => $paused ? theme.surface2 : theme.accent};
  color: white;
  display: flex; align-items: center; justify-content: center;
  box-shadow: ${({ $paused, theme }) => $paused ? 'none' : `0 0 24px ${theme.accentGlow}`};
  transition: all 0.15s;
  &:active { opacity: 0.8; transform: scale(0.94); }
`;

const StopBtn = styled.button`
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

const ZoneChips = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
`;

const ZoneChip = styled.div<{ $active: boolean; $color: string }>`
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

const ChipDot = styled.div<{ $color: string }>`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;
