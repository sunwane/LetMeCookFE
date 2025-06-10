// components/InfoItem.js
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface InfoItemProps {
    label: string;
    value: string;
    badgeType?: 'diet' | 'health'; 
};

const InfoItem: React.FC<InfoItemProps> = ({
  label,
  value,
  badgeType,
}) => {
  let badgeStyle = {
    backgroundColor: '#E0F0FF',
    textColor: '#007AFF',
  };

  switch (badgeType) {
    case 'health':
      badgeStyle = {
        backgroundColor: '#FDE2E2',
        textColor: '#FF3B30',
      };
      break;
    case 'diet':
      badgeStyle = {
        backgroundColor: '#E0F0FF',
        textColor: '#007AFF',
      };
      break;
    default:
      break;
  }

  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      {badgeType ? (
        <View style={[styles.badge, { backgroundColor: badgeStyle.backgroundColor }]}>
          <Text style={[styles.badgeText, { color: badgeStyle.textColor }]}>
            {value}
          </Text>
        </View>
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  label: {
    color: '#666',
  },
  value: {
    color: '#333',
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default InfoItem;
