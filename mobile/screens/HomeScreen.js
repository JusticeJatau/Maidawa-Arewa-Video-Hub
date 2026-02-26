import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Header from '../components/Header';
import CategoryTabs from '../components/CategoryTabs';
import VideoCard from '../components/VideoCard';
import colors from '../constants/colors';
import {api, PAGE_LIMIT, SERVER_BASE, API_BASE} from '../services/api';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const [hasMore, setHasMore] = useState(true);

  // Use ref to track the current category for race conditions
  const currentCategoryRef = useRef(selectedCategory);

  useEffect(() => {
    fetchVideos(1, selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    setCategories([{_id: 'All',name: 'All',}])
    fetchCategories();
  }, []);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(prev => [...prev, ...response.data]);
    } catch (err) {
      console.log('Error fetching categories:', err.message);
    }
  };

  // Fetch videos from backend
  const fetchVideos = async (pageNumber = 1, category = selectedCategory) => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      // API call: adjust endpoint according to your backend
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
    }
  };

  // Load next page for infinite scroll
  const loadMore = () => {
    if (hasMore && !loading) {
      fetchVideos(page + 1, selectedCategory);
    }
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    currentCategoryRef.current = category;
    setSelectedCategory(category);
    setPage(1);
    setHasMore(true);
    setVideos([]);
  };

  // Navigate to VideoPlayerScreen with only videoId
  const handleVideoPress = (video) => {
    navigation.navigate('VideoPlayer', { videoId: video._id });
  };
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginBottom: -20,
      backgroundColor: theme.background,
    },
    listContent: {
      paddingHorizontal: 12,
      paddingBottom: 0,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="#f00"
        translucent={false}
      />
      <Header 
        onLoginPress={handleLogin}
      />
      <CategoryTabs
        categories={categories}
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
        style={{ marginTop: 20 }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;