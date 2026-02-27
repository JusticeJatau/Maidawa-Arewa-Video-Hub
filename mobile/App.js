import {useEffect, useState, useCallback} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import VideoPlayerScreen from './screens/VideoPlayerScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import CommentScreen from './screens/CommentScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import SplashScreenMinimal from './screens/SplashScreen';
import BottomTabs from './navigations/BottomTabs'

import { View } from 'react-native';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import { StatusBar } from 'react-native';

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync(); // keeps the native splash visible until we hide it manually

const Stack = createStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls, etc.
        // Artificially delay for 2 seconds to show splash screen
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AuthProvider>
        <ThemeProvider>
          <NavigationContainer>
            <StatusBar 
              barStyle="light-content"
              backgroundColor="#007aff"
              translucent={false}
            />
            <Stack.Navigator
              screenOptions={{
                animation: 'fade'
              }}
            >
              <Stack.Screen
                name="Splash"
                component={SplashScreenMinimal}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="MainTabs"
                component={BottomTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="VideoPlayer" 
                component={VideoPlayerScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Login" 
                component={LoginScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="SignUp" 
                component={SignUpScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Comments" 
                component={CommentScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Profile" 
                component={ProfileScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='Settings'
                component={SettingsScreen}
                options={{headerShown: false}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </AuthProvider>
    </View> 
  );
}