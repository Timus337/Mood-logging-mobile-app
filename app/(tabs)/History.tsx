import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

type MoodEntry = {
  mood: string;
  activity: string;
  people: string;
  note: string;
  timestamp: string;
};

export default function HistoryScreen() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  const loadEntries = async () => {
    try {
      const data = await AsyncStorage.getItem('moodEntries');
      if (data) {
        const parsed: MoodEntry[] = JSON.parse(data);
        const sorted = parsed.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setEntries(sorted);
      } else {
        setEntries([]);
      }
    } catch (err) {
      console.error('Failed to load mood history:', err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadEntries();
    }, [])
  );

  const renderItem = ({ item }: { item: MoodEntry }) => (
    <View style={styles.entry}>
      <Text style={styles.mood}>{item.mood} — {item.activity}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
      {item.people ? <Text style={styles.subText}>With: {item.people}</Text> : null}
      {item.note ? <Text style={styles.subText}>Note: {item.note}</Text> : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.header}>Mood History</Text>
      {entries.length === 0 ? (
        <Text style={styles.emptyText}>No mood entries yet.</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  entry: {
    backgroundColor: '#f1f2f6',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  mood: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 13,
    color: '#777',
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: '#444',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#777',
  },
});
