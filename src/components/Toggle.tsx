import styled from 'styled-components';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  zoneColor?: string;
  zoneDim?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export function Toggle({ checked, onChange, zoneColor, zoneDim, disabled, onClick }: ToggleProps) {
  return (
    <Label $disabled={disabled} onClick={onClick}>
      <Input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={e => onChange(e.target.checked)}
      />
      <Slider $checked={checked} $color={zoneColor} $dim={zoneDim} />
    </Label>
  );
}

const Label = styled.label<{ $disabled?: boolean }>`
  position: relative;
  display: inline-block;
  width: 52px;
  height: 30px;
  flex-shrink: 0;
  pointer-events: ${({ $disabled }) => $disabled ? 'none' : 'auto'};
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  transition: opacity 0.15s;
`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`;

const Slider = styled.span<{ $checked: boolean; $color?: string; $dim?: string }>`
  position: absolute;
  inset: 0;
  border-radius: 30px;
  background: ${({ $checked, $dim, theme }) =>
    $checked ? ($dim ?? theme.greenDim) : theme.bg3};
  border: 1px solid ${({ $checked, theme }) =>
    $checked ? 'transparent' : theme.border2};
  transition: background 0.2s, border-color 0.2s;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    width: 24px;
    height: 24px;
    left: 3px;
    top: 3px;
    border-radius: 50%;
    background: ${({ $checked, $color, theme }) =>
      $checked ? ($color ?? theme.green) : theme.text3};
    box-shadow: ${({ $checked, $color, theme }) =>
      $checked ? `0 0 8px ${$color ?? theme.green}` : 'none'};
    transform: ${({ $checked }) => $checked ? 'translateX(22px)' : 'translateX(0)'};
    transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
  }
`;
