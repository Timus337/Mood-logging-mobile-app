import * as Notifications from 'expo-notifications';

// Schedule 5 evenly spaced reminders between waking hours
export async function scheduleMoodNotifications(start: Date, end: Date) {
  // Clear old notifications first
  await Notifications.cancelAllScheduledNotificationsAsync();

  const totalDuration = end.getTime() - start.getTime();
  const interval = totalDuration / 4; // 5 reminders = 4 gaps

  for (let i = 0; i < 5; i++) {
    const reminderTime = new Date(start.getTime() + interval * i);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Mood Check 🧠',
        body: "How are you feeling right now? Tap to log your mood.",
        sound: true,
      },
      trigger: {
        channelId: 'mood-reminders',
        hour: reminderTime.getHours(),
        minute: reminderTime.getMinutes(),
        repeats: true,
      },
    });
  }
}

// Schedule mood notification for the next 5 days
export async function scheduleDailyNotifications(start: Date, end: Date) {
  // Implementation here
} 