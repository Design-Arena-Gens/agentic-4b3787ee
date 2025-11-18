'use client';

import { useState, useEffect, useRef } from 'react';
import { CallSession } from '@/types/call';
import { AIEngine } from '@/lib/ai-engine';
import { useCallStore } from '@/lib/store';

interface CallInterfaceProps {
  session: CallSession;
  onEnd: () => void;
}

export default function CallInterface({ session, onEnd }: CallInterfaceProps) {
  const [isActive, setIsActive] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [silenceTimer, setSilenceTimer] = useState(0);
  const { updateSession, addTranscript } = useCallStore();
  const aiEngineRef = useRef<AIEngine | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    aiEngineRef.current = new AIEngine(session.config);
  }, [session.config]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.transcripts]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && userInput.trim() === '') {
      interval = setInterval(() => {
        setSilenceTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setSilenceTimer(0);
    }

    return () => clearInterval(interval);
  }, [isActive, userInput]);

  useEffect(() => {
    if (silenceTimer >= session.config.handoffConditions.silenceThreshold) {
      handleTransfer('Silence threshold exceeded');
    }
  }, [silenceTimer]);

  const startCall = () => {
    setIsActive(true);
    updateSession(session.id, {
      status: 'active',
      startTime: new Date().toISOString(),
    });

    const opening = aiEngineRef.current?.generateOpeningStatement() || '';
    addTranscript(session.id, 'AI', opening);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || !aiEngineRef.current) return;

    setIsProcessing(true);
    addTranscript(session.id, 'Caller', userInput);

    const response = await aiEngineRef.current.generateResponse(
      userInput,
      session.transcripts
    );

    addTranscript(session.id, 'AI', response.response);

    if (response.shouldTransfer) {
      handleTransfer(response.reason || 'Unknown reason');
    }

    setUserInput('');
    setIsProcessing(false);
  };

  const handleTransfer = (reason: string) => {
    updateSession(session.id, {
      status: 'transferred',
      endTime: new Date().toISOString(),
    });
    addTranscript(
      session.id,
      'AI',
      `Call transferred to Manohar. Reason: ${reason}`
    );
    setIsActive(false);
  };

  const handleEndCall = () => {
    const startTime = new Date(session.startTime || Date.now());
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    const summary =
      aiEngineRef.current?.generateSummary(session.transcripts, duration) || '';

    updateSession(session.id, {
      status: 'completed',
      endTime: endTime.toISOString(),
      summary,
    });

    setIsActive(false);
    onEnd();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Call in Progress</h2>
          <div className="flex items-center space-x-4">
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                session.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : session.status === 'transferred'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {session.status.toUpperCase()}
            </div>
            {silenceTimer > 0 && (
              <div className="text-sm text-gray-600">
                Silence: {silenceTimer}s / {session.config.handoffConditions.silenceThreshold}s
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm font-medium text-gray-700">
            Calling: {session.config.phoneNumber}
          </p>
          <p className="text-sm text-gray-600">Purpose: {session.config.purpose}</p>
          <p className="text-sm text-gray-600">
            Clarification attempts: {session.clarificationAttempts} / 2
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Transcript</h3>
        <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto space-y-3">
          {session.transcripts.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              {isActive ? 'Call started...' : 'Click "Start Call" to begin'}
            </p>
          )}
          {session.transcripts.map((transcript) => (
            <div
              key={transcript.id}
              className={`p-3 rounded-lg ${
                transcript.speaker === 'AI'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-green-100 text-green-900'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-sm">{transcript.speaker}</span>
                <span className="text-xs opacity-70">
                  {new Date(transcript.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm">{transcript.message}</p>
            </div>
          ))}
          <div ref={transcriptEndRef} />
        </div>
      </div>

      {!isActive && session.status === 'pending' && (
        <button
          onClick={startCall}
          className="w-full bg-secondary text-white py-3 px-4 rounded-md hover:bg-green-600 transition-colors font-medium"
        >
          Start Call
        </button>
      )}

      {isActive && (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Simulate caller's response..."
              disabled={isProcessing}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2 border"
            />
            <button
              onClick={handleSendMessage}
              disabled={isProcessing || !userInput.trim()}
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handleTransfer('Manual transfer requested')}
              className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors font-medium"
            >
              Transfer to Manohar
            </button>
            <button
              onClick={handleEndCall}
              className="flex-1 bg-danger text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors font-medium"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {!isActive && (session.status === 'completed' || session.status === 'transferred') && (
        <button
          onClick={onEnd}
          className="w-full bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors font-medium"
        >
          Back to Dashboard
        </button>
      )}
    </div>
  );
}
