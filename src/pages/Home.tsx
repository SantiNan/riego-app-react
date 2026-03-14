import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ProgramCard } from '../components/ProgramCard';
import { useMQTT } from '../hooks/useMQTT';
import { useIrrigation } from '../hooks/useIrrigation';
import { useToast } from '../components/Toast';
import { sortByTime } from '../lib/programs';

export function Home() {
  const navigate = useNavigate();
  const { connected, status, programs, lastAck } = useMQTT();
  const { setProgram, requestSync } = useIrrigation();
  const { showToast } = useToast();

  // Reaccionar a acks
  useEffect(() => {
    if (!lastAck) return;
    if (!lastAck.ok) { showToast(lastAck.error ?? 'Error en el comando', 'error'); return; }
    if (lastAck.cmd === 'program') requestSync();
  }, [lastAck]);

  function handleToggle(id: number, enabled: boolean) {
    const prog = programs.find(p => p.id === id);
    if (!prog) return;
    setProgram({ ...prog, days: [prog.days], enabled });
    // Corregir: days debe ser array de índices
    const daysArr = [];
    for (let i = 0; i <= 6; i++) if (prog.days & (1 << i)) daysArr.push(i);
    setProgram({ ...prog, days: daysArr, enabled });
  }

  const sorted = sortByTime(programs);

  return (
    <Wrapper>
      <Header>
        <HeaderLeft>
          <StatusDot $online={connected} />
          <HeaderTitle>Riego</HeaderTitle>
        </HeaderLeft>
        <HeaderRight>
          <IconBtn onClick={() => navigate('/manual')} title="Riego manual">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v6M12 22v-6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M22 12h-6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24"/>
            </svg>
          </IconBtn>
          <IconBtn onClick={() => navigate('/program/new')} title="Nuevo programa">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </IconBtn>
        </HeaderRight>
      </Header>

      <Content>
        {sorted.length === 0 ? (
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
        )}
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

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

const HeaderLeft = styled.div`display: flex; align-items: center; gap: 8px;`;
const HeaderRight = styled.div`display: flex; align-items: center; gap: 4px;`;

const StatusDot = styled.div<{ $online: boolean }>`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${({ $online, theme }) => $online ? theme.green : theme.text3};
  box-shadow: ${({ $online, theme }) => $online ? `0 0 8px ${theme.green}` : 'none'};
  transition: background 0.3s;
`;

const HeaderTitle = styled.span`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.3px;
`;

const IconBtn = styled.button`
  width: 40px; height: 40px;
  border-radius: 50%;
  color: ${({ theme }) => theme.text2};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  svg { width: 22px; height: 22px; }
  &:active { background: ${({ theme }) => theme.surface}; }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
  -webkit-overflow-scrolling: touch;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 12px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  color: ${({ theme }) => theme.text3};
  svg { width: 64px; height: 64px; }
`;

const EmptyTitle = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text2};
`;

const EmptySub = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text3};
  line-height: 1.5;
  strong { color: ${({ theme }) => theme.text2}; }
`;
