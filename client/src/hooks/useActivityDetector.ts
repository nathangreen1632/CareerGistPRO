import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from './useAuth';

interface UseActivityDetectorOptions {
  onExtendSession: () => void;
  onLogout: () => void;
  showModal: () => void;
  hideModal: () => void;
  inactiveLimit?: number;
  countdownLimit?: number;
  onCountdownStart?: () => void;
}

const ACTIVITY_EVENTS: (keyof DocumentEventMap)[] = [
  "keydown",
  "mousedown",
  "scroll",
  "click",
  "touchstart"
];

const INACTIVITY_LIMIT = 15 * 60 * 1000;
const COUNTDOWN_LIMIT = 2 * 60 * 1000;

export const useActivityDetector = ({
                                      onExtendSession,
                                      onLogout,
                                      showModal,
                                      hideModal,
                                      inactiveLimit = INACTIVITY_LIMIT,
                                      countdownLimit = COUNTDOWN_LIMIT,
                                      onCountdownStart,
                                    }: UseActivityDetectorOptions) => {
  const { token } = useAuth();
  const [countdownVisible, setCountdownVisible] = useState(false);

  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);
  const countdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const refreshTimeout = useRef<NodeJS.Timeout | null>(null);
  const previousTokenRef = useRef<string | null>(null);
  const logoutRef = useRef(false);

  const resetTimers = useCallback(() => {
    if (!token) return;

    logoutRef.current = false;

    if (token === previousTokenRef.current) return;
    previousTokenRef.current = token;

    if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
    if (countdownTimeout.current) clearTimeout(countdownTimeout.current);
    if (refreshTimeout.current) clearTimeout(refreshTimeout.current);

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expTime = payload.exp * 1000;
      const now = Date.now();
      const refreshAt = expTime - now - 15 * 60 * 1000;

      if (refreshAt <= 0) {
        onExtendSession();
      } else {
        refreshTimeout.current = setTimeout(() => {
          onExtendSession();
        }, refreshAt);
      }

      inactivityTimeout.current = setTimeout(() => {
        setCountdownVisible(true);
        showModal();
        onCountdownStart?.();

        countdownTimeout.current = setTimeout(() => {
          logoutRef.current = true;
          onLogout();
        }, countdownLimit);
      }, inactiveLimit);
    } catch (err) {
      console.error('🚫 Failed to parse token payload:', err);
      onLogout();
    }
  }, [token, onExtendSession, onLogout, showModal, countdownLimit, inactiveLimit, onCountdownStart]);

  useEffect(() => {
    if (!token) {
      return;
    }

    resetTimers();

    const handleActivity = (event: Event) => {
      if (logoutRef.current) {
        return;
      }

      const target = event.target as HTMLElement;

      if (countdownVisible) {
        if (
          target.tagName === 'BUTTON' &&
          target.closest('.session-modal') &&
          (target).dataset.action === 'extend'
        ) {
          setCountdownVisible(false);
          hideModal();
          onExtendSession();
          resetTimers();
        }

        return;
      }

      resetTimers();
    };


    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, handleActivity));

    return () => {
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, handleActivity));
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
      if (countdownTimeout.current) clearTimeout(countdownTimeout.current);
      if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
    };
  }, [resetTimers, token, countdownVisible, hideModal, onExtendSession]);
};
