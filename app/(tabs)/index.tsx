import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WakingHoursScreen from './WakingHoursScreen';
import MoodLoggingScreen from './MoodLogging';

export default function Index() {
  const [initialScreen, setInitialScreen] = useState<'loading' | 'waking' | 'mood'>('loading');

  useEffect(() => {
    const checkWakingHours = async () => {
      const wakeUp = await AsyncStorage.getItem('wakeUpTime');
      const bed = await AsyncStorage.getItem('bedTime');
      if (wakeUp && bed) {
        setInitialScreen('mood');
      } else {
        setInitialScreen('waking');
      }
    };
    checkWakingHours();
  }, []);

  if (initialScreen === 'loading') return null;

  return initialScreen === 'waking' ? <WakingHoursScreen /> : <MoodLoggingScreen />;
}
