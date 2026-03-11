import React, { useEffect, useState, useContext } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVideoPlayer, VideoView } from 'expo-video';
import { MaterialIcons } from '@expo/vector-icons';
import RelatedNews from '../components/RelatedNews';
import { VideoPlayerSkeleton } from '../components/Skeleton';
import colors from '../constants/colors';
import {api} from '../services/api';
import { normalizeVideo, normalizeVideos } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const VideoPlayerScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
 
  const { videoId } = route.params;
  
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const {isLoggedIn} = useContext(AuthContext);

  const [like, setLike] = useState([]);
  const [dislike, setDislike] = useState([]);
  const [comment, setComment] = useState([]);
  const [share, setShare] = useState([]);

  const handleReaction = async(type) => {
    if(!isLoggedIn){
      navigation.navigate('Login');
      return;
    }

    try{
      await api.post(`/react/${videoId}`, { type: type });

      if(type === "like"){
        //If already liked -> do nothing
        if (like.userReaction) return;

        // If previously disliked → remove dislike first
        if (dislike.userReaction) {
          setDislike(prev => ({
            count: prev.count - 1,
            userReaction: false
          }));
        }

        // Add like
        setLike(prev => ({
          count: prev.count + 1,
          userReaction: true
        }));
      }


      if(type === "dislike"){
        // If already disliked -> do nothing
        if (dislike.userReaction) return;

        // If previously liked → remove like first
        if (like.userReaction) {
          setLike(prev => ({
            count: prev.count - 1,
            userReaction: false
          }));
        }

        // Add dislike
        setDislike(prev => ({
          count: prev.count + 1,
          userReaction: true
        }));
      }
    }catch(err){
      console.log("Error liking video:", err.message);
    }
    
  }

  useEffect(() => {
    const fetchVideo = async () => {
      const likes = {}
      const dislikes = {}

      try {
        setLoading(true);
        const response = await api.get(`/videos/${videoId}`);
        setVideo(response.data);

        setLike({
          count: response.data.likes,
          userReaction: response.data.userReaction === "like"? true:false
        })
        setDislike({
          count: response.data.dislikes,
          userReaction: response.data.userReaction === "dislike"? true:false
        })

        const relatedVideosResponse = await api.get('/videos');
        
        const relatedVideosRaw = relatedVideosResponse.data.data.filter(
          v => v.category?._id === response.data.category?._id && v._id !== videoId
        );
        setRelatedVideos(relatedVideosRaw);
      } catch (error) {
        console.log('Video fetch error:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  const player = useVideoPlayer(video?.videoUrl || '', (p) => {
    p.loop = false;
    p.play();
  });

  const handleVideoPress = (video) => {
    navigation.navigate('VideoPlayer', { videoId: video._id });
  };

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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: theme.background 
    },
    flex: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 5
    },
    loadingContainer: {
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      gap: 12,
    },
    loadingText: {
      color: theme.textSecondary,
      fontSize: 16,
    },
    header: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      paddingHorizontal: 16, 
      paddingVertical: 12, 
      backgroundColor: theme.surface,
      borderBottomWidth: 1, 
      borderBottomColor: theme.border,
    },
    backButton: { 
      padding: 8,
      borderRadius: 20,
      backgroundColor: theme.background,
    },
    headerTitle: { 
      fontSize: 18, 
      fontWeight: '600', 
      color: theme.text,
      flex: 1,
      textAlign: 'center',
      marginHorizontal: 12,
    },
    placeholder: { 
      width: 40 
    },
    scrollView: { 
      flex: 1 
    },
    videoPlayer: { 
      width: '100%', 
      height: 250, 
      backgroundColor: theme.surface 
    },
    videoView: {
      width: '100%', 
      height: '100%',
    },
    videoInfo: { 
      padding: 16,
    },
    videoTitle: { 
      fontSize: 20, 
      fontWeight: '700', 
      color: theme.text, 
      marginBottom: 16, 
      lineHeight: 28,
    },
    channelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    channelAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    channelAvatarText: {
      color: theme.text,
      fontSize: 18,
      fontWeight: 'bold',
    },
    channelInfo: {
      flex: 1,
    },
    channelName: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 2,
    },
    subscriberCount: {
      color: theme.textSecondary,
      fontSize: 13,
    },
    subscribeButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    subscribeText: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '600',
    },
    statsRow: {
      marginBottom: 16,
    },
    viewDateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    videoDate: { 
      color: theme.textSecondary, 
      fontSize: 14,
    },
    dot: { 
      width: 4, 
      height: 4, 
      borderRadius: 2, 
      backgroundColor: theme.textSecondary, 
      marginHorizontal: 8,
    },
    videoViews: { 
      color: theme.textSecondary, 
      fontSize: 14,
      fontWeight: '500',
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 25,
      gap: 6,
      borderWidth: 1,
      borderColor: theme.border,
    },
    actionButtonActive: {
      backgroundColor: 'rgba(10, 132, 255, 0.1)',
      borderColor: theme.primary,
    },
    actionText: {
      color: theme.textSecondary,
      fontSize: 13,
      fontWeight: '500',
    },
    actionTextActive: {
      color: theme.primary,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 16,
    },
    descriptionTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    videoDescription: { 
      fontSize: 15, 
      color: theme.textSecondary, 
      marginBottom: 16,
      lineHeight: 22,
    },
    categoryContainer: { 
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start', 
      backgroundColor: theme.surface,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 25,
      gap: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    category: { 
      color: theme.primary, 
      fontSize: 14, 
      fontWeight: '600',
    },
  });

  if (loading || !video) {
    return (
      <VideoPlayerSkeleton/>
    )
  }


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>MA Video Hub</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Video Player */}
      <View style={styles.videoPlayer}>
        {video && (
          <VideoView
            style={styles.videoView}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
        )}
      </View>

      {/* Scrollable content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{video.title}</Text>
          
          <View style={styles.channelRow}>
            <View style={styles.channelAvatar}>
              <Text style={styles.channelAvatarText}>
                {video.channelName?.[0] || 'M'}
              </Text>
            </View>
            <View style={styles.channelInfo}>
              <Text style={styles.channelName}>{video.channelName || 'MA Video Hub'}</Text>
              <Text style={styles.subscriberCount}>1.2K subscribers</Text>
            </View>
            <TouchableOpacity style={styles.subscribeButton}>
              <Text style={styles.subscribeText}>Subscribe</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.viewDateContainer}>
              <Text style={styles.videoViews}>{formatViews(video.views)}</Text>
              <View style={styles.dot} />
              <Text style={styles.videoDate}>{formatDate(video.createdAt)}</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.actionButtons}
            >
              <View style={styles.flex}>
                <TouchableOpacity 
                  onPress={()=>handleReaction("like")} 
                  style={[styles.actionButton, like.userReaction && styles.actionButtonActive]}
                >
                  <MaterialIcons 
                    name="thumb-up" 
                    size={20} 
                    color={like.userReaction ? theme.primary : theme.textSecondary} 
                  />
                  <Text style={[styles.actionText, like.userReaction && styles.actionTextActive]}>
                    {like.userReaction === "like" ? 'Liked' : 'Like'} 
                  </Text>
                </TouchableOpacity>
                <Text style={styles.actionText}>{like.count}</Text>
              </View>

              <View style={styles.flex}>
                <TouchableOpacity 
                  onPress={()=>handleReaction("dislike")} 
                  style={[styles.actionButton, dislike.userReaction && styles.actionButtonActive]}
                >
                  <MaterialIcons 
                    name="thumb-down" 
                    size={20} 
                    color={dislike.userReaction ? theme.primary : theme.textSecondary} 
                  />
                  <Text style={[styles.actionText, dislike.userReaction && styles.actionTextActive]}>
                    {dislike.userReaction ? 'Disliked' : 'Dislike'}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.actionText}>{dislike.count}</Text>
              </View>

              <View style={styles.flex}>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Comments', { videoId })} 
                  style={styles.actionButton}
                >
                  <MaterialIcons name="comment" size={20} color={theme.textSecondary} />
                  <Text style={styles.actionText}>Comments</Text>
                </TouchableOpacity>
                <Text style={styles.actionText}>{comment?.count || 0}</Text>
              </View>

              <View style={styles.flex}>
                <TouchableOpacity 
                  onPress={() => Alert.alert("Share", "Share functionality coming soon!")} 
                  style={styles.actionButton}
                >
                  <MaterialIcons name="share" size={20} color={theme.textSecondary} />
                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
                <Text style={styles.actionText}>{share?.count || 0}</Text>
              </View>
            </ScrollView>
          </View>

          <View style={styles.divider} />

          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.videoDescription}>
            {video.description || 'No description available.'}
          </Text>

          {video.category && (
            <View style={styles.categoryContainer}>
              <MaterialIcons name="folder" size={16} color={theme.primary} />
              <Text style={styles.category}>{video.category?.name || "Uncategorized"}</Text>
            </View>
          )}
        </View>

        <RelatedNews 
          videos={relatedVideos} 
          onPress={handleVideoPress}
        />
      </ScrollView>
    </SafeAreaView>
  );
  
};

export default VideoPlayerScreen;