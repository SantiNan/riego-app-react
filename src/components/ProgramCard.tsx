import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Toggle } from './Toggle';
import { formatDays } from '../lib/programs';
import { ZONE_NAMES, type Program, type EspStatus } from '../lib/types';

interface Props {
  program:  Program;
  status:   EspStatus | null;
  onToggle: (id: number, enabled: boolean) => void;
}

function formatTime12(time: string): string {
  const [hStr, m] = time.split(':');
  let h = parseInt(hStr, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${suffix}`;
}

export function ProgramCard({ program, status, onToggle }: Props) {
  const navigate  = useNavigate();
  const isActive  =
    status != null &&
    (status.mode === 'program' || status.mode === 'paused') &&
    status.program === program.id;

  return (
    <Card
      $disabled={!program.enabled}
      $active={isActive}
      onClick={() => navigate(`/program/${program.id}`)}
    >
      {isActive && <ActiveBar />}
      <Left>
        <Time $disabled={!program.enabled}>{formatTime12(program.start)}</Time>
        <Meta>
          <Days>{formatDays(program.days)}</Days>
          <ZoneDots>
            {program.zones.map((z, i) => (
              <Dot key={i} $index={i} $on={z > 0} />
            ))}
          </ZoneDots>
        </Meta>
        {isActive && (
          <ActiveBadge>
            {status!.mode === 'paused' ? 'Pausado' : 'Regando'} — {ZONE_NAMES[(status!.zone ?? 1) - 1]}
            {status!.remaining != null && ` · ${status!.remaining} min`}
          </ActiveBadge>
        )}
      </Left>
      <Right>
        <Toggle
          checked={program.enabled}
          onChange={enabled => onToggle(program.id, enabled)}
          onClick={e => e.stopPropagation()}
        />
        <Chevron>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </Chevron>
      </Right>
    </Card>
  );
}

const ZONE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7'];

const Card = styled.div<{ $disabled: boolean; $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: ${({ $active, theme }) => $active ? theme.accentGlow : theme.surface};
  border-radius: ${({ theme }) => theme.radius};
  border: 1px solid ${({ $active, theme }) => $active ? theme.accent : theme.border};
  cursor: pointer;
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;
  transition: background 0.15s, transform 0.12s;
  opacity: ${({ $disabled }) => $disabled ? 0.6 : 1};
  &:active { background: ${({ theme }) => theme.surface2}; transform: scale(0.99); }
`;

const ActiveBar = styled.div`
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4px;
  background: ${({ theme }) => theme.accent};
`;

const Left = styled.div`flex: 1; min-width: 0;`;

const Time = styled.div<{ $disabled: boolean }>`
  font-family: ${({ theme }) => theme.fontMono};
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -1px;
  line-height: 1;
  color: ${({ $disabled, theme }) => $disabled ? theme.text3 : theme.text};
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 5px;
`;

const Days = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text2};
`;

const ZoneDots = styled.div`
  display: flex;
  gap: 3px;
  align-items: center;
`;

const Dot = styled.div<{ $index: number; $on: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $index }) => ZONE_COLORS[$index]};
  opacity: ${({ $on }) => $on ? 1 : 0.25};
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

const ActiveBadge = styled.span`
  display: inline-block;
  margin-top: 6px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.accent};
`;

const Chevron = styled.div`
  color: ${({ theme }) => theme.text3};
  svg { width: 16px; height: 16px; }
`;
