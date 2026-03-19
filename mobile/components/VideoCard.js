import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { getYouTubeThumbnail } from '../services/api';

const VideoCard = ({ video, onPress }) => {
  const { theme } = useTheme();

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views || 0} views`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.surface,
      marginBottom: 20,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    thumbnailContainer: {
      position: 'relative',
      width: '100%',
      height: 210,
    },
    thumbnail: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.surfaceLight,
    },
    playButton: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.overlayLight,
    },
    durationBadge: {
      position: 'absolute',
      bottom: 8,
      right: 8,
      backgroundColor: theme.overlay,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    durationText: {
      color: theme.text,
      fontSize: 12,
      fontWeight: '500',
    },
    content: {
      padding: 16,
    },
    titleRow: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    channelAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    channelAvatarText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: 'bold',
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
      lineHeight: 22,
    },
    channelName: {
      fontSize: 13,
      color: theme.textSecondary,
      fontWeight: '500',
    },
    description: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 12,
      lineHeight: 20,
    },
    metaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      gap: 4,
    },
    date: {
      color: theme.textTertiary,
      fontSize: 12,
      marginLeft: 2,
    },
    dot: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: theme.textTertiary,
      marginHorizontal: 6,
    },
    views: {
      color: theme.textTertiary,
      fontSize: 12,
      marginLeft: 2,
    },
    categoryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: theme.surfaceLight,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 16,
      gap: 4,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    category: {
      color: theme.primary,
      fontSize: 11,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
  });

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
          source={{ 
            uri: video.source === "youtube" ? getYouTubeThumbnail(video.videoUrl) : video.thumbnailUrl
          }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.playButton}>
          <MaterialIcons
            name="play-circle-filled"
            size={60}
            color="rgba(255,255,255,0.9)"
          />
        </View>
        {video.duration && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{video.duration}</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.channelAvatar}>
            <Text style={styles.channelAvatarText}>
              {video.channelName?.[0] || 'M'}
            </Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {video.title}
            </Text>
            <Text style={styles.channelName} numberOfLines={1}>
              {video.channelName || 'MA Video Hub'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {video.description}
        </Text>

        <View style={styles.metaContainer}>
          <MaterialIcons name="access-time" size={14} color={theme.textTertiary} />
          <Text style={styles.date}>{formatDate(video.createdAt)}</Text>
          <View style={styles.dot} />
          <MaterialIcons name="visibility" size={14} color={theme.textTertiary} />
          <Text style={styles.views}>{formatViews(video.views)}</Text>
        </View>

        {video.category && (
          <View style={styles.categoryContainer}>
            <MaterialIcons name="folder" size={12} color={theme.primary} />
            <Text style={styles.category}>{video.category?.name || "Uncategorized"}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(VideoCard);