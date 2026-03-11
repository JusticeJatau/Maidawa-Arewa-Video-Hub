import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Text,
} from 'react-native';
import Header from '../components/Header';
import CategoryTabs from '../components/CategoryTabs';
import VideoCard from '../components/VideoCard';
import { HomeScreenSkeleton, VideoCardSkeleton } from '../components/Skeleton';
import { api, PAGE_LIMIT } from '../services/api';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState(''); // This is the actual search that triggers API calls
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false); // Separate loading state for search
  const [hasMore, setHasMore] = useState(true);

  // Use refs to track current values for race conditions
  const currentCategoryRef = useRef(selectedCategory);
  const currentActiveSearchRef = useRef(activeSearch);

  useEffect(() => {
    fetchVideos(1, selectedCategory, activeSearch);
  }, [selectedCategory, activeSearch]); // Only trigger when activeSearch changes

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
  const fetchVideos = async (pageNumber = 1, category = selectedCategory, search = activeSearch) => {
    // For subsequent pages, stop if no more videos or already loading
    if (pageNumber > 1 && (!hasMore || loading)) return;

    try {
      // Set appropriate loading state
      if (pageNumber === 1) {
        if (search !== currentActiveSearchRef.current) {
          // This is a new search
          setSearchLoading(true);
        } else if (category !== currentCategoryRef.current) {
          // This is a category change
          setCategoryLoading(true);
        } else {
          setLoading(true);
        }
      } else {
        setLoading(true);
      }

      // Build query parameters
      let url = `/videos?page=${pageNumber}&limit=${PAGE_LIMIT}`;
      if (category !== 'All') {
        url += `&category=${category}`;
      }
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await api.get(url);
      
      // Prevent stale responses
      if (currentCategoryRef.current !== category || currentActiveSearchRef.current !== search) return;

      const newVideos = response.data.data;
      console.log(newVideos)

      // Append or replace videos
      setVideos(prev => {
        if (pageNumber === 1) return newVideos; // Replace on new search/category
        const merged = [...prev, ...newVideos];
        const unique = merged.filter(
          (v, index, arr) => arr.findIndex(x => x._id === v._id) === index
        );
        return unique;
      });
      
      // Update hasMore flag from backend
      setHasMore(response.data.hasNextPage);
      setPage(pageNumber);
    } catch (err) {
      console.log('Error fetching videos:', err.message);
    } finally {
      setLoading(false);
      setInitialLoading(false);
      setCategoryLoading(false);
      setSearchLoading(false);
    }
  };

  // Handle search - this gets called when user presses submit
  const handleSearch = (query) => {
    // Update the search query state (for the input)
    setSearchQuery(query);
    
    // Only trigger API call if there's an actual query or if clearing search
    // This prevents empty searches from triggering (unless you want that)
    if (query.trim() !== currentActiveSearchRef.current) {
      // Update the active search (this will trigger the useEffect)
      setActiveSearch(query.trim());
      
      // Reset pagination
      setPage(1);
      setHasMore(true);
      setVideos([]);
      
      // Update ref to prevent race conditions
      currentActiveSearchRef.current = query.trim();
    }
  };

  // Handle clear search (optional - you can call this from Header's clear button)
  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveSearch('');
    setPage(1);
    setHasMore(true);
    setVideos([]);
    currentActiveSearchRef.current = '';
  };

  // Infinite scroll trigger
  const loadMore = () => {
    if (!loading && !categoryLoading && !searchLoading && hasMore) {
      fetchVideos(page + 1, selectedCategory, activeSearch);
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
    
    // Don't reset search when changing categories
    // This allows searching within categories
  };

  // Navigate to VideoPlayerScreen
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
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 50,
    },
    emptyText: {
      color: theme.textSecondary,
      fontSize: 16,
    },
  });

  // Show skeletons during search or category loading when no videos
  if ((searchLoading || categoryLoading) && videos.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar 
          barStyle="light-content"
          backgroundColor={theme.background}
          translucent={false}
        />
        <Header 
          onLoginPress={handleLogin} 
          onSearch={handleSearch}
          // Optional: if you want to handle clear separately
          // onClearSearch={handleClearSearch}
        />
        
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
      <Header 
        onLoginPress={handleLogin} 
        onSearch={handleSearch}
        // Optional: if you want to handle clear separately
        // onClearSearch={handleClearSearch}
      />
      
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
            video={item}
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
        ListEmptyComponent={!loading && !searchLoading && !categoryLoading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeSearch ? `No videos found for "${activeSearch}"` : 'No videos available'}
            </Text>
          </View>
        ) : null}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;