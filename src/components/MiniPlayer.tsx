import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { useMQTT } from '../hooks/useMQTT';
import { useIrrigation } from '../hooks/useIrrigation';

export function MiniPlayer() {
  const { status } = useMQTT();
  const { togglePause, stopManual } = useIrrigation();
  const navigate = useNavigate();

  if (!status || status.mode === 'idle') return null;

  const isPaused  = status.mode === 'paused';
  const isManual  = status.mode === 'manual';

  const title = isManual
    ? `Riego manual — Zona ${status.zone}`
    : isPaused
      ? `Pausado — Zona ${status.zone}`
      : `Programa ${status.program} — Zona ${status.zone}`;

  const sub = !isManual && status.remaining != null
    ? `${status.remaining} min restante${status.remaining !== 1 ? 's' : ''}`
    : '';

  function handleExpand() {
    if (isManual) navigate('/manual');
    else          navigate('/player');
  }

  return (
    <Wrapper>
      <Inner onClick={handleExpand}>
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
            onClick={e => { e.stopPropagation(); stopManual(); }}
            title="Detener"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <rect x="5" y="5" width="14" height="14" rx="2"/>
            </svg>
          </StopBtn>
        </Actions>
      </Inner>
    </Wrapper>
  );
}

const soundwave = keyframes`
  0%, 100% { transform: scaleY(1); opacity: 1; }
  50%       { transform: scaleY(0.4); opacity: 0.6; }
`;

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0; right: 0;
  z-index: 100;
  padding: 8px 12px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
`;

const Inner = styled.div`
  background: ${({ theme }) => theme.surface2};
  border: 1px solid ${({ theme }) => theme.border2};
  border-radius: ${({ theme }) => theme.radius};
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  padding: 12px 14px;
  gap: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.15);
  cursor: pointer;
  transition: transform 0.12s;
  &:active { transform: scale(0.98); }
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
    background: ${({ theme }) => theme.accent2};
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
  color: ${({ theme }) => theme.text};
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Sub = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text2};
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
  background: rgba(255,255,255,0.08);
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  &:active { background: rgba(255,255,255,0.15); }
`;

const StopBtn = styled(ActionBtn)`
  background: ${({ theme }) => theme.redDim};
  color: ${({ theme }) => theme.red};
  &:active { background: rgba(239,68,68,0.25); }
`;
