import { useCallback, useEffect, useRef, useState } from 'react';
import { useActivityDetector } from './useActivityDetector';
import { useAuth } from './useAuth';

const INACTIVITY_LIMIT = 15 * 60 * 1000;
const COUNTDOWN_LIMIT = 2 * 60 * 1000;

export const useSessionManager = () => {
  const { logout, login } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_LIMIT / 1000);
  const logoutRef = useRef(false);

  const refreshToken = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
        },
      });

      const data = await res.json();
      if (data.token) {
        login(data.token);
      } else {
        logout();
      }
    } catch (err) {
      console.error('❌ Failed to refresh token:', err);
      logout();
    }
  }, [login, logout]);

  const handleExtend = useCallback(() => {
    logoutRef.current = false;
    void refreshToken();
    setShowModal(false);
    setCountdown(COUNTDOWN_LIMIT / 1000);
  }, [refreshToken]);

  const handleLogout = useCallback(() => {
    if (!logoutRef.current) {
      logoutRef.current = true;
      logout();
      setShowModal(false);
      setCountdown(COUNTDOWN_LIMIT / 1000);
      window.location.href = '/';
    }
  }, [logout]);

  const showModalFn = useCallback(() => {
    logoutRef.current = false;
    setShowModal(true);
  }, []);

  const hideModalFn = useCallback(() => {
    setShowModal(false);
  }, []);

  const onCountdownStart = useCallback(() => {
    setCountdown(COUNTDOWN_LIMIT / 1000);
  }, []);

  useActivityDetector({
    inactiveLimit: INACTIVITY_LIMIT,
    countdownLimit: COUNTDOWN_LIMIT,
    onLogout: handleLogout,
    onExtendSession: handleExtend,
    showModal: showModalFn,
    hideModal: hideModalFn,
    onCountdownStart,
  });

  useEffect(() => {
    if (!showModal) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(handleLogout, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showModal, handleLogout]);

  return {
    showModal,
    countdown,
    handleExtend,
    handleLogout,
  };
};
