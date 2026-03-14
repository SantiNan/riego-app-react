// ═══════════════════════════════════════════════════
//  lib/types.ts  —  equivalente a types.h del firmware
// ═══════════════════════════════════════════════════

export type IrrigationMode = 'idle' | 'program' | 'manual' | 'paused';

/** Espejo del struct Program del firmware (8 bytes en EEPROM) */
export interface Program {
  id:      number;       // slot 0-31
  enabled: boolean;
  days:    number;       // bitmask: bit N = día N (0=dom)
  start:   string;       // "HH:MM"
  zones:   [number, number, number, number]; // minutos por zona
}

/** Espejo del topic riego/status */
export interface EspStatus {
  online:       boolean;
  pump:         boolean;
  programCount: number;
  mode:         IrrigationMode;
  program?:     number;  // solo en mode program/paused
  zone?:        number;  // solo en mode program/manual/paused (1-based)
  remaining?:   number;  // solo en mode program/paused (no en manual)
  timestamp:    number;  // unix UTC
}

/** Payload del topic riego/ack */
export interface AckMessage {
  cmd:     'program' | 'manual' | 'pause';
  action:  string;
  id:      number;
  ok:      boolean;
  error?:  string;
}

/** Nombres de las 4 zonas, indexados por posición (0-3) */
export const ZONE_NAMES: readonly [string, string, string, string] = [
  'Fondo', // o 'Zona 1'
  'Centro',// o 'Zona 2'
  'Frente',// o 'Zona 3'
  'Vereda',// o 'Zona 4'
];

/** Datos del formulario de programa (antes de enviar al ESP) */
export interface ProgramFormData {
  id:      number;   // -1 si es nuevo
  enabled: boolean;
  start:   string;
  days:    number[]; // array de índices antes de encodear a bitmask
  zones:   [number, number, number, number];
}
