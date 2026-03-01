// services/auth.js
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Get JWT token from AsyncStorage
 * @returns {Promise<string|null>} the token or null if not set
 */
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("jwt_token"); 
    return token;
  } catch (error) {
    console.error("Error getting token from storage:", error);
    return null;
  }
};

/**
 * Save JWT token to AsyncStorage
 * @param {string} token - the JWT token to save
 */
export const setToken = async (token) => {
  try {
    await AsyncStorage.setItem("jwt_token", token);
  } catch (error) {
    console.error("Error saving token to storage:", error);
  }
};

/**
 * Remove JWT token (e.g., on logout)
 */
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("jwt_token");
  } catch (error) {
    console.error("Error removing token from storage:", error);
  }
};

/**
 * Save user information to AsyncStorage
 * @param {object} user - User data object
 * @returns {Promise<void>}
 */
export const setUser = async (user) => {
  try {
    await AsyncStorage.setItem("user_info", JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user info to storage:", error);
  }
};

/**
 * Get user information from AsyncStorage
 * @returns {Promise<object|null>} the user object or null if not set
 */
export const getUser = async () => {
  try {
    const userJson = await AsyncStorage.getItem("user_info");
    console.log("User info retrieved from storage:", userJson);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error("Error getting user info from storage:", error);
    return null;
  }
};

/**
 * Utility function to see all keys and values in AsyncStorage (for debugging)
 * Logs all key-value pairs to the console
 * @returns {Promise<void>}
 * Note: Use this function only for debugging purposes, as it may expose sensitive information in the console
 * Make sure to remove or comment out calls to this function in production code
 */
export const seeStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    console.log("AsyncStorage contents:", items);
  } catch (error) {
    console.error("Error reading AsyncStorage:", error);
  }
};