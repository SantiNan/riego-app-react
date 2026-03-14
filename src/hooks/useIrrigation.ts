// ═══════════════════════════════════════════════════
//  hooks/useIrrigation.ts  —  equivalente a irrigation.h
//  Encapsula todos los comandos de riego.
//  Consume useMQTT internamente.
// ═══════════════════════════════════════════════════

import { TOPICS } from '../config/mqtt';
import { useMQTT } from './useMQTT';
import type { Program } from '../lib/types';

export function useIrrigation() {
  const { publish, connected, status, optimisticStatus, optimisticProgram } = useMQTT();

  // ── Manual ─────────────────────────────────────────

  /** Inicia riego manual sin límite de tiempo. */
  function startManual(zone: number) {
    if (!connected) return;
    optimisticStatus({ mode: 'manual', zone, pump: true });
    publish(TOPICS.cmdManual, { action: 'on', zone });
  }

  /** Detiene el riego manual en curso. */
  function stopManual() {
    if (!connected) return;
    optimisticStatus({ mode: 'idle', zone: undefined, pump: false });
    publish(TOPICS.cmdManual, { action: 'off' });
  }

  /** Detiene el riego programado en curso. */
  function cancelProgram() {
    if (!connected) return;
    optimisticStatus({ mode: 'idle', zone: undefined, program: undefined, remaining: undefined, pump: false });
    publish(TOPICS.cmdProgram, { action: 'stop' });
  }

  // ── Pausa ───────────────────────────────────────────

  function pauseProgram() {
    if (!connected) return;
    optimisticStatus({ mode: 'paused' });
    publish(TOPICS.cmdPause, { action: 'pause' });
  }

  function resumeProgram() {
    if (!connected) return;
    optimisticStatus({ mode: 'program' });
    publish(TOPICS.cmdPause, { action: 'resume' });
  }

  /** Alterna pausa/resume según el estado actual. */
  function togglePause() {
    if (status?.mode === 'program') pauseProgram();
    if (status?.mode === 'paused')  resumeProgram();
  }

  // ── Programas ───────────────────────────────────────

  function setProgram(prog: Omit<Program, 'days'> & { days: number[] }) {
    if (!connected) return;
    publish(TOPICS.cmdProgram, {
      action:  'set',
      id:      prog.id,
      enabled: prog.enabled,
      start:   prog.start,
      days:    prog.days,          // array — el ESP acepta array o bitmask
      zones:   prog.zones,
    });
  }

  function deleteProgram(id: number) {
    if (!connected) return;
    publish(TOPICS.cmdProgram, { action: 'delete', id });
  }

  function requestSync() {
    if (!connected) return;
    publish(TOPICS.cmdSync, {});
  }

  return {
    startManual,
    stopManual,
    cancelProgram,
    togglePause,
    pauseProgram,
    resumeProgram,
    setProgram,
    deleteProgram,
    requestSync,
  };
}
