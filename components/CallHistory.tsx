'use client';

import { CallSession } from '@/types/call';

interface CallHistoryProps {
  sessions: CallSession[];
  onViewSession: (session: CallSession) => void;
}

export default function CallHistory({ sessions, onViewSession }: CallHistoryProps) {
  const completedSessions = sessions.filter(
    (s) => s.status === 'completed' || s.status === 'transferred'
  );

  if (completedSessions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Call History</h2>
        <p className="text-gray-600 text-center py-8">No completed calls yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Call History</h2>
      <div className="space-y-4">
        {completedSessions.map((session) => {
          const duration = session.startTime && session.endTime
            ? Math.floor(
                (new Date(session.endTime).getTime() -
                  new Date(session.startTime).getTime()) /
                  1000
              )
            : 0;

          return (
            <div
              key={session.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onViewSession(session)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {session.config.phoneNumber}
                  </h3>
                  <p className="text-sm text-gray-600">{session.config.purpose}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    session.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {session.status}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  {session.startTime
                    ? new Date(session.startTime).toLocaleString()
                    : 'N/A'}
                </span>
                <span>
                  Duration: {Math.floor(duration / 60)}m {duration % 60}s
                </span>
              </div>

              {session.transcripts.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  {session.transcripts.length} exchanges
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
