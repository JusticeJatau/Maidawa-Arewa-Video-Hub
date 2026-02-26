import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Text, View } from "react-native";

const Tab = createBottomTabNavigator();
const height = 80;

export default function BottomTabs() {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: height,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Trending") iconName = "whatshot";
          else if (route.name === "New") iconName = "add-circle";
          else if (route.name === "Profile") iconName = "person";

          return (
            <View style={{ alignItems: "center", width: 70 }}>
              {/* Circle + Icon */}
              <View
                style={{
                  width: 60,
                  height: 40,
                  borderRadius: 50,
                  backgroundColor: focused ? theme.primary : "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                  transform: [{ translateY: focused ? -10 : 0 }],
                  marginBottom: 2,
                }}
              >
                <MaterialIcons
                  name={iconName}
                  size={focused ? 28 : 24}
                  color={focused ? theme.text : color}
                />
              </View>

              {/* Text */}
              <Text
                style={{
                  color,
                  fontSize: 12,
                  fontWeight: focused ? "600" : "400",
                  marginTop: focused ? -8 : -10,
                }}
              >
                {route.name}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}