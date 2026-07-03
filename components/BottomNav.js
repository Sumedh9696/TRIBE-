import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const NAV_ITEMS = [
  { key: 'discover', label: 'Discover', icon: '🚀' },
  { key: 'chat',     label: 'Chat',     icon: '💬' },
  { key: 'plus',     label: '',         icon: '＋', isCenter: true },
  { key: 'map',      label: 'Map',      icon: '🗺️' },
  { key: 'profile',  label: 'Profile',  icon: '👤' },
];

export default function BottomNav({ active = 'discover', onPress }) {
  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.key;
        if (item.isCenter) {
          return (
            <TouchableOpacity
              key={item.key}
              style={styles.centerBtn}
              onPress={() => onPress?.(item.key)}
              activeOpacity={0.8}
            >
              <Text style={styles.centerIcon}>{item.icon}</Text>
            </TouchableOpacity>
          );
        }
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.navItem}
            onPress={() => onPress?.(item.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
              {item.label}
            </Text>
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF7',
    borderTopWidth: 1,
    borderTopColor: '#EDE8DC',
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  navIcon: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 10,
    color: '#A89F8C',
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#2BBFB3',
    fontWeight: '700',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2BBFB3',
    marginTop: 2,
  },
  centerBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2BBFB3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#2BBFB3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  centerIcon: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '700',
  },
});
