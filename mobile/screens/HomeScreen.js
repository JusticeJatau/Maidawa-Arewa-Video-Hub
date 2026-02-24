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
import api from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { normalizeVideo } from '../services/api';

const PAGE_LIMIT = 10;
const API_BASE = process.env.EXPO_PUBLIC_BACKEND_URL;
const SERVER_BASE = API_BASE.replace(/\/api$/, '');

const HomeScreen = ({ navigation }) => {
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
      console.log('Fetched categories:', response.data);
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
        `/videos?page=${pageNumber}&limit=${PAGE_LIMIT}&category=${category !== 'All' ? category : ''}`
      );
      console.log(`Fetched videos for category "${category}" (page ${pageNumber}):`, response.data.data);
      console.log('Fetched videos:', response.data.data);

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
    console.log('Selected category:', category);
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

  // Optional: Drawer menu button
  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerLeft: () => (
  //       <TouchableOpacity
  //         onPress={() => navigation.openDrawer()}
  //         style={{ marginLeft: 15 }}
  //       >
  //         <Ionicons name="menu" size={28} color="#000" />
  //       </TouchableOpacity>
  //     ),
  //   });
  // }, [navigation]);

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
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default HomeScreen;