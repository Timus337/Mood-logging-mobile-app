import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const moods = ['😄', '😐', '😞'];
const activities = ['Work', 'Leisure', 'Exercise', 'Study', 'Social'];

export default function MoodLoggingScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [people, setPeople] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async () => {
    if (!selectedMood || !selectedActivity) {
      Alert.alert('Missing info', 'Please select a mood and an activity.');
      return;
    }

    const entry = {
      mood: selectedMood,
      activity: selectedActivity,
      people,
      note,
      timestamp: new Date().toISOString(),
    };

    try {
      const existingData = await AsyncStorage.getItem('moodEntries');
      const entries = existingData ? JSON.parse(existingData) : [];
      entries.push(entry);
      await AsyncStorage.setItem('moodEntries', JSON.stringify(entries));
    } catch (err) {
      console.error('Error saving mood entry:', err);
    }

    // Clear form
    setSelectedMood(null);
    setSelectedActivity(null);
    setPeople('');
    setNote('');

    router.push('/(tabs)/History');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.header}>How are you feeling?</Text>

          <View style={styles.moodContainer}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood}
                style={[
                  styles.moodButton,
                  selectedMood === mood && styles.moodButtonSelected,
                ]}
                onPress={() => setSelectedMood(mood)}
              >
                <Text style={styles.moodText}>{mood}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>What are you doing?</Text>
          <FlatList
            data={activities}
            horizontal
            keyExtractor={(item) => item}
            contentContainerStyle={styles.activityList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.activityButton,
                  selectedActivity === item && styles.activityButtonSelected,
                ]}
                onPress={() => setSelectedActivity(item)}
              >
                <Text style={styles.activityText}>{item}</Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />

          <Text style={styles.label}>Who are you with?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter names"
            value={people}
            onChangeText={setPeople}
          />

          <Text style={styles.label}>Anything else?</Text>
          <TextInput
            style={[styles.input, { height: 70 }]}
            placeholder="Optional notes..."
            value={note}
            onChangeText={setNote}
            multiline
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Log Mood</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#fefefe',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
    color: '#333',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 18,
    marginBottom: 6,
    color: '#444',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  moodButton: {
    padding: 12,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
  },
  moodButtonSelected: {
    backgroundColor: '#a3d2ca',
  },
  moodText: {
    fontSize: 28,
  },
  activityList: {
    gap: 8,
    paddingVertical: 6,
  },
  activityButton: {
    backgroundColor: '#e6e6e6',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginRight: 10,
  },
  activityButtonSelected: {
    backgroundColor: '#ffd6a5',
  },
  activityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fafafa',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
