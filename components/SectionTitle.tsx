// components/SectionTitle.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SectionTitleProps {
  title: string;
};

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => (
  <View style={styles.container}>
    <View style={styles.bar} />
    <Text style={styles.text}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 16,
  },
  bar: {
    width: 5,
    height: 16,
    backgroundColor: '#FF6600',
    borderRadius: 3,
    marginRight: 8,
    marginTop: 2,
  },
  text: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#5D2B1A',
  },
});

export default SectionTitle;
