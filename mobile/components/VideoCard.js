import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../constants/colors';

const VideoCard = ({ video, onPress }) => {
  console.log('Video:', video);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(video)}
      activeOpacity={0.9}
      accessible
      accessibilityLabel={`Play video: ${video.title}`}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: video.thumbnailUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.playButton}>
          <MaterialIcons
            name="play-circle-filled"
            size={50}
            color="rgba(255,255,255,0.9)"
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {video.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {video.description}
        </Text>

        <View style={styles.metaContainer}>
          <Text style={styles.date}>{video.createdAt}</Text>
          <View style={styles.dot} />
          <Text style={styles.views}>{video.views}</Text>
        </View>

        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{video.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 22,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  date: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondary,
    marginHorizontal: 6,
  },
  views: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  category: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default React.memo(VideoCard);