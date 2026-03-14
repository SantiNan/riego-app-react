import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgramCard } from '../../components/ProgramCard';
import { useMQTT } from '../../hooks/useMQTT';
import { useIrrigation } from '../../hooks/useIrrigation';
import { useToast } from '../../components/Toast';
import { sortByTime } from '../../lib/programs';
import {
  Wrapper, Header, HeaderLeft, HeaderRight, StatusDot,
  HeaderTitle, IconBtn, Content, EmptyState, EmptyIcon,
  EmptyTitle, EmptySub, Spinner,
} from './Programs.styles';

export function Programs() {
  const navigate = useNavigate();
  const { connected, synced, status, programs, lastAck } = useMQTT();
  const { setProgram, requestSync } = useIrrigation();
  const { showToast } = useToast();
  const initialAck = useRef(lastAck);

  // Reaccionar a acks — ignora el ack que ya existía al montar
  useEffect(() => {
    if (!lastAck || lastAck === initialAck.current) return;
    if (!lastAck.ok) { showToast(lastAck.error ?? 'Error en el comando', 'error'); return; }
    if (lastAck.cmd === 'program') requestSync();
  }, [lastAck]);

  function handleToggle(id: number, enabled: boolean) {
    const prog = programs.find(p => p.id === id);
    if (!prog) return;

    const daysArr = [];
    // Convertir el array de días a bitmask
    for (let i = 0; i <= 6; i++) if (prog.days & (1 << i)) daysArr.push(i);
    setProgram({ ...prog, days: daysArr, enabled });
  }

  const sorted = sortByTime(programs);

  return (
    <Wrapper>
      <Header>
        <HeaderLeft>
          <StatusDot $online={connected} />
          <HeaderTitle>Riego Basquade</HeaderTitle>
        </HeaderLeft>
        <HeaderRight>
          <IconBtn onClick={() => navigate('/program/new')} title="Nuevo programa">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </IconBtn>
        </HeaderRight>
      </Header>

      <Content>
        {(!connected || !synced) ? (
          <EmptyState>
            <EmptyIcon>
              <Spinner viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2.5" opacity="0.15"/>
                <path d="M32 4a28 28 0 0 1 28 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </Spinner>
            </EmptyIcon>
            <EmptyTitle>Conectando...</EmptyTitle>
          </EmptyState>
        ) : (
          sorted.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <svg viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
                  <path d="M20 36c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                  <path d="M32 24v-8M28 20l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
                </svg>
              </EmptyIcon>
              <EmptyTitle>Sin programas</EmptyTitle>
              <EmptySub>Tocá <strong>+</strong> para crear tu primer programa de riego</EmptySub>
            </EmptyState>
          ) : (
            sorted.map(prog => (
              <ProgramCard
                key={prog.id}
                program={prog}
                status={status}
                onToggle={handleToggle}
              />
            ))
          )
        )}
      </Content>
    </Wrapper>
  );
}
