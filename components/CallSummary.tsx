'use client';

import { CallSession } from '@/types/call';

interface CallSummaryProps {
  session: CallSession;
  onClose: () => void;
}

export default function CallSummary({ session, onClose }: CallSummaryProps) {
  const duration =
    session.startTime && session.endTime
      ? Math.floor(
          (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) /
            1000
        )
      : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Call Summary</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">Phone Number</p>
            <p className="text-lg font-semibold text-gray-900">
              {session.config.phoneNumber}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">Duration</p>
            <p className="text-lg font-semibold text-gray-900">
              {Math.floor(duration / 60)}m {duration % 60}s
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">Status</p>
            <p className="text-lg font-semibold text-gray-900 capitalize">
              {session.status}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">Exchanges</p>
            <p className="text-lg font-semibold text-gray-900">
              {session.transcripts.length}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Purpose</h3>
          <p className="text-gray-700">{session.config.purpose}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Talking Points</h3>
          <ul className="list-disc list-inside space-y-1">
            {session.config.talkingPoints.map((point, index) => (
              <li key={index} className="text-gray-700">
                {point}
              </li>
            ))}
          </ul>
        </div>

        {session.summary && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Summary</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {session.summary}
              </pre>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Full Transcript</h3>
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto space-y-3">
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
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium"
      >
        Close
      </button>
    </div>
  );
}
