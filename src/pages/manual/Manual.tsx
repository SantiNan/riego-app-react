import { useNavigate } from 'react-router-dom';
import { Toggle } from '../../components/Toggle';
import { ConfirmModal } from '../../components/ConfirmModal';
import { useMQTT } from '../../hooks/useMQTT';
import { useIrrigation } from '../../hooks/useIrrigation';
import { useState } from 'react';
import {
  Wrapper, Header, BackBtn, HeaderTitle, Spacer, Warning,
  ZoneList, ZoneRow, ActiveBar, ZoneLeft, ZoneIcon, ZoneInfo,
  ZoneName, ZoneStatus,
} from './Manual.styles';
import { TabBar } from '../tabs/TabBar';
import { ZONE_NAMES } from '../../lib/types';

const ZONE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7'];
const ZONE_DIM    = ['rgba(59,130,246,0.15)','rgba(34,197,94,0.15)','rgba(245,158,11,0.15)','rgba(168,85,247,0.15)'];

export function Manual() {
  const navigate = useNavigate();
  const { status, pending } = useMQTT();
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
        <HeaderTitle>RIEGO MANUAL</HeaderTitle>
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
                  <ZoneName>{ZONE_NAMES[z - 1]}</ZoneName>
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
                disabled={pending}
                onClick={e => e.stopPropagation()}
              />
            </ZoneRow>
          );
        })}
      </ZoneList>

      <TabBar />

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
