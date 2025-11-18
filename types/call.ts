export interface CallConfig {
  id: string;
  phoneNumber: string;
  purpose: string;
  talkingPoints: string[];
  script?: string;
  handoffConditions: {
    requestForHuman: boolean;
    silenceThreshold: number; // in seconds
    unanticipatedQuestions: boolean;
  };
  recordingConsent: boolean;
}

export interface CallTranscript {
  id: string;
  callId: string;
  timestamp: string;
  speaker: 'AI' | 'Caller';
  message: string;
}

export interface CallSession {
  id: string;
  config: CallConfig;
  status: 'pending' | 'active' | 'completed' | 'transferred' | 'failed';
  startTime?: string;
  endTime?: string;
  transcripts: CallTranscript[];
  summary?: string;
  clarificationAttempts: number;
}

export interface CallSummary {
  callId: string;
  duration: number;
  outcome: string;
  keyPoints: string[];
  transferReason?: string;
  transcript: CallTranscript[];
}
