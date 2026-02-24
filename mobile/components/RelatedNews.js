import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';
import { SERVER_BASE } from '../services/api'; // make sure you export SERVER_BASE from api.js

const RelatedNews = ({ videos, onPress }) => {
  console.log('RelatedNews videos:', videos);

  const renderRelatedItem = ({ item }) => {
    console.log('Related video item:', item);
    // const thumbnail = item.thumbnailUrl ? `${SERVER_BASE}${item.thumbnailUrl}` : null;

    return (
      <TouchableOpacity onPress={() => onPress(item)}>
        <View style={styles.relatedItem}>
          <View style={styles.relatedThumbnail}>
            {item.thumbnailUrl ? (
              <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnailImage} />
            ) : (
              <View style={styles.thumbnailPlaceholder} />
            )}
          </View>
          <View style={styles.relatedContent}>
            <Text style={styles.relatedTitle} numberOfLines={3}>
              {item.title}
            </Text>
            <Text style={styles.relatedDescription}>{item.description}</Text>
            <View style={styles.relatedMeta}>
              <Text style={styles.relatedDate}>{item.createdAt}</Text>
              <Text style={styles.relatedViews}>{item.views} views</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {videos.length > 0 && <Text style={styles.sectionTitle}>Related News</Text>}
      <FlatList
        data={videos}
        renderItem={renderRelatedItem}
        keyExtractor={(item) => item._id}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  relatedDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  relatedItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  relatedContent: {
    flex: 1,
    marginRight: 12,
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  relatedMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  relatedDate: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  relatedViews: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  relatedThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface,
  },
});

export default RelatedNews;