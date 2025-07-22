import { useState, useEffect, useCallback } from 'react';
import { TimerStatus } from '../types';

export function useTimer() {
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState<TimerStatus>('stopped');
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === 'running') {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status]);

  const start = useCallback(() => {
    if (status === 'stopped') {
      setStartTime(Date.now());
      setSeconds(0);
    }
    setStatus('running');
  }, [status]);

  const pause = useCallback(() => {
    setStatus('paused');
  }, []);

  const stop = useCallback(() => {
    const endTime = Date.now();
    const result = {
      startTime,
      endTime,
      duration: seconds,
      wasRunning: status !== 'stopped'
    };
    
    setStatus('stopped');
    setSeconds(0);
    setStartTime(null);
    
    return result;
  }, [startTime, seconds, status]);

  const reset = useCallback(() => {
    setStatus('stopped');
    setSeconds(0);
    setStartTime(null);
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