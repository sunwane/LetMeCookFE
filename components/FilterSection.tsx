import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FilterSectionProps {
  title: string;
  children?: React.ReactNode;
}

const FilterSection = ({ title, children }: FilterSectionProps) => {
  // Mở section đầu tiên (Bún, Mì, Phở) mặc định
  const [expanded, setExpanded] = useState(title == 'Bún, Mì, Phở');

  return (
    <View style={styles.section}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.sectionHeader}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.arrow}>{expanded ? '▾' : '▸'}</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.sectionContent}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#cecece',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A2917',
  },
  arrow: {
    fontSize: 20,
    color: '#666',
    fontWeight: '500',
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: -5,
  },
});

export default FilterSection;
