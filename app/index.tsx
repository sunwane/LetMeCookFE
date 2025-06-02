import TabNavigator from '@/navigation/TabNavigator';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Index() {
  return (
    <SafeAreaProvider>
      <TabNavigator />
    </SafeAreaProvider>
  );
}