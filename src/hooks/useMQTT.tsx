// ═══════════════════════════════════════════════════
//  hooks/useMQTT.ts
//  Gestiona la conexión MQTT y expone estado + publish
//  via React Context para que cualquier componente pueda
//  suscribirse sin prop-drilling.
// ═══════════════════════════════════════════════════

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import mqtt, { type MqttClient } from 'mqtt';
import { MQTT_CONFIG, TOPICS, OFFLINE_TIMEOUT_S } from '../config/mqtt';
import type { EspStatus, Program, AckMessage } from '../lib/types';

// ── Tipos del contexto ───────────────────────────────

interface MQTTContextValue {
  connected: boolean;
  synced:    boolean;
  status:    EspStatus | null;
  programs:  Program[];
  lastAck:   AckMessage | null;
  publish:   (topic: string, payload: object) => void;
  optimisticStatus:  (patch: Partial<EspStatus>) => void;
  optimisticProgram: (id: number, patch: Partial<Program>) => void;
}

// ── Context ──────────────────────────────────────────

const MQTTContext = createContext<MQTTContextValue | null>(null);

// ── Provider ─────────────────────────────────────────

export function MQTTProvider({ children }: { children: ReactNode }) {
  const clientRef               = useRef<MqttClient | null>(null);
  const [connected, setConnected] = useState(false);
  const [realStatus,    setRealStatus]    = useState<EspStatus | null>(null);
  const [realPrograms,  setRealPrograms]  = useState<Program[]>([]);
  const [synced,    setSynced]    = useState(false);
  const [lastAck,   setLastAck]   = useState<AckMessage | null>(null);

  // Optimistic overlays — se superponen al estado real sin bloquearlo
  const [statusPatch, setStatusPatch]   = useState<Partial<EspStatus> | null>(null);
  const [progPatches, setProgPatches]   = useState<Record<number, Partial<Program>>>({});
  const statusPatchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const progPatchTimer   = useRef<ReturnType<typeof setTimeout>>(undefined);
  const OPTIMISTIC_TIMEOUT = 2000;

  // Estado expuesto: real + overlay
  const status   = realStatus && statusPatch ? { ...realStatus, ...statusPatch } : realStatus;
  const programs = realPrograms.map(p => progPatches[p.id] ? { ...p, ...progPatches[p.id] } : p);

  const publish = useCallback((topic: string, payload: object) => {
    clientRef.current?.publish(topic, JSON.stringify(payload));
  }, []);

  const optimisticStatus = useCallback((patch: Partial<EspStatus>) => {
    setStatusPatch(patch);
    clearTimeout(statusPatchTimer.current);
    statusPatchTimer.current = setTimeout(() => setStatusPatch(null), OPTIMISTIC_TIMEOUT);
  }, []);

  const optimisticProgram = useCallback((id: number, patch: Partial<Program>) => {
    setProgPatches(prev => ({ ...prev, [id]: patch }));
    clearTimeout(progPatchTimer.current);
    progPatchTimer.current = setTimeout(() => setProgPatches({}), OPTIMISTIC_TIMEOUT);
  }, []);

  useEffect(() => {
    const url = `wss://${MQTT_CONFIG.host}:${MQTT_CONFIG.port}/mqtt`;
    const client = mqtt.connect(url, {
      username:        MQTT_CONFIG.username,
      password:        MQTT_CONFIG.password,
      clientId:        MQTT_CONFIG.clientId,
      clean:           true,
      reconnectPeriod: 3000,
      connectTimeout:  10000,
    });
    clientRef.current = client;

    client.on('connect', () => {
      setConnected(true);
      client.subscribe([TOPICS.status, TOPICS.programs, TOPICS.ack]);
      client.publish(TOPICS.cmdSync, '{}');
    });

    client.on('reconnect', () => setConnected(false));
    client.on('offline',   () => setConnected(false));
    client.on('error',     () => setConnected(false));

    client.on('message', (topic, payload) => {
      try {
        const msg = JSON.parse(payload.toString());
        if (topic === TOPICS.status) {
          const incoming = msg as EspStatus;
          setRealStatus(incoming);
          // Limpiar overlay solo si el estado real ya refleja lo esperado
          setStatusPatch(prev => {
            if (!prev) return null;
            const matches = Object.keys(prev).every(
              k => incoming[k as keyof EspStatus] === prev[k as keyof EspStatus]
            );
            return matches ? null : prev;
          });
        }
        if (topic === TOPICS.programs) {
          const incoming = (msg as { programs: Program[] }).programs ?? [];
          setRealPrograms(incoming);
          // Limpiar overlays de programas confirmados
          setProgPatches(prev => {
            const next: Record<number, Partial<Program>> = {};
            for (const [id, patch] of Object.entries(prev)) {
              const real = incoming.find(p => p.id === Number(id));
              if (!real) continue;
              const matches = Object.keys(patch).every(
                k => real[k as keyof Program] === patch[k as keyof Program]
              );
              if (!matches) next[Number(id)] = patch;
            }
            return Object.keys(next).length ? next : {};
          });
          setSynced(true);
        }
        if (topic === TOPICS.ack) setLastAck(msg as AckMessage);
      } catch { /* ignore malformed */ }
    });

    return () => { client.end(); };
  }, []);

  // Watchdog offline: si el timestamp del status es muy viejo → desconectado
  useEffect(() => {
    if (!realStatus) return;
    const check = setInterval(() => {
      const age = Math.floor(Date.now() / 1000) - realStatus.timestamp;
      if (age > OFFLINE_TIMEOUT_S) setConnected(false);
    }, 15_000);
    return () => clearInterval(check);
  }, [realStatus]);

  return (
    <MQTTContext.Provider value={{ connected, synced, status, programs, lastAck, publish, optimisticStatus, optimisticProgram }}>
      {children}
    </MQTTContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────

export function useMQTT(): MQTTContextValue {
  const ctx = useContext(MQTTContext);
  if (!ctx) throw new Error('useMQTT must be used inside MQTTProvider');
  return ctx;
}
