import styled, { keyframes } from 'styled-components';

interface Props {
  title:     string;
  body:      string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel:  () => void;
}

export function ConfirmModal({ title, body, confirmLabel = 'Confirmar', onConfirm, onCancel }: Props) {
  return (
    <Overlay>
      <Modal>
        <Title>{title}</Title>
        <Body>{body}</Body>
        <Actions>
          <CancelBtn onClick={onCancel}>Cancelar</CancelBtn>
          <ConfirmBtn onClick={onConfirm}>{confirmLabel}</ConfirmBtn>
        </Actions>
      </Modal>
    </Overlay>
  );
}

const slideUp = keyframes`
  from { transform: translateY(30px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 400;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-end;
  padding: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.surface2};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.border2};
  padding: 24px;
  width: 100%;
  animation: ${slideUp} 0.25s cubic-bezier(0.4,0,0.2,1);
`;

const Title = styled.p`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Body = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text2};
  margin-bottom: 20px;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const BaseBtn = styled.button`
  flex: 1;
  height: 48px;
  border-radius: ${({ theme }) => theme.radiusSm};
  font-size: 15px;
  font-weight: 600;
  transition: opacity 0.15s;
  &:active { opacity: 0.75; }
`;

const CancelBtn = styled(BaseBtn)`
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text2};
`;

const ConfirmBtn = styled(BaseBtn)`
  background: ${({ theme }) => theme.redDim};
  color: ${({ theme }) => theme.red};
  border: 1px solid rgba(239,68,68,0.3);
`;
