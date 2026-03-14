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
  status:    EspStatus | null;
  programs:  Program[];
  lastAck:   AckMessage | null;
  publish:   (topic: string, payload: object) => void;
}

// ── Context ──────────────────────────────────────────

const MQTTContext = createContext<MQTTContextValue | null>(null);

// ── Provider ─────────────────────────────────────────

export function MQTTProvider({ children }: { children: ReactNode }) {
  const clientRef               = useRef<MqttClient | null>(null);
  const [connected, setConnected] = useState(false);
  const [status,    setStatus]    = useState<EspStatus | null>(null);
  const [programs,  setPrograms]  = useState<Program[]>([]);
  const [lastAck,   setLastAck]   = useState<AckMessage | null>(null);

  const publish = useCallback((topic: string, payload: object) => {
    clientRef.current?.publish(topic, JSON.stringify(payload));
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
        if (topic === TOPICS.status)   setStatus(msg as EspStatus);
        if (topic === TOPICS.programs) setPrograms((msg as { programs: Program[] }).programs ?? []);
        if (topic === TOPICS.ack)      setLastAck(msg as AckMessage);
      } catch { /* ignore malformed */ }
    });

    return () => { client.end(); };
  }, []);

  // Watchdog offline: si el timestamp del status es muy viejo → desconectado
  useEffect(() => {
    if (!status) return;
    const check = setInterval(() => {
      const age = Math.floor(Date.now() / 1000) - status.timestamp;
      if (age > OFFLINE_TIMEOUT_S) setConnected(false);
    }, 15_000);
    return () => clearInterval(check);
  }, [status]);

  return (
    <MQTTContext.Provider value={{ connected, status, programs, lastAck, publish }}>
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
