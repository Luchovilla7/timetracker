import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerStatus } from '../types';

export function useTimer() {
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState<TimerStatus>('stopped');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pausedTime, setPausedTime] = useState(0); // Accumulated paused time
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to calculate current elapsed time based on real timestamps
  const calculateElapsedTime = useCallback(() => {
    if (!startTime) return 0;
    
    const now = Date.now();
    const realElapsed = Math.floor((now - startTime) / 1000);
    return Math.max(0, realElapsed - pausedTime);
  }, [startTime, pausedTime]);

  // Update display time regularly and on visibility change
  useEffect(() => {
    const updateTime = () => {
      if (status === 'running' && startTime) {
        const elapsed = calculateElapsedTime();
        setSeconds(elapsed);
      }
    };

    // Handle visibility change to update time when tab becomes active
    const handleVisibilityChange = () => {
      if (!document.hidden && status === 'running') {
        updateTime();
      }
    };

    if (status === 'running') {
      // Update immediately
      updateTime();
      
      // Set up interval for regular updates
      intervalRef.current = setInterval(updateTime, 1000);
      
      // Listen for visibility changes
      document.addEventListener('visibilitychange', handleVisibilityChange);
    } else {
      // Clear interval when not running
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [status, startTime, calculateElapsedTime]);

  const start = useCallback(() => {
    const now = Date.now();
    
    if (status === 'stopped') {
      // Starting fresh
      setStartTime(now);
      setPausedTime(0);
      setSeconds(0);
    } else if (status === 'paused') {
      // Resuming from pause - adjust start time to account for pause duration
      const pauseDuration = Math.floor((now - (startTime || now)) / 1000) - seconds;
      setPausedTime(prev => prev + Math.max(0, pauseDuration));
    }
    
    setStatus('running');
  }, [status, startTime, seconds]);

  const pause = useCallback(() => {
    if (status === 'running') {
      // Calculate and store current elapsed time
      const elapsed = calculateElapsedTime();
      setSeconds(elapsed);
      setStatus('paused');
    }
  }, [status, calculateElapsedTime]);

  const stop = useCallback(() => {
    const endTime = Date.now();
    const finalElapsed = status !== 'stopped' ? calculateElapsedTime() : seconds;
    
    const result = {
      startTime,
      endTime,
      duration: finalElapsed,
      wasRunning: status !== 'stopped'
    };
    
    // Reset all state
    setStatus('stopped');
    setSeconds(0);
    setStartTime(null);
    setPausedTime(0);
    
    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    return result;
  }, [startTime, seconds, status, calculateElapsedTime]);

  const reset = useCallback(() => {
    setStatus('stopped');
    setSeconds(0);
    setStartTime(null);
    setPausedTime(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return {
    seconds,
    status,
    start,
    pause,
    stop,
    reset
  };
}