import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';

export default function WakingHoursScreen() {
  const [wakeUpTime, setWakeUpTime] = useState('08:00');
  const [bedTime, setBedTime] = useState('22:00');
  const [showWakePicker, setShowWakePicker] = useState(false);
  const [showBedPicker, setShowBedPicker] = useState(false);

  const saveTimes = async () => {
    try {
      await AsyncStorage.setItem('wakeUpTime', wakeUpTime);
      await AsyncStorage.setItem('bedTime', bedTime);
      router.push('/(tabs)/MoodLogging');
    } catch (error) {
      console.error('Error saving times:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Waking Hours</Text>

      <Text style={styles.label}>Wake-up Time: {wakeUpTime}</Text>
      <Button title="Pick Wake-up Time" onPress={() => setShowWakePicker(true)} />
      {showWakePicker && (
        <DateTimePicker
          value={new Date(wakeUpTime)}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowWakePicker(false);
            if (selectedDate) setWakeUpTime(selectedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
          }}
        />
      )}

      <Text style={styles.label}>Bed Time: {bedTime}</Text>
      <Button title="Pick Bed Time" onPress={() => setShowBedPicker(true)} />
      {showBedPicker && (
        <DateTimePicker
          value={new Date(bedTime)}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowBedPicker(false);
            if (selectedDate) setBedTime(selectedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
          }}
        />
      )}

      <View style={styles.saveButton}>
        <Button title="Save and Continue" onPress={saveTimes} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginVertical: 12,
    textAlign: 'center',
  },
  saveButton: {
    marginTop: 30,
  },
});
