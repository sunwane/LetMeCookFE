import '@/config/globalTextConfig'; // Import để apply cấu hình toàn cục
import TabNavigator from '@/navigation/TabNavigator';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Index() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <TabNavigator />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}