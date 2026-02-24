// services/auth.js
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Get JWT token from AsyncStorage
 * @returns {Promise<string|null>} the token or null if not set
 */
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("jwt_token"); // key you use to store the JWT
    return token;
  } catch (error) {
    console.error("Error getting token from storage:", error);
    return null;
  }
};

/**
 * Save JWT token to AsyncStorage
 * @param {string} token
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