import { create } from 'zustand';
import { CallSession, CallConfig } from '@/types/call';

interface CallStore {
  sessions: CallSession[];
  activeSession: CallSession | null;
  createSession: (config: CallConfig) => CallSession;
  updateSession: (id: string, updates: Partial<CallSession>) => void;
  setActiveSession: (session: CallSession | null) => void;
  addTranscript: (sessionId: string, speaker: 'AI' | 'Caller', message: string) => void;
}

export const useCallStore = create<CallStore>((set, get) => ({
  sessions: [],
  activeSession: null,

  createSession: (config: CallConfig) => {
    const newSession: CallSession = {
      id: `session_${Date.now()}`,
      config,
      status: 'pending',
      transcripts: [],
      clarificationAttempts: 0,
    };
    set((state) => ({ sessions: [...state.sessions, newSession] }));
    return newSession;
  },

  updateSession: (id: string, updates: Partial<CallSession>) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === id ? { ...session, ...updates } : session
      ),
      activeSession:
        state.activeSession?.id === id
          ? { ...state.activeSession, ...updates }
          : state.activeSession,
    }));
  },

  setActiveSession: (session: CallSession | null) => {
    set({ activeSession: session });
  },

  addTranscript: (sessionId: string, speaker: 'AI' | 'Caller', message: string) => {
    const transcript = {
      id: `transcript_${Date.now()}`,
      callId: sessionId,
      timestamp: new Date().toISOString(),
      speaker,
      message,
    };

    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, transcripts: [...session.transcripts, transcript] }
          : session
      ),
      activeSession:
        state.activeSession?.id === sessionId
          ? {
              ...state.activeSession,
              transcripts: [...state.activeSession.transcripts, transcript],
            }
          : state.activeSession,
    }));
  },
}));
