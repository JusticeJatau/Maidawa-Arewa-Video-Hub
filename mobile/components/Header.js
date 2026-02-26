import React, { useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Header = ({ onLoginPress, onSearch }) => {
  const { theme } = useTheme();

  const navigation = useNavigation();
  const { isLoggedIn } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (text) => {
    setSearchQuery(text);
    onSearch?.(text);
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      paddingTop: 8,
      paddingBottom: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      letterSpacing: 0.5,
    },
    actionButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    iconButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: theme.surface,
    },
    loginButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary,
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 25,
      gap: 6,
    },
    loginButtonText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: '600',
    },
    avatarButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: 'bold',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 30,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    searchInput: {
      flex: 1,
      marginLeft: 12,
      color: theme.text,
      fontSize: 16,
      padding: 0,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerTop}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="play-circle-filled" size={32} color={theme.primary} />
          <Text style={styles.title}>MA Video Hub</Text>
        </View>
        
        <View style={styles.actionButtons}>
          
          {!isLoggedIn ? (
            <TouchableOpacity onPress={onLoginPress} style={styles.loginButton}>
              <MaterialIcons name="person-outline" size={18} color="#fff" />
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.avatarButton}>
              <Text style={styles.avatarText}>JD</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleSettingsPress} style={styles.iconButton}>
            <MaterialIcons name="settings" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={22} color={theme.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search videos..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
          returnKeyType="search"
          onSubmitEditing={() => onSearch?.(searchQuery)}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <MaterialIcons name="close" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;