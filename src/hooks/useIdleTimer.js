import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export function useIdleTimer(timeoutMinutes = 10) {
    const { isAuthenticated, isLocked, setIsLocked } = useAuth();

    useEffect(() => {
        if (!isAuthenticated || isLocked) return;

        let timer;
        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                setIsLocked(true);
            }, timeoutMinutes * 60 * 1000);
        };

        const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll', 'wheel'];
        events.forEach(ev => window.addEventListener(ev, resetTimer, { passive: true }));
        resetTimer();

        return () => {
            clearTimeout(timer);
            events.forEach(ev => window.removeEventListener(ev, resetTimer));
        };
    }, [isAuthenticated, isLocked, setIsLocked, timeoutMinutes]);
}
