import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MoodLoggingScreen from './MoodLogging'; // Import MoodLogging as Home
import HistoryScreen from './History'; // Import History as History
import WakingHoursScreen from './WakingHoursScreen'; // Import WakingHoursScreen as Settings

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={MoodLoggingScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" component={WakingHoursScreen} />
    </Tab.Navigator>
  );
}
