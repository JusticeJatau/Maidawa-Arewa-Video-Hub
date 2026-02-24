import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVideoPlayer, VideoView } from 'expo-video';
import { MaterialIcons } from '@expo/vector-icons';
import RelatedNews from '../components/RelatedNews';
import colors from '../constants/colors';
import api from '../services/api';
import { normalizeVideo, normalizeVideos } from '../services/api';

const VideoPlayerScreen = ({ navigation, route }) => {
  const { videoId } = route.params;

  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/videos/${videoId}`);
        setVideo(normalizeVideo(response.data));
        console.log('Fetched video:', normalizeVideo(response.data));
        console.log('Fetched video:', response.data);

        const relatedVideosResponse = await api.get('/videos');
        
        const relatedVideosRaw = relatedVideosResponse.data.data.filter(
          v => v.category?._id === response.data.category?._id && v._id !== videoId
        );
        setRelatedVideos(normalizeVideos(relatedVideosRaw));
        console.log('Fetched related videos:', normalizeVideos(relatedVideosResponse.data.data));
      } catch (error) {
        console.log('Video fetch error:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  // Initialize player only after video is fetched
  const player = useVideoPlayer(video?.videoUrl || '', (p) => {
    p.loop = false;
    p.play();
  });

  const handleVideoPress = (video) => {
    navigation.navigate('VideoPlayer', { videoId: video._id });
  };

  if (loading || !video) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Maidawa Arewa Video Hub</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Video Player */}
      <View style={styles.videoPlayer}>
        {video && (
          <VideoView
            style={{ width: '100%', height: '100%' }}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
        )}
      </View>

      {/* Scrollable content */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{video.title}</Text>
          <Text style={styles.videoDescription}>{video.description}</Text>

          <View style={styles.videoMeta}>
            <Text style={styles.videoDate}>{video.createdAt}</Text>
            <View style={styles.dot} />
            <Text style={styles.videoViews}>{video.views} views</Text>
          </View>

          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{video.category}</Text>
          </View>
        </View>

        <RelatedNews 
          videos={relatedVideos} 
          onPress={handleVideoPress}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  placeholder: { width: 32 },
  scrollView: { flex: 1 },
  videoPlayer: { width: '100%', height: 250, backgroundColor: colors.surface },
  videoInfo: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },
  videoTitle: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 12, lineHeight: 28 },
  videoDescription: { fontSize: 16, color: colors.textSecondary, marginBottom: 12 },
  videoMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  videoDate: { color: colors.textSecondary, fontSize: 16 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.textSecondary, marginHorizontal: 8 },
  videoViews: { color: colors.textSecondary, fontSize: 16 },
  categoryContainer: { alignSelf: 'flex-start', backgroundColor: colors.surface, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16 },
  category: { color: colors.primary, fontSize: 14, fontWeight: '500' },
});

export default VideoPlayerScreen;