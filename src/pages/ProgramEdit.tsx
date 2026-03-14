import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Toggle } from '../components/Toggle';
import { ConfirmModal } from '../components/ConfirmModal';
import { useMQTT } from '../hooks/useMQTT';
import { useIrrigation } from '../hooks/useIrrigation';
import { useToast } from '../components/Toast';
import { decodeDays, findFreeSlot, validateProgram } from '../lib/programs';
import { MAX_DURATION } from '../config/mqtt';

const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const DAY_INDICES = [1, 2, 3, 4, 5, 6, 0]; // orden visual L→D
const ZONE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7'];

export function ProgramEdit() {
  const { id }     = useParams<{ id: string }>();
  const navigate   = useNavigate();
  const { programs, lastAck } = useMQTT();
  const { setProgram, deleteProgram } = useIrrigation();
  const { showToast } = useToast();

  const isNew  = id === 'new';
  const prog   = isNew ? null : programs.find(p => p.id === Number(id)) ?? null;

  const [enabled,  setEnabled]  = useState(prog?.enabled ?? true);
  const [start,    setStart]    = useState(prog?.start   ?? '07:00');
  const [days,     setDays]     = useState<number[]>(prog ? decodeDays(prog.days) : []);
  const [zones,    setZones]    = useState<[number,number,number,number]>(prog?.zones ?? [0,0,0,0]);
  const [showDel,  setShowDel]  = useState(false);

  // Ack handler
  useEffect(() => {
    if (!lastAck) return;
    if (!lastAck.ok) { showToast(lastAck.error ?? 'Error', 'error'); return; }
    if (lastAck.cmd === 'program' && (lastAck.action === 'set' || lastAck.action === 'delete')) {
      showToast(lastAck.action === 'set' ? 'Programa guardado ✓' : 'Programa eliminado', 'success');
      navigate(-1);
    }
  }, [lastAck]);

  function toggleDay(day: number) {
    setDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  }

  function setZone(idx: number, val: number) {
    const next = [...zones] as [number,number,number,number];
    next[idx] = Math.max(0, Math.min(MAX_DURATION, val));
    setZones(next);
  }

  function handleSave() {
    const err = validateProgram(days, zones);
    if (err) { showToast(err, 'error'); return; }

    let slotId = isNew ? -1 : Number(id);
    if (slotId === -1) {
      slotId = findFreeSlot(programs);
      if (slotId === -1) { showToast('EEPROM llena (32 programas)', 'error'); return; }
    }

    setProgram({ id: slotId, enabled, start, days, zones });
  }

  return (
    <Wrapper>
      <Header>
        <BackBtn onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
          </svg>
        </BackBtn>
        <HeaderTitle>{isNew ? 'Nuevo programa' : 'Editar programa'}</HeaderTitle>
        <SaveBtn onClick={handleSave}>Guardar</SaveBtn>
      </Header>

      <FormContent>
        {/* Activo */}
        <Section>
          <Row>
            <Label>Activo</Label>
            <Toggle checked={enabled} onChange={setEnabled} />
          </Row>
        </Section>

        {/* Hora */}
        <Section>
          <TimeInput
            type="time"
            value={start}
            onChange={e => setStart(e.target.value)}
          />
        </Section>

        {/* Días */}
        <Section>
          <SectionLabel>Días</SectionLabel>
          <DaysRow>
            {DAY_INDICES.map((dayIdx, i) => (
              <DayBtn
                key={dayIdx}
                $selected={days.includes(dayIdx)}
                onClick={() => toggleDay(dayIdx)}
              >
                {DAY_LABELS[i]}
              </DayBtn>
            ))}
          </DaysRow>
        </Section>

        {/* Zonas */}
        <Section>
          <SectionLabel>
            Duración por zona <Hint>(0 = inactiva)</Hint>
          </SectionLabel>
          <ZonesGrid>
            {zones.map((z, i) => (
              <ZoneItem key={i}>
                <ZoneLabel>
                  <ZoneDot $color={ZONE_COLORS[i]} />
                  Zona {i + 1}
                </ZoneLabel>
                <Stepper>
                  <StepBtn onClick={() => setZone(i, z - 1)}>−</StepBtn>
                  <StepVal>{z}</StepVal>
                  <StepBtn onClick={() => setZone(i, z + 1)}>+</StepBtn>
                  <StepUnit>min</StepUnit>
                </Stepper>
              </ZoneItem>
            ))}
          </ZonesGrid>
        </Section>

        {/* Eliminar */}
        {!isNew && (
          <Section>
            <DeleteBtn onClick={() => setShowDel(true)}>Eliminar programa</DeleteBtn>
          </Section>
        )}
      </FormContent>

      {showDel && (
        <ConfirmModal
          title="¿Eliminar programa?"
          body="Esta acción lo eliminará de la EEPROM."
          confirmLabel="Eliminar"
          onConfirm={() => { setShowDel(false); deleteProgram(Number(id)); }}
          onCancel={() => setShowDel(false)}
        />
      )}
    </Wrapper>
  );
}

// ── Styles ───────────────────────────────────────────

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

const HeaderTitle = styled.span`font-size: 18px; font-weight: 600; letter-spacing: -0.3px;`;

const BackBtn = styled.button`
  width: 40px; height: 40px;
  border-radius: 50%;
  color: ${({ theme }) => theme.accent2};
  display: flex; align-items: center; justify-content: center;
  svg { width: 22px; height: 22px; }
`;

const SaveBtn = styled.button`
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

const FormContent = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px));
`;

const Section = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  &:last-child { border-bottom: none; }
`;

const Row = styled.div`display: flex; align-items: center; justify-content: space-between;`;
const Label = styled.span`font-size: 16px; font-weight: 500;`;

const SectionLabel = styled.p`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text3};
  margin-bottom: 14px;
`;

const Hint = styled.span`
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
  font-size: 11px;
`;

const TimeInput = styled.input`
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

const DaysRow = styled.div`display: flex; gap: 6px; justify-content: space-between;`;

const DayBtn = styled.button<{ $selected: boolean }>`
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

const ZonesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const ZoneItem = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radiusSm};
  padding: 12px;
`;

const ZoneLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.text2};
  font-weight: 500;
  margin-bottom: 10px;
`;

const ZoneDot = styled.div<{ $color: string }>`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  box-shadow: 0 0 6px ${({ $color }) => $color};
`;

const Stepper = styled.div`display: flex; align-items: center; gap: 8px;`;

const StepBtn = styled.button`
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

const StepVal = styled.span`
  min-width: 28px;
  text-align: center;
  font-family: ${({ theme }) => theme.fontMono};
  font-size: 18px;
  font-weight: 500;
`;

const StepUnit = styled.span`font-size: 12px; color: ${({ theme }) => theme.text3};`;

const DeleteBtn = styled.button`
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
