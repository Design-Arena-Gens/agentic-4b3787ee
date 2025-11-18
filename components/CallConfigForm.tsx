'use client';

import { useState } from 'react';
import { CallConfig } from '@/types/call';

interface CallConfigFormProps {
  onSubmit: (config: CallConfig) => void;
}

export default function CallConfigForm({ onSubmit }: CallConfigFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [purpose, setPurpose] = useState('');
  const [talkingPoints, setTalkingPoints] = useState('');
  const [script, setScript] = useState('');
  const [silenceThreshold, setSilenceThreshold] = useState(5);
  const [recordingConsent, setRecordingConsent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const config: CallConfig = {
      id: `call_${Date.now()}`,
      phoneNumber,
      purpose,
      talkingPoints: talkingPoints.split('\n').filter((point) => point.trim() !== ''),
      script: script || undefined,
      handoffConditions: {
        requestForHuman: true,
        silenceThreshold,
        unanticipatedQuestions: true,
      },
      recordingConsent,
    };

    onSubmit(config);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Configure NovaCall</h2>
        <p className="text-gray-600 mb-6">
          Set up your AI assistant for the outbound call
        </p>
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phoneNumber"
          required
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+1234567890"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2 border"
        />
      </div>

      <div>
        <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
          Call Purpose *
        </label>
        <input
          type="text"
          id="purpose"
          required
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="e.g., Follow up on AI/ML job application"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2 border"
        />
      </div>

      <div>
        <label htmlFor="talkingPoints" className="block text-sm font-medium text-gray-700">
          Talking Points * (one per line)
        </label>
        <textarea
          id="talkingPoints"
          required
          value={talkingPoints}
          onChange={(e) => setTalkingPoints(e.target.value)}
          placeholder="Enter each talking point on a new line"
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2 border"
        />
      </div>

      <div>
        <label htmlFor="script" className="block text-sm font-medium text-gray-700">
          Optional Script
        </label>
        <textarea
          id="script"
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Optional detailed script for the AI to follow"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2 border"
        />
      </div>

      <div>
        <label htmlFor="silenceThreshold" className="block text-sm font-medium text-gray-700">
          Silence Threshold (seconds)
        </label>
        <input
          type="number"
          id="silenceThreshold"
          value={silenceThreshold}
          onChange={(e) => setSilenceThreshold(parseInt(e.target.value))}
          min={3}
          max={30}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2 border"
        />
        <p className="mt-1 text-sm text-gray-500">
          Transfer to human if caller is silent for this duration
        </p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="recordingConsent"
          checked={recordingConsent}
          onChange={(e) => setRecordingConsent(e.target.checked)}
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label htmlFor="recordingConsent" className="ml-2 block text-sm text-gray-900">
          Inform caller about recording (transparent disclosure)
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium"
      >
        Start Call
      </button>
    </form>
  );
}
