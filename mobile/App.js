import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import VideoPlayerScreen from './screens/VideoPlayerScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import CommentScreen from './screens/CommentScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import BottomTabs from './navigations/BottomTabs'

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import { StatusBar } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  return (
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
  );
}