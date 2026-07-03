import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';

export default function ClubCard({ club }) {
  const {
    title,
    tags,
    description,
    image,
    isLive,
    going,
    primaryAction,
    secondaryAction,
  } = club;

  return (
    <View style={styles.card}>
      {/* Hero Image */}
      <ImageBackground
        source={{ uri: image }}
        style={styles.heroImage}
        imageStyle={styles.heroImageStyle}
      >
        {isLive && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        )}
      </ImageBackground>

      {/* Card Body */}
      <View style={styles.body}>
        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Vibe Tags */}
        <View style={styles.tagsRow}>
          {tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          {/* Going Avatars */}
          <View style={styles.goingRow}>
            {going.avatars.map((uri, i) => (
              <Image
                key={i}
                source={{ uri }}
                style={[styles.avatar, { marginLeft: i === 0 ? 0 : -10 }]}
              />
            ))}
            <Text style={styles.goingText}>Going</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8}>
              <Text style={styles.primaryBtnText}>{primaryAction}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.8}>
              <Text style={styles.secondaryBtnText}>{secondaryAction}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  heroImage: {
    height: 160,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 10,
  },
  heroImageStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4D4D',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  liveText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  body: {
    padding: 14,
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: -0.3,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#EEF9F8',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    color: '#2BBFB3',
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  footer: {
    marginTop: 4,
    gap: 10,
  },
  goingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#fff',
  },
  goingText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#2BBFB3',
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#2BBFB3',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#2BBFB3',
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#2BBFB3',
    fontWeight: '700',
    fontSize: 13,
  },
});
