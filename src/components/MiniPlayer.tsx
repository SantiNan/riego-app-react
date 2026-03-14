import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { useMQTT } from '../hooks/useMQTT';
import { useIrrigation } from '../hooks/useIrrigation';
import { ZONE_NAMES } from '../lib/types';

export function MiniPlayer() {
  const { status } = useMQTT();
  const { togglePause, stopManual, cancelProgram } = useIrrigation();
  const navigate = useNavigate();

  if (!status || status.mode === 'idle') return null;

  const isPaused  = status.mode === 'paused';
  const isManual  = status.mode === 'manual';

  const title = isManual
    ? `Riego manual — ${ZONE_NAMES[status.zone! - 1]}`
    : isPaused
      ? `Riego pausado — ${ZONE_NAMES[status.zone! - 1]}`
      : `Riego programado — ${ZONE_NAMES[status.zone! - 1]}`;

  const sub = !isManual && status.remaining != null
    ? `${status.remaining} min restante${status.remaining !== 1 ? 's' : ''}`
    : '';

  function handleExpand() {
    if (isManual) navigate('/manual');
    else          navigate('/player');
  }

  return (
    <Wrapper onClick={handleExpand}>
        <Info>
          <Bars $paused={isPaused}>
            <span /><span /><span /><span />
          </Bars>
          <Text>
            <Title>{title}</Title>
            {sub && <Sub>{sub}</Sub>}
          </Text>
        </Info>
        <Actions>
          {!isManual && (
            <ActionBtn
              onClick={e => { e.stopPropagation(); togglePause(); }}
              title={isPaused ? 'Reanudar' : 'Pausar'}
            >
              {isPaused
                ? <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M5 3l14 9-14 9V3z"/></svg>
                : <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
              }
            </ActionBtn>
          )}
          <StopBtn
            onClick={e => {
              e.stopPropagation();
              if (isManual) stopManual();
              else cancelProgram();
            }}
            title="Detener"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <rect x="5" y="5" width="14" height="14" rx="2"/>
            </svg>
          </StopBtn>
        </Actions>
    </Wrapper>
  );
}

const soundwave = keyframes`
  0%, 100% { transform: scaleY(1); opacity: 1; }
  50%       { transform: scaleY(0.4); opacity: 0.6; }
`;

const Wrapper = styled.div`
  background: ${({ theme }) => theme.accent};
  display: flex;
  align-items: center;
  padding: 10px 14px;
  gap: 12px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`;

const Info = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const Bars = styled.div<{ $paused: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 20px;
  flex-shrink: 0;

  span {
    display: block;
    width: 3px;
    border-radius: 2px;
    background: rgba(255,255,255,0.9);
    animation: ${({ $paused }) => $paused ? 'none' : css`${soundwave} 0.8s ease-in-out infinite`};
    opacity: ${({ $paused }) => $paused ? 0.4 : 1};
  }
  span:nth-child(1) { height: 8px;  animation-delay: 0s; }
  span:nth-child(2) { height: 14px; animation-delay: 0.15s; }
  span:nth-child(3) { height: 10px; animation-delay: 0.3s; }
  span:nth-child(4) { height: 6px;  animation-delay: 0.1s; }
`;

const Text = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Sub = styled.span`
  font-size: 12px;
  color: rgba(255,255,255,0.7);
  display: block;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActionBtn = styled.button`
  width: 38px; height: 38px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  &:active { background: rgba(255,255,255,0.3); }
`;

const StopBtn = styled(ActionBtn)`
  background: rgba(255,255,255,0.15);
  color: #ffffff;
  &:active { background: rgba(255,255,255,0.25); }
`;
