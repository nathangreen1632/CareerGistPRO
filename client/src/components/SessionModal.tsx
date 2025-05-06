import React from 'react';

interface SessionModalProps {
  showModal: boolean;
  countdown: number;
  handleExtend: () => void;
  handleLogout: () => void;
}

const SessionModal: React.FC<SessionModalProps> = ({
                                                     showModal,
                                                     countdown,
                                                     handleExtend,
                                                     handleLogout,
                                                   }) => {
  const locked = countdown <= 2;

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
    <div className="session-modal bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Session Expiring</h2>
        <p className="mb-6 text-lg">
          You’ve been inactive. Your session will expire in <span className="font-semibold">
            {String(Math.floor(countdown / 60)).padStart(1, '0')}:{String(countdown % 60).padStart(2, '0')}
          </span>
        </p>
        <div className="flex justify-center space-x-4">
          <button
            data-action="extend"
            onClick={handleExtend}
            disabled={locked}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-2xl disabled:opacity-50"
          >
            Keep me logged in
          </button>
          <button
            data-action="logout"
            onClick={handleLogout}
            disabled={locked}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-2xl disabled:opacity-50"
          >
            Log me out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionModal;
