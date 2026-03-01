// components/Skeleton.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const Skeleton = ({ 
  width, 
  height, 
  borderRadius = 4, 
  style,
  animated = true 
}) => {
  const { theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;
    
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.surfaceLight,
        },
        animated && { opacity },
        style,
      ]}
    />
  );
};

// Video Card Skeleton
export const VideoCardSkeleton = () => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.videoCard, { backgroundColor: theme.surface }]}>
      <Skeleton width="100%" height={200} borderRadius={16} />
      
      <View style={styles.content}>
        <Skeleton width="100%" height={18} style={styles.titleLine} />
        <Skeleton width="80%" height={18} style={styles.titleLine} />
        
        <View style={styles.metaRow}>
          <Skeleton width={60} height={12} />
          <Skeleton width={4} height={4} borderRadius={2} style={styles.dot} />
          <Skeleton width={60} height={12} />
        </View>
        
        <Skeleton width={80} height={24} borderRadius={12} />
      </View>
    </View>
  );
};

// Category Tab Skeleton
export const CategoryTabsSkeleton = () => {
  return (
    <View style={styles.categoryContainer}>
      {[1, 2, 3, 4, 5].map((item) => (
        <Skeleton key={item} width={70} height={36} borderRadius={18} />
      ))}
    </View>
  );
};

// Header Skeleton
export const HeaderSkeleton = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        <View style={styles.logoContainer}>
          <Skeleton width={32} height={32} borderRadius={8} />
          <Skeleton width={120} height={20} />
        </View>
        <Skeleton width={70} height={36} borderRadius={18} />
      </View>
      <Skeleton width="100%" height={48} borderRadius={24} />
    </View>
  );
};

// Home Screen Skeleton
export const HomeScreenSkeleton = () => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <HeaderSkeleton />
      <CategoryTabsSkeleton />
      
      <View style={styles.list}>
        {[1, 2, 3, 4, 5].map((item) => (
          <VideoCardSkeleton key={item} />
        ))}
      </View>
    </View>
  );
};

// Profile Screen Skeleton
export const ProfileScreenSkeleton = () => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <Skeleton width={100} height={24} />
        <Skeleton width={40} height={40} borderRadius={20} />
      </View>

      {/* Profile Header */}
      <View style={[styles.profileHeader, { backgroundColor: theme.surface }]}>
        <Skeleton width={100} height={100} borderRadius={50} />
        <Skeleton width={150} height={24} style={{ marginTop: 12 }} />
        <Skeleton width={120} height={16} style={{ marginTop: 8 }} />
      </View>

      {/* Info Sections */}
      {[1, 2, 3].map((section) => (
        <View key={section} style={[styles.section, { backgroundColor: theme.surface }]}>
          <View style={styles.sectionHeader}>
            <Skeleton width={24} height={24} borderRadius={12} />
            <Skeleton width={120} height={20} style={{ marginLeft: 12 }} />
          </View>
          {[1, 2, 3].map((row) => (
            <View key={row} style={styles.infoRow}>
              <Skeleton width={20} height={20} borderRadius={10} />
              <View style={styles.infoContent}>
                <Skeleton width={80} height={12} />
                <Skeleton width="100%" height={16} style={{ marginTop: 4 }} />
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

// Video Player Screen Skeleton
export const VideoPlayerSkeleton = () => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <Skeleton width={150} height={20} />
        <Skeleton width={40} height={40} borderRadius={20} />
      </View>

      {/* Video Player */}
      <Skeleton width="100%" height={250} />

      {/* Video Info */}
      <View style={styles.videoInfo}>
        <Skeleton width="90%" height={24} style={{ marginBottom: 12 }} />
        
        {/* Channel Row */}
        <View style={styles.channelRow}>
          <Skeleton width={44} height={44} borderRadius={22} />
          <View style={styles.channelInfo}>
            <Skeleton width={120} height={18} />
            <Skeleton width={80} height={14} style={{ marginTop: 4 }} />
          </View>
          <Skeleton width={80} height={36} borderRadius={18} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          {[1, 2, 3, 4].map((btn) => (
            <Skeleton key={btn} width={70} height={36} borderRadius={18} />
          ))}
        </View>

        {/* Description */}
        <Skeleton width="100%" height={16} style={{ marginTop: 16 }} />
        <Skeleton width="95%" height={16} style={{ marginTop: 8 }} />
        <Skeleton width="90%" height={16} style={{ marginTop: 8 }} />
      </View>

      {/* Related Videos */}
      <View style={styles.relatedSection}>
        <Skeleton width={120} height={20} style={{ marginBottom: 12 }} />
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.relatedItem}>
            <Skeleton width={120} height={68} borderRadius={10} />
            <View style={styles.relatedContent}>
              <Skeleton width="100%" height={16} />
              <Skeleton width="80%" height={14} style={{ marginTop: 8 }} />
              <Skeleton width={100} height={12} style={{ marginTop: 8 }} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// Comments Screen Skeleton
export const CommentsScreenSkeleton = () => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <Skeleton width={100} height={20} />
        <Skeleton width={40} height={40} borderRadius={20} />
      </View>

      {/* Comments List */}
      <View style={styles.commentsList}>
        {[1, 2, 3, 4, 5].map((comment) => (
          <View key={comment} style={styles.commentItem}>
            <Skeleton width={40} height={40} borderRadius={20} />
            <View style={styles.commentContent}>
              <View style={styles.commentHeader}>
                <Skeleton width={100} height={16} />
                <Skeleton width={60} height={12} />
              </View>
              <Skeleton width="100%" height={14} style={{ marginTop: 8 }} />
              <Skeleton width="90%" height={14} style={{ marginTop: 4 }} />
            </View>
          </View>
        ))}
      </View>

      {/* Comment Input */}
      <View style={[styles.inputRow, { backgroundColor: theme.surface }]}>
        <Skeleton width="85%" height={44} borderRadius={22} />
        <Skeleton width={44} height={44} borderRadius={22} />
      </View>
    </View>
  );
};

// Settings Screen Skeleton
export const SettingsScreenSkeleton = () => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <Skeleton width={100} height={24} />
        <Skeleton width={40} height={40} borderRadius={20} />
      </View>

      {/* Settings Sections */}
      {[1, 2, 3, 4].map((section) => (
        <View key={section} style={[styles.settingsSection, { backgroundColor: theme.surface }]}>
          <View style={styles.sectionHeader}>
            <Skeleton width={22} height={22} borderRadius={11} />
            <Skeleton width={120} height={18} style={{ marginLeft: 8 }} />
          </View>
          
          {[1, 2, 3].map((row) => (
            <View key={row} style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Skeleton width={40} height={40} borderRadius={20} />
                <View>
                  <Skeleton width={120} height={16} />
                  <Skeleton width={80} height={12} style={{ marginTop: 4 }} />
                </View>
              </View>
              <Skeleton width={40} height={24} borderRadius={12} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Common styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  
  // Home screen styles
  headerContainer: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  videoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  titleLine: {
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dot: {
    marginHorizontal: 8,
  },
  
  // Profile screen styles
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  
  // Video player styles
  videoInfo: {
    padding: 16,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  channelInfo: {
    flex: 1,
    marginLeft: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 16,
  },
  relatedSection: {
    padding: 16,
  },
  relatedItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  relatedContent: {
    flex: 1,
    marginLeft: 12,
  },
  
  // Comments screen styles
  commentsList: {
    padding: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#3A3A3C',
  },
  
  // Settings screen styles
  settingsSection: {
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

export default Skeleton;