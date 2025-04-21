import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

const activities = [
  { value: 'work', label: 'Work', icon: 'briefcase.fill' },
  { value: 'leisure', label: 'Leisure', icon: 'gamecontroller.fill' },
  { value: 'exercise', label: 'Exercise', icon: 'figure.run' },
  { value: 'social', label: 'Social', icon: 'person.2.fill' },
  { value: 'eating', label: 'Eating', icon: 'fork.knife' },
  { value: 'commute', label: 'Commute', icon: 'car.fill' }
];

export default function ExploreScreen() {
  const [moodData, setMoodData] = useState<{ date: string; mood: string; activity?: string }[]>([]);
  const [selectedTab, setSelectedTab] = useState<'line' | 'bar'>('line');

  useEffect(() => {
    loadMoodData();
  }, []);

  const loadMoodData = async () => {
    try {
      const moodLogs = await AsyncStorage.getItem('moodLogs');
      if (moodLogs) {
        setMoodData(JSON.parse(moodLogs));
      }
    } catch (error) {
      console.error('Error loading mood data:', error);
    }
  };

  const getMoodValue = (mood: string) => {
    switch (mood) {
      case 'good': return 3;
      case 'ok': return 2;
      case 'bad': return 1;
      default: return 0;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'good': return '#4CAF50';
      case 'ok': return '#FFC107';
      case 'bad': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const chartData = {
    labels: moodData.map(item => {
      const date = new Date(item.date);
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }),
    datasets: [
      { 
        data: moodData.map(item => getMoodValue(item.mood)),
        color: (opacity = 1) => `rgba(63, 81, 181, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const activityData = {
    labels: ['Work', 'Leisure', 'Exercise', 'Social', 'Eating', 'Commute'],
    datasets: [
      {
        data: [
          moodData.filter(item => item.activity === 'work').length,
          moodData.filter(item => item.activity === 'leisure').length,
          moodData.filter(item => item.activity === 'exercise').length,
          moodData.filter(item => item.activity === 'social').length,
          moodData.filter(item => item.activity === 'eating').length,
          moodData.filter(item => item.activity === 'commute').length,
        ]
      }
    ]
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedText type="title" style={styles.title}>Mood Insights</ThemedText>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'line' && styles.activeTab]}
            onPress={() => setSelectedTab('line')}
          >
            <ThemedText style={[styles.tabText, selectedTab === 'line' && styles.activeTabText]}>
              Mood Trend
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'bar' && styles.activeTab]}
            onPress={() => setSelectedTab('bar')}
          >
            <ThemedText style={[styles.tabText, selectedTab === 'bar' && styles.activeTabText]}>
              Activities
            </ThemedText>
          </TouchableOpacity>
        </View>

        {moodData.length > 0 ? (
          <View style={styles.chartContainer}>
            {selectedTab === 'line' ? (
              <LineChart
                data={chartData}
                width={Dimensions.get('window').width - 40}
                height={260}
                yAxisInterval={1}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(63, 81, 181, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '5',
                    strokeWidth: '2',
                    stroke: '#3f51b5',
                  },
                }}
                bezier
                style={styles.chart}
              />
            ) : (
              <BarChart
                data={activityData}
                width={Dimensions.get('window').width - 40}
                height={260}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(63, 81, 181, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                style={styles.chart}
              />
            )}
          </View>
        ) : (
          <ThemedView style={styles.noDataContainer}>
            <IconSymbol name="chart.bar.xaxis" size={48} color="#9E9E9E" />
            <ThemedText style={styles.noDataText}>No mood data available yet</ThemedText>
            <ThemedText style={styles.noDataSubtext}>Log your first mood to see insights</ThemedText>
          </ThemedView>
        )}

        {moodData.length > 0 && (
          <View style={styles.recentLogsContainer}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Recent Entries</ThemedText>
            {moodData.slice(0, 5).map((item, index) => (
              <View key={index} style={styles.logItem}>
                <View style={[
                  styles.moodIndicator, 
                  { backgroundColor: getMoodColor(item.mood) }
                ]} />
                <View style={styles.logDetails}>
                  <ThemedText style={styles.logMood}>
                    {item.mood.charAt(0).toUpperCase() + item.mood.slice(1)}
                  </ThemedText>
                  <ThemedText style={styles.logDate}>{item.date}</ThemedText>
                  {item.activity && (
                    <View style={styles.activityTag}>
                      <IconSymbol name={
                        (activities.find(a => a.value === item.activity)?.icon || 'questionmark') as any
                      } size={14} color="#666" />
                      <ThemedText style={styles.activityText}>
                        {activities.find(a => a.value === item.activity)?.label || item.activity}
                      </ThemedText>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#3f51b5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  chart: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  noDataContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  recentLogsContainer: {
    marginTop: 20,
  },
  logItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  moodIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  logDetails: {
    flex: 1,
  },
  logMood: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  logDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  activityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  activityText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#666',
  },
});