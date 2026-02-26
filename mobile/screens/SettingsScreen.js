import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  SectionList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = ({ navigation }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  
  // Create styles with theme
  const styles = useMemo(() => createStyles(theme), [theme]);
  
  // Local states
  const [autoPlay, setAutoPlay] = useState(true);
  const [highQuality, setHighQuality] = useState(false);
  const [downloadOverWifi, setDownloadOverWifi] = useState(true);
  const [notifications, setNotifications] = useState({
    breakingNews: true,
    recommendations: true,
    comments: false,
    updates: true,
  });

  const [clearCacheModal, setClearCacheModal] = useState(false);
  const [cacheSize, setCacheSize] = useState('124 MB');

  const handleClearCache = () => {
    setClearCacheModal(false);
    // Simulate cache clearing
    setTimeout(() => {
      Alert.alert('Success', 'Cache cleared successfully!');
      setCacheSize('0 MB');
    }, 1000);
  };

  const renderSectionHeader = ({ section: { title, icon } }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleContainer}>
        <MaterialIcons name={icon} size={22} color={theme.primary} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
    </View>
  );

  const renderSettingItem = ({ item }) => {
    if (item.type === 'switch') {
      return (
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: theme.surfaceLight }]}>
              <MaterialIcons name={item.icon} size={22} color={theme.primary} />
            </View>
            <View style={styles.settingTexts}>
              <Text style={styles.settingTitle}>{item.title}</Text>
              {item.description && (
                <Text style={styles.settingDescription}>
                  {item.description}
                </Text>
              )}
            </View>
          </View>
          <Switch
            value={item.value}
            onValueChange={item.onChange}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={theme.text}
            ios_backgroundColor={theme.border}
          />
        </View>
      );
    } else if (item.type === 'select') {
      return (
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={item.onPress}
          activeOpacity={0.7}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: theme.surfaceLight }]}>
              <MaterialIcons name={item.icon} size={22} color={theme.primary} />
            </View>
            <View style={styles.settingTexts}>
              <Text style={styles.settingTitle}>{item.title}</Text>
              {item.value && (
                <Text style={styles.settingValue}>
                  {item.value}
                </Text>
              )}
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={theme.textTertiary} />
        </TouchableOpacity>
      );
    } else if (item.type === 'action') {
      return (
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={item.onPress}
          activeOpacity={0.7}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { 
              backgroundColor: item.danger ? 'rgba(255, 69, 58, 0.1)' : theme.surfaceLight 
            }]}>
              <MaterialIcons 
                name={item.icon} 
                size={22} 
                color={item.danger ? theme.danger : theme.primary} 
              />
            </View>
            <Text style={[
              styles.settingTitle, 
              item.danger && styles.dangerText
            ]}>
              {item.title}
            </Text>
          </View>
          {item.rightText && (
            <Text style={styles.settingRightText}>
              {item.rightText}
            </Text>
          )}
        </TouchableOpacity>
      );
    }
  };

  const sections = [
    {
      title: 'Appearance',
      icon: 'palette',
      data: [
        {
          type: 'switch',
          icon: isDarkMode ? 'nightlight-round' : 'wb-sunny',
          title: 'Dark Mode',
          description: 'Toggle between light and dark theme',
          value: isDarkMode,
          onChange: toggleTheme,
        },
        {
          type: 'select',
          icon: 'format-size',
          title: 'Text Size',
          value: 'Medium',
          onPress: () => Alert.alert('Coming Soon', 'Text size customization coming in next update!'),
        },
        {
          type: 'select',
          icon: 'color-lens',
          title: 'Theme Color',
          value: 'Blue',
          onPress: () => Alert.alert('Coming Soon', 'Custom theme colors coming soon!'),
        },
      ],
    },
    {
      title: 'Video Settings',
      icon: 'play-circle',
      data: [
        {
          type: 'switch',
          icon: 'play-arrow',
          title: 'Auto-play Videos',
          description: 'Automatically play videos in feed',
          value: autoPlay,
          onChange: setAutoPlay,
        },
        {
          type: 'switch',
          icon: 'hd',
          title: 'High Quality on Mobile Data',
          description: 'Use higher video quality on cellular',
          value: highQuality,
          onChange: setHighQuality,
        },
        {
          type: 'switch',
          icon: 'wifi',
          title: 'Download over Wi-Fi only',
          description: 'Save videos only when connected to Wi-Fi',
          value: downloadOverWifi,
          onChange: setDownloadOverWifi,
        },
      ],
    },
    {
      title: 'Notifications',
      icon: 'notifications',
      data: [
        {
          type: 'switch',
          icon: 'new-releases',
          title: 'Breaking News',
          description: 'Get notified for important news',
          value: notifications.breakingNews,
          onChange: (value) => setNotifications(prev => ({ ...prev, breakingNews: value })),
        },
        {
          type: 'switch',
          icon: 'recommend',
          title: 'Recommendations',
          description: 'Get personalized video suggestions',
          value: notifications.recommendations,
          onChange: (value) => setNotifications(prev => ({ ...prev, recommendations: value })),
        },
        {
          type: 'switch',
          icon: 'comment',
          title: 'Comments',
          description: 'Get notified when someone replies',
          value: notifications.comments,
          onChange: (value) => setNotifications(prev => ({ ...prev, comments: value })),
        },
        {
          type: 'switch',
          icon: 'update',
          title: 'App Updates',
          description: 'Get notified about new features',
          value: notifications.updates,
          onChange: (value) => setNotifications(prev => ({ ...prev, updates: value })),
        },
      ],
    },
    {
      title: 'Storage & Data',
      icon: 'storage',
      data: [
        {
          type: 'action',
          icon: 'delete',
          title: 'Clear Cache',
          rightText: cacheSize,
          onPress: () => setClearCacheModal(true),
        },
        {
          type: 'select',
          icon: 'download',
          title: 'Download Location',
          value: 'Internal Storage',
          onPress: () => Alert.alert('Coming Soon', 'Download location selection coming soon!'),
        },
        {
          type: 'select',
          icon: 'save-alt',
          title: 'Save Videos',
          value: 'Save for offline',
          onPress: () => Alert.alert('Coming Soon', 'Offline download feature coming soon!'),
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: 'security',
      data: [
        {
          type: 'select',
          icon: 'history',
          title: 'Watch History',
          value: 'Saving history',
          onPress: () => Alert.alert('Coming Soon', 'Watch history settings coming soon!'),
        },
        {
          type: 'select',
          icon: 'search',
          title: 'Search History',
          value: 'Saving searches',
          onPress: () => Alert.alert('Coming Soon', 'Search history settings coming soon!'),
        },
        {
          type: 'select',
          icon: 'cookie',
          title: 'Cookie Settings',
          onPress: () => Alert.alert('Coming Soon', 'Cookie preferences coming soon!'),
        },
        {
          type: 'switch',
          icon: 'lock',
          title: 'Private Mode',
          description: 'Don\'t save watch history',
          value: false,
          onChange: () => Alert.alert('Coming Soon', 'Private mode coming soon!'),
        },
      ],
    },
    {
      title: 'About',
      icon: 'info',
      data: [
        {
          type: 'action',
          icon: 'info',
          title: 'App Version',
          rightText: '1.0.0',
          onPress: () => {},
        },
        {
          type: 'action',
          icon: 'code',
          title: 'Terms of Service',
          onPress: () => Alert.alert('Terms of Service', 'Terms will be displayed here'),
        },
        {
          type: 'action',
          icon: 'policy',
          title: 'Privacy Policy',
          onPress: () => Alert.alert('Privacy Policy', 'Privacy policy will be displayed here'),
        },
        {
          type: 'action',
          icon: 'feedback',
          title: 'Send Feedback',
          onPress: () => Alert.alert('Feedback', 'Feedback form will open here'),
        },
        {
          type: 'action',
          icon: 'star',
          title: 'Rate App',
          onPress: () => Alert.alert('Rate App', 'Redirect to app store'),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.title + index}
        renderItem={renderSettingItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Clear Cache Modal */}
      <Modal
        visible={clearCacheModal}
        transparent
        animationType="fade"
        onRequestClose={() => setClearCacheModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <MaterialIcons name="delete" size={40} color={theme.danger} />
            </View>
            <Text style={styles.modalTitle}>Clear Cache</Text>
            <Text style={styles.modalMessage}>
              This will clear all cached videos and images ({cacheSize}). 
              You'll need to download them again when watching.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setClearCacheModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={handleClearCache}
                activeOpacity={0.7}
              >
                <Text style={styles.modalConfirmText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: theme.background,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
  },
  placeholder: {
    width: 40,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: theme.surface,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTexts: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: theme.textTertiary,
  },
  settingValue: {
    fontSize: 13,
    color: theme.textTertiary,
  },
  settingRightText: {
    fontSize: 14,
    color: theme.textTertiary,
  },
  dangerText: {
    color: theme.danger,
  },
  separator: {
    height: 1,
    backgroundColor: theme.border,
    marginLeft: 68,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.surface,
    borderRadius: 20,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  modalIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.border,
  },
  modalCancelText: {
    color: theme.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  modalConfirmButton: {
    backgroundColor: theme.danger,
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;