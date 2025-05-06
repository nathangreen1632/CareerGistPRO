import React from 'react';
import SessionModal from './SessionModal';
import { useSession } from '../context/SessionContext';

const SessionModalWrapper: React.FC = () => {
  const {
    showModal,
    countdown,
    handleExtend,
    handleLogout,
  } = useSession();

  return (
    <SessionModal
      showModal={showModal}
      countdown={countdown}
      handleExtend={handleExtend}
      handleLogout={handleLogout}
    />
  );
};

export default SessionModalWrapper;
