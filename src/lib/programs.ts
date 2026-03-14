// ═══════════════════════════════════════════════════
//  lib/programs.ts  —  equivalente a storage.h del firmware
//  Utilidades puras: sin side effects, sin DOM, sin MQTT.
// ═══════════════════════════════════════════════════

import { DAY_FULL, MAX_PROGRAMS } from '../config/mqtt';
import type { Program } from './types';

export function encodeDays(daysArray: number[]): number {
  return daysArray.reduce((acc, d) => acc | (1 << d), 0);
}

export function decodeDays(bitmask: number): number[] {
  return Array.from({ length: 7 }, (_, i) => i).filter(i => bitmask & (1 << i));
}

export function formatDays(bitmask: number): string {
  if (bitmask === 0)   return 'Nunca';
  if (bitmask === 127) return 'Todos los días';
  if (bitmask === 65)  return 'Fines de semana';
  if (bitmask === 62)  return 'Lun – Vie';
  const order = [1, 2, 3, 4, 5, 6, 0];
  const active = decodeDays(bitmask);
  return order.filter(d => active.includes(d)).map(d => DAY_FULL[d]).join(', ');
}

export function findFreeSlot(programs: Program[]): number {
  const used = new Set(programs.map(p => p.id));
  for (let i = 0; i < MAX_PROGRAMS; i++) {
    if (!used.has(i)) return i;
  }
  return -1;
}

export function validateProgram(days: number[], zones: number[]): string | null {
  if (days.length === 0)       return 'Seleccioná al menos un día';
  if (zones.every(z => z === 0)) return 'Configurá al menos una zona';
  return null;
}

export function sortByTime(programs: Program[]): Program[] {
  return [...programs].sort((a, b) => a.start.localeCompare(b.start));
}
