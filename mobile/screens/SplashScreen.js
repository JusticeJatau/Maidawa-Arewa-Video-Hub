// screens/SplashScreenMinimal.js
import React, { useEffect, useRef, useMemo } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const SplashScreenMinimal = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle rotation animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Navigate after 2.5 seconds
    const timeout = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Background decorative elements */}
        <View style={styles.backgroundDots}>
          <View style={[styles.dot, styles.dot1, { backgroundColor: theme.primary + '10' }]} />
          <View style={[styles.dot, styles.dot2, { backgroundColor: theme.primary + '10' }]} />
          <View style={[styles.dot, styles.dot3, { backgroundColor: theme.primary + '10' }]} />
        </View>

        <View style={styles.content}>
          {/* Logo with animation */}
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { rotate: rotate }
                ],
              },
            ]}
          >
            <View style={[styles.logoBackground, { backgroundColor: theme.surface }]}>
              <MaterialIcons name="play-circle-filled" size={80} color={theme.primary} />
            </View>
          </Animated.View>

          {/* Text with animation */}
          <Animated.View
            style={[
              styles.textWrapper,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={[styles.title, { color: theme.text }]}>MA Video Hub</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Your Premier News Destination
            </Text>
            
            {/* Loading indicator */}
            <View style={styles.loadingContainer}>
              <View style={[styles.loadingDot, { backgroundColor: theme.primary }]} />
              <View style={[styles.loadingDot, { backgroundColor: theme.primary, opacity: 0.6 }]} />
              <View style={[styles.loadingDot, { backgroundColor: theme.primary, opacity: 0.3 }]} />
            </View>
          </Animated.View>
        </View>

        {/* Footer credit */}
        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <Text style={[styles.footerText, { color: theme.textTertiary }]}>
            from <Text style={[styles.footerBold, { color: theme.primary }]}>Maidawa Arewa</Text>
          </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    position: 'relative',
  },
  backgroundDots: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  dot: {
    position: 'absolute',
    borderRadius: 100,
  },
  dot1: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  dot2: {
    width: 150,
    height: 150,
    bottom: -30,
    left: -30,
  },
  dot3: {
    width: 100,
    height: 100,
    bottom: '30%',
    right: '20%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoWrapper: {
    marginBottom: 40,
  },
  logoBackground: {
    width: 140,
    height: 140,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: theme.border + '40',
  },
  textWrapper: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    letterSpacing: 0.3,
    marginBottom: 32,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '400',
  },
  footerBold: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SplashScreenMinimal;