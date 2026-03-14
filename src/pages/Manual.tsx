import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Toggle } from '../components/Toggle';
import { ConfirmModal } from '../components/ConfirmModal';
import { useMQTT } from '../hooks/useMQTT';
import { useIrrigation } from '../hooks/useIrrigation';
import { useState } from 'react';

const ZONE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7'];
const ZONE_DIM    = ['rgba(59,130,246,0.15)','rgba(34,197,94,0.15)','rgba(245,158,11,0.15)','rgba(168,85,247,0.15)'];

export function Manual() {
  const navigate = useNavigate();
  const { status } = useMQTT();
  const { startManual, stopManual } = useIrrigation();
  const [confirmStop, setConfirmStop] = useState(false);

  const activeZone  = status?.mode === 'manual' ? status.zone : null;
  const progRunning = status?.mode === 'program' || status?.mode === 'paused';

  function handleToggle(zone: number, enabled: boolean) {
    if (enabled) {
      startManual(zone);
    } else {
      // Solo mandar off si esta zona es la activa
      if (activeZone === zone) stopManual();
    }
  }

  return (
    <Wrapper>
      <Header>
        <BackBtn onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
          </svg>
        </BackBtn>
        <HeaderTitle>Riego manual</HeaderTitle>
        <Spacer />
      </Header>

      {progRunning && (
        <Warning>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          <span>Activar una zona cancelará el programa en curso</span>
        </Warning>
      )}

      <ZoneList>
        {[1, 2, 3, 4].map(z => {
          const isActive = activeZone === z;
          return (
            <ZoneRow key={z} $active={isActive} $colorIndex={z - 1}>
              {isActive && <ActiveBar $color={ZONE_COLORS[z - 1]} />}
              <ZoneLeft>
                <ZoneIcon $color={ZONE_COLORS[z - 1]} $dim={ZONE_DIM[z - 1]} $active={isActive} />
                <ZoneInfo>
                  <ZoneName>Zona {z}</ZoneName>
                  <ZoneStatus $active={isActive}>
                    {isActive ? 'Regando' : 'Apagada'}
                  </ZoneStatus>
                </ZoneInfo>
              </ZoneLeft>
              <Toggle
                checked={isActive}
                onChange={enabled => handleToggle(z, enabled)}
                zoneColor={ZONE_COLORS[z - 1]}
                zoneDim={ZONE_DIM[z - 1]}
                onClick={e => e.stopPropagation()}
              />
            </ZoneRow>
          );
        })}
      </ZoneList>

      <Footer>
        {activeZone != null && (
          <StopAllBtn onClick={() => setConfirmStop(true)}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <rect x="5" y="5" width="14" height="14" rx="2"/>
            </svg>
            Apagar todo
          </StopAllBtn>
        )}
      </Footer>

      {confirmStop && (
        <ConfirmModal
          title="¿Apagar riego?"
          body="Se detendrá el riego manual en curso."
          confirmLabel="Apagar"
          onConfirm={() => { setConfirmStop(false); stopManual(); }}
          onCancel={() => setConfirmStop(false)}
        />
      )}
    </Wrapper>
  );
}

// ── Styles ────────────────────────────────────────────

const dropPulse = keyframes`
  0%, 100% { transform: scale(1) translateY(0); opacity: 0.7; }
  50%       { transform: scale(1.15) translateY(-2px); opacity: 1; }
`;

const Wrapper = styled.div`display: flex; flex-direction: column; height: 100%;`;

const Header = styled.header`
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

const BackBtn = styled.button`
  width: 40px; height: 40px;
  border-radius: 50%;
  color: ${({ theme }) => theme.accent2};
  display: flex; align-items: center; justify-content: center;
  svg { width: 22px; height: 22px; }
`;

const HeaderTitle = styled.span`font-size: 18px; font-weight: 600;`;
const Spacer = styled.div`width: 40px;`;

const Warning = styled.div`
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

const ZoneList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  -webkit-overflow-scrolling: touch;
`;

const ZoneRow = styled.div<{ $active: boolean; $colorIndex: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: ${({ $active, theme }) => $active ? theme.surface2 : theme.surface};
  border-radius: ${({ theme }) => theme.radius};
  border: 1px solid ${({ $active }) => $active ? 'rgba(59,130,246,0.35)' : 'transparent'};
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;
  transition: background 0.15s;
`;

const ActiveBar = styled.div<{ $color: string }>`
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: ${({ $color }) => $color};
`;

const ZoneLeft = styled.div`display: flex; align-items: center; gap: 14px;`;

const ZoneIcon = styled.div<{ $color: string; $dim: string; $active: boolean }>`
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

const ZoneInfo = styled.div`display: flex; flex-direction: column; gap: 2px;`;
const ZoneName = styled.span`font-size: 16px; font-weight: 500;`;

const ZoneStatus = styled.span<{ $active: boolean }>`
  font-size: 13px;
  color: ${({ $active, theme }) => $active ? theme.accent2 : theme.text3};
  transition: color 0.2s;
`;

const Footer = styled.div`
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid ${({ theme }) => theme.border};
  min-height: 72px;
  display: flex;
  align-items: center;
`;

const StopAllBtn = styled.button`
  width: 100%;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius};
  border: 1px solid rgba(239,68,68,0.3);
  background: ${({ theme }) => theme.redDim};
  color: ${({ theme }) => theme.red};
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s;
  &:active { background: rgba(239,68,68,0.25); }
`;
