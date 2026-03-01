import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Header from '../components/Header';
import CategoryTabs from '../components/CategoryTabs';
import VideoCard from '../components/VideoCard';
import { HomeScreenSkeleton, VideoCardSkeleton } from '../components/Skeleton';
import { api } from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { normalizeVideo } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([{
    _id: 'All',
    name: 'All',
  }]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Use ref to track the current category for race conditions
  const currentCategoryRef = useRef(selectedCategory);

  useEffect(() => {
    fetchVideos(1, selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(prev => [{_id: 'All', name: 'All'}, ...response.data]);
    } catch (err) {
      console.log('Error fetching categories:', err.message);
    }
  };

  // Fetch videos from backend
  const fetchVideos = async (pageNumber = 1, category = selectedCategory) => {
    // Don't check loading for first page, but check for subsequent pages
    if (pageNumber > 1 && (!hasMore || loading)) return;

    try {
      setLoading(true);
      
      // Set appropriate loading state based on page number
      if (pageNumber === 1) {
        if (initialLoading) {
          // First load - handled by initialLoading
        } else {
          // Category change - show card skeletons
          setCategoryLoading(true);
        }
      }

      const response = await api.get(
        `/videos?page=${pageNumber}&limit=${api.PAGE_LIMIT}&category=${category !== 'All' ? category : ''}`
      );

      // Prevent stale response appending
      if (currentCategoryRef.current !== category) return;

      const newVideos = response.data.data;

      setVideos(prev =>
        pageNumber === 1 ? newVideos : [...prev, ...newVideos]
      );
      setHasMore(response.data.hasNextPage);
      setPage(pageNumber);
    } catch (err) {
      console.log('Error fetching videos:', err.message);
    } finally {
      setLoading(false);
      setInitialLoading(false);
      setCategoryLoading(false);
    }
  };

  // Load next page for infinite scroll
  const loadMore = () => {
    if (hasMore && !loading && !categoryLoading) {
      fetchVideos(page + 1, selectedCategory);
    }
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    if (category === selectedCategory) return;
    
    currentCategoryRef.current = category;
    setSelectedCategory(category);
    setPage(1);
    setHasMore(true);
    setVideos([]);
    // Don't set initialLoading, just let categoryLoading handle it
  };

  // Navigate to VideoPlayerScreen with only videoId
  const handleVideoPress = (video) => {
    navigation.navigate('VideoPlayer', { videoId: video._id });
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  // Show full page skeleton only on initial load
  if (initialLoading) {
    return <HomeScreenSkeleton />;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    listContent: {
      paddingHorizontal: 12,
      paddingBottom: 0,
    },
    skeletonContainer: {
      paddingHorizontal: 12,
      paddingTop: 20,
      flex: 1,
    },
    footerLoader: {
      paddingVertical: 20,
      alignItems: 'center',
    },
  });

  // If category loading and no videos yet, show card skeletons
  if (categoryLoading && videos.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar 
          barStyle="light-content"
          backgroundColor={theme.background}
          translucent={false}
        />
        <Header onLoginPress={handleLogin} />
        
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <View style={styles.skeletonContainer}>
          {[1, 2, 3, 4, 5].map((item) => (
            <VideoCardSkeleton key={item} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="light-content"
        backgroundColor={theme.background}
        translucent={false}
      />
      <Header onLoginPress={handleLogin} />
      
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <FlatList
        data={videos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <VideoCard
            video={normalizeVideo(item)}
            onPress={handleVideoPress}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? 
          <View style={styles.footerLoader}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View> 
          : null
        }
      />
    </SafeAreaView>
  );
};

export default HomeScreen;