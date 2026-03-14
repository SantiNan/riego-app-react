import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Toggle } from '../../components/Toggle';
import { ConfirmModal } from '../../components/ConfirmModal';
import { useMQTT } from '../../hooks/useMQTT';
import { useIrrigation } from '../../hooks/useIrrigation';
import { useToast } from '../../components/Toast';
import { decodeDays, findFreeSlot, validateProgram } from '../../lib/programs';
import { MAX_DURATION } from '../../config/mqtt';
import {
  Wrapper, Header, HeaderTitle, BackBtn, SaveBtn, FormContent,
  Section, Row, Label, SectionLabel, Hint, TimeInput, DaysRow,
  DayBtn, ZonesGrid, ZoneItem, ZoneLabel, ZoneDot, Stepper,
  StepBtn, StepVal, StepUnit, DeleteBtn,
} from './ProgramEdit.styles';

const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const DAY_INDICES = [1, 2, 3, 4, 5, 6, 0]; // orden visual L→D
const ZONE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7'];

export function ProgramEdit() {
  const { id }     = useParams<{ id: string }>();
  const navigate   = useNavigate();
  const { programs, lastAck } = useMQTT();
  const { setProgram, deleteProgram, requestSync } = useIrrigation();
  const { showToast } = useToast();

  const isNew  = id === 'new';
  const prog   = isNew ? null : programs.find(p => p.id === Number(id)) ?? null;

  const [enabled,  setEnabled]  = useState(prog?.enabled ?? true);
  const [start,    setStart]    = useState(prog?.start   ?? '07:00');
  const [days,     setDays]     = useState<number[]>(prog ? decodeDays(prog.days) : []);
  const [zones,    setZones]    = useState<[number,number,number,number]>(prog?.zones ?? [0,0,0,0]);
  const [showDel,  setShowDel]  = useState(false);
  const initialAck = useRef(lastAck);

  // Ack handler — ignora el ack que ya existía al montar
  useEffect(() => {
    if (!lastAck || lastAck === initialAck.current) return;
    if (!lastAck.ok) { showToast(lastAck.error ?? 'Error', 'error'); return; }
    if (lastAck.cmd === 'program' && (lastAck.action === 'set' || lastAck.action === 'delete')) {
      showToast(lastAck.action === 'set' ? 'Programa guardado ✓' : 'Programa eliminado', 'success');
      requestSync();
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
