import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import ClubCard from '../components/ClubCard';
import BottomNav from '../components/BottomNav';

// ── Sample Data ──────────────────────────────────────────────
const CLUBS = [
  {
    id: '1',
    title: 'Sunset Run Crew 🏃‍♂️🎒',
    tags: ['Fitness', 'High Energy', 'City Views'],
    description:
      'Meet at The Pier for our evening run. All paces welcome — just bring good vibes!',
    image:
      'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80',
    isLive: true,
    going: {
      avatars: [
        'https://i.pravatar.cc/100?img=1',
        'https://i.pravatar.cc/100?img=2',
        'https://i.pravatar.cc/100?img=5',
      ],
    },
    primaryAction: "I'M IN! 🙌",
    secondaryAction: 'Peep the Vibe',
  },
  {
    id: '2',
    title: 'Vinyl & Coffee Chats ☕',
    tags: ['Chill', 'Music', 'Gastronomy'],
    description:
      'Discussing indie classics & forth. Small group. Show up, spin records, sip something good.',
    image:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
    isLive: false,
    going: {
      avatars: [
        'https://i.pravatar.cc/100?img=3',
        'https://i.pravatar.cc/100?img=7',
      ],
    },
    primaryAction: 'Join the Move',
    secondaryAction: 'More Info',
  },
  {
    id: '3',
    title: 'City Hikers 🌲',
    tags: ['Outdoors', 'Adventure', 'Weekend'],
    description:
      'Urban trails, sunrise views, and zero excuses. Next trail drops Saturday 6 AM.',
    image:
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
    isLive: false,
    going: {
      avatars: [
        'https://i.pravatar.cc/100?img=9',
        'https://i.pravatar.cc/100?img=12',
        'https://i.pravatar.cc/100?img=15',
      ],
    },
    primaryAction: "I'M IN! 🙌",
    secondaryAction: 'Peep the Vibe',
  },
  {
    id: '4',
    title: 'Thrift Crawl Crew 🛍️📸',
    tags: ['Fashion', 'Chill', 'Creative'],
    description:
      'Second-hand hunting with style. Rotating city spots every Sunday. Bring the fit.',
    image:
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80',
    isLive: false,
    going: {
      avatars: [
        'https://i.pravatar.cc/100?img=20',
        'https://i.pravatar.cc/100?img=22',
      ],
    },
    primaryAction: 'Join the Move',
    secondaryAction: 'More Info',
  },
];

// ── Filter Chips ─────────────────────────────────────────────
const FILTERS = ['All', 'Fitness', 'Music', 'Outdoors', 'Food', 'Tech'];

// ── Screen ───────────────────────────────────────────────────
export default function DiscoverScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeNav, setActiveNav] = useState('discover');

  const filtered = CLUBS.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter =
      activeFilter === 'All' ||
      c.tags.some((t) => t.toLowerCase() === activeFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const ListHeader = () => (
    <View>
      {/* ── Top Header ── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.discoverLabel}>Discover</Text>
          <Text style={styles.tribeLogo}>TRIBE</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Find your vibe, Alex!"
              placeholderTextColor="#A89F8C"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <FlatList
          data={FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chip, activeFilter === item && styles.chipActive]}
              onPress={() => setActiveFilter(item)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  activeFilter === item && styles.chipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Section Label */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>🔥 Active Near You</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF7" />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ClubCard club={item} />}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No squads match your vibe yet 👀</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <BottomNav active={activeNav} onPress={setActiveNav} />
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFDF7',
  },
  header: {
    backgroundColor: '#FFFDF7',
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  discoverLabel: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: -0.5,
  },
  tribeLogo: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2BBFB3',
    letterSpacing: 3,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EDE6',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A2E',
    fontWeight: '500',
  },
  filterBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#F0EDE6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    fontSize: 18,
  },
  chipRow: {
    paddingBottom: 4,
    gap: 8,
  },
  chip: {
    backgroundColor: '#F0EDE6',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chipActive: {
    backgroundColor: '#2BBFB3',
    shadowColor: '#2BBFB3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  chipTextActive: {
    color: '#fff',
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  seeAll: {
    fontSize: 13,
    color: '#2BBFB3',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  empty: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#A89F8C',
    fontWeight: '500',
  },
});
