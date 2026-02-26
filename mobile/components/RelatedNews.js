import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { SERVER_BASE } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const RelatedNews = ({ videos, onPress }) => {
  const { theme } = useTheme();
  console.log('RelatedNews videos:', videos);

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return `${views || 0}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderRelatedItem = ({ item, index }) => {
    return (
      <TouchableOpacity 
        onPress={() => onPress(item)}
        activeOpacity={0.7}
        style={[
          styles.relatedItem,
          index === videos.length - 1 && styles.lastItem
        ]}
      >
        <View style={styles.relatedThumbnail}>
          {item.thumbnailUrl ? (
            <Image 
              source={{ uri: item.thumbnailUrl }} 
              style={styles.thumbnailImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.thumbnailPlaceholder}>
              <MaterialIcons name="play-circle-outline" size={30} color={theme.textSecondary} />
            </View>
          )}
          {item.duration && (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{item.duration}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.relatedContent}>
          <Text style={styles.relatedTitle} numberOfLines={2}>
            {item.title}
          </Text>
          
          <Text style={styles.channelName} numberOfLines={1}>
            {item.channelName || 'MA Video Hub'}
          </Text>
          
          <View style={styles.relatedMeta}>
            <View style={styles.metaLeft}>
              <MaterialIcons name="visibility" size={14} color={theme.textTertiary} />
              <Text style={styles.metaText}>{formatViews(item.views)}</Text>
            </View>
            
            <View style={styles.metaDot} />
            
            <View style={styles.metaLeft}>
              <MaterialIcons name="access-time" size={14} color={theme.textTertiary} />
              <Text style={styles.metaText}>{formatDate(item.createdAt)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (videos.length === 0) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 8,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.text,
      flex: 1,
    },
    videoCount: {
      fontSize: 14,
      color: theme.textSecondary,
      fontWeight: '500',
    },
    listContent: {
      paddingBottom: 8,
    },
    relatedItem: {
      flexDirection: 'row',
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    lastItem: {
      borderBottomWidth: 0,
      marginBottom: 0,
      paddingBottom: 0,
    },
    relatedThumbnail: {
      position: 'relative',
      width: 120,
      height: 68,
      borderRadius: 10,
      overflow: 'hidden',
      marginRight: 12,
      backgroundColor: theme.surface,
    },
    thumbnailImage: {
      width: '100%',
      height: '100%',
    },
    thumbnailPlaceholder: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    durationBadge: {
      position: 'absolute',
      bottom: 4,
      right: 4,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
    },
    durationText: {
      color: theme.text,
      fontSize: 10,
      fontWeight: '500',
    },
    relatedContent: {
      flex: 1,
      justifyContent: 'space-between',
    },
    relatedTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
      lineHeight: 20,
    },
    channelName: {
      fontSize: 13,
      color: theme.textSecondary,
      marginBottom: 6,
      fontWeight: '500',
    },
    relatedMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    metaLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      color: theme.textTertiary,
      fontSize: 12,
      fontWeight: '500',
    },
    metaDot: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: theme.textTertiary,
      marginHorizontal: 6,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="video-library" size={22} color={theme.primary} />
        <Text style={styles.sectionTitle}>Related Videos</Text>
        <Text style={styles.videoCount}>{videos.length} videos</Text>
      </View>
      
      <FlatList
        data={videos}
        renderItem={renderRelatedItem}
        keyExtractor={(item) => item._id}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default RelatedNews;