'use client';

import { useState } from 'react';
import { useCallStore } from '@/lib/store';
import { CallConfig, CallSession } from '@/types/call';
import CallConfigForm from '@/components/CallConfigForm';
import CallInterface from '@/components/CallInterface';
import CallHistory from '@/components/CallHistory';
import CallSummary from '@/components/CallSummary';

type View = 'dashboard' | 'config' | 'active-call' | 'summary';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedSession, setSelectedSession] = useState<CallSession | null>(null);
  const { sessions, createSession, setActiveSession } = useCallStore();

  const handleConfigSubmit = (config: CallConfig) => {
    const newSession = createSession(config);
    setSelectedSession(newSession);
    setActiveSession(newSession);
    setCurrentView('active-call');
  };

  const handleCallEnd = () => {
    setActiveSession(null);
    setCurrentView('dashboard');
  };

  const handleViewSession = (session: CallSession) => {
    setSelectedSession(session);
    setCurrentView('summary');
  };

  const handleCloseSummary = () => {
    setSelectedSession(null);
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">NovaCall</h1>
          <p className="text-lg text-gray-600">
            AI-Powered Real-Time Phone Assistant for Manohar Kumar Sah
          </p>
        </header>

        {currentView === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
              <p className="text-gray-600 mb-6">
                Configure and manage your AI-assisted outbound calls
              </p>
              <button
                onClick={() => setCurrentView('config')}
                className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium"
              >
                New Call
              </button>
            </div>

            <CallHistory sessions={sessions} onViewSession={handleViewSession} />

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About NovaCall</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>NovaCall</strong> is your intelligent phone assistant that handles
                  outbound calls with professionalism and efficiency.
                </p>
                <div>
                  <p className="font-semibold mb-2">Key Features:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Clear communication of call purpose</li>
                    <li>Natural, conversational responses based on talking points</li>
                    <li>Real-time speech understanding and reaction</li>
                    <li>Intelligent handoff to human when needed</li>
                    <li>Automatic call summaries and transcripts</li>
                    <li>Transparent recording disclosure</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Handoff Conditions:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Caller requests to speak with Manohar</li>
                    <li>Silence exceeds configured threshold</li>
                    <li>Question outside prepared context (after 2 clarifications)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'config' && (
          <div>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="mb-4 text-gray-600 hover:text-gray-900 flex items-center"
            >
              ← Back to Dashboard
            </button>
            <CallConfigForm onSubmit={handleConfigSubmit} />
          </div>
        )}

        {currentView === 'active-call' && selectedSession && (
          <CallInterface session={selectedSession} onEnd={handleCallEnd} />
        )}

        {currentView === 'summary' && selectedSession && (
          <CallSummary session={selectedSession} onClose={handleCloseSummary} />
        )}
      </div>

      <footer className="mt-12 text-center text-gray-600 text-sm">
        <p>NovaCall - Always transparent, never fabricating information</p>
        <p className="mt-1">Powered by AI, supervised by humans</p>
      </footer>
    </div>
  );
}
