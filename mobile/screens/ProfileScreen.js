import React, { useState, useContext, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  
  const { user, logout, isLoggedIn } = useContext(AuthContext);
  
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Profile data states
  const [profileImage, setProfileImage] = useState(user?.avatar || null);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.fullName || 'John Doe',
    username: user?.username || '@johndoe',
    email: user?.email || 'john.doe@example.com',
    bio: user?.bio || 'News enthusiast | Always staying informed',
  });
  
  const [contactInfo, setContactInfo] = useState({
    phone: user?.phone || '+1 234 567 8900',
    address: user?.address || '123 News Street, Media City',
    country: user?.country || 'United States',
    city: user?.city || 'New York',
  });
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    saveHistory: true,
  });

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to allow access to your photos to change profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    // Here you would make API call to save changes
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancel = () => {
    // Reset to original values
    setIsEditing(false);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigation.replace('Login');
  };

  const renderSectionHeader = (title, icon, onEdit) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleContainer}>
        <View style={[styles.iconContainer, { backgroundColor: theme.surfaceLight }]}>
          <MaterialIcons name={icon} size={20} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {!isEditing && onEdit && (
        <TouchableOpacity onPress={onEdit} style={styles.editButton} activeOpacity={0.7}>
          <MaterialIcons name="edit" size={18} color={theme.primary} />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderInfoRow = (label, value, icon, field, multiline = false) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLabelContainer}>
        <MaterialIcons name={icon} size={16} color={theme.textTertiary} />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      {isEditing ? (
        <TextInput
          style={[styles.infoInput, multiline && styles.multilineInput]}
          value={value}
          onChangeText={(text) => {
            if (field.includes('.')) {
              const [section, key] = field.split('.');
              if (section === 'personal') {
                setPersonalInfo(prev => ({ ...prev, [key]: text }));
              } else if (section === 'contact') {
                setContactInfo(prev => ({ ...prev, [key]: text }));
              }
            }
          }}
          placeholderTextColor={theme.textTertiary}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
        />
      ) : (
        <Text style={styles.infoValue}>{value || 'Not provided'}</Text>
      )}
    </View>
  );

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
        <Text style={styles.headerTitle}>Profile</Text>
        {isEditing ? (
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton} activeOpacity={0.7}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton} activeOpacity={0.7}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image Section */}
        <View style={styles.profileImageSection}>
          <TouchableOpacity 
            onPress={handleImagePick}
            disabled={!isEditing}
            style={styles.profileImageContainer}
            activeOpacity={0.8}
          >
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImagePlaceholderText}>
                  {personalInfo.fullName.charAt(0)}
                </Text>
              </View>
            )}
            {isEditing && (
              <View style={styles.cameraIconContainer}>
                <MaterialIcons name="camera-alt" size={18} color={theme.text} />
              </View>
            )}
          </TouchableOpacity>
          {!isEditing && (
            <>
              <Text style={styles.profileName}>{personalInfo.fullName}</Text>
              <Text style={styles.memberSince}>Member since 2024</Text>
            </>
          )}
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          {renderSectionHeader(
            'Personal Information', 
            'person-outline',
            () => setIsEditing(true)
          )}
          <View style={styles.sectionContent}>
            {renderInfoRow('Full Name', personalInfo.fullName, 'badge', 'personal.fullName')}
            {renderInfoRow('Username', personalInfo.username, 'alternate-email', 'personal.username')}
            {renderInfoRow('Email', personalInfo.email, 'email', 'personal.email')}
            {renderInfoRow('Bio', personalInfo.bio, 'description', 'personal.bio', true)}
          </View>
        </View>

        {/* Contact Information Section */}
        <View style={styles.section}>
          {renderSectionHeader('Contact Information', 'phone', () => setIsEditing(true))}
          <View style={styles.sectionContent}>
            {renderInfoRow('Phone', contactInfo.phone, 'phone', 'contact.phone')}
            {renderInfoRow('Address', contactInfo.address, 'location-on', 'contact.address')}
            {renderInfoRow('City', contactInfo.city, 'location-city', 'contact.city')}
            {renderInfoRow('Country', contactInfo.country, 'public', 'contact.country')}
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          {renderSectionHeader('Preferences', 'settings', null)}
          <View style={styles.sectionContent}>
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLeft}>
                <View style={[styles.iconContainer, { backgroundColor: theme.surfaceLight }]}>
                  <MaterialIcons name="notifications" size={18} color={theme.primary} />
                </View>
                <Text style={styles.preferenceLabel}>Email Notifications</Text>
              </View>
              <Switch
                value={preferences.emailNotifications}
                onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, emailNotifications: value }))
                }
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.text}
                ios_backgroundColor={theme.border}
              />
            </View>

            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLeft}>
                <View style={[styles.iconContainer, { backgroundColor: theme.surfaceLight }]}>
                  <MaterialIcons name="notifications-active" size={18} color={theme.primary} />
                </View>
                <Text style={styles.preferenceLabel}>Push Notifications</Text>
              </View>
              <Switch
                value={preferences.pushNotifications}
                onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, pushNotifications: value }))
                }
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.text}
                ios_backgroundColor={theme.border}
              />
            </View>

            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLeft}>
                <View style={[styles.iconContainer, { backgroundColor: theme.surfaceLight }]}>
                  <MaterialIcons name="history" size={18} color={theme.primary} />
                </View>
                <Text style={styles.preferenceLabel}>Save Watch History</Text>
              </View>
              <Switch
                value={preferences.saveHistory}
                onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, saveHistory: value }))
                }
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.text}
                ios_backgroundColor={theme.border}
              />
            </View>
          </View>
        </View>

        {/* Account Actions Section */}
        <View style={styles.section}>
          {renderSectionHeader('Account', 'security', null)}
          <View style={styles.sectionContent}>
            <TouchableOpacity style={styles.accountAction} activeOpacity={0.7}>
              <View style={styles.actionLeft}>
                <View style={[styles.iconContainer, { backgroundColor: theme.surfaceLight }]}>
                  <MaterialIcons name="lock" size={18} color={theme.textSecondary} />
                </View>
                <Text style={styles.actionLabel}>Change Password</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={theme.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.accountAction} activeOpacity={0.7}>
              <View style={styles.actionLeft}>
                <View style={[styles.iconContainer, { backgroundColor: theme.surfaceLight }]}>
                  <MaterialIcons name="privacy-tip" size={18} color={theme.textSecondary} />
                </View>
                <Text style={styles.actionLabel}>Privacy Settings</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={theme.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.accountAction} activeOpacity={0.7}>
              <View style={styles.actionLeft}>
                <View style={[styles.iconContainer, { backgroundColor: theme.surfaceLight }]}>
                  <MaterialIcons name="help" size={18} color={theme.textSecondary} />
                </View>
                <Text style={styles.actionLabel}>Help & Support</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={theme.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.accountAction, styles.logoutAction]}
              onPress={() => setShowLogoutModal(true)}
              activeOpacity={0.7}
            >
              <View style={styles.actionLeft}>
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 69, 58, 0.1)' }]}>
                  <MaterialIcons name="logout" size={18} color={theme.danger} />
                </View>
                <Text style={styles.logoutLabel}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>MA Video Hub v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2024 All rights reserved</Text>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <MaterialIcons name="logout" size={40} color={theme.danger} />
            </View>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout from your account?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.modalConfirmText}>Yes, Logout</Text>
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    color: theme.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: theme.primary,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  saveButtonText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  profileImageSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: theme.surface,
    marginBottom: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.primary,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.primary,
  },
  profileImagePlaceholderText: {
    color: theme.text,
    fontSize: 40,
    fontWeight: 'bold',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.surfaceLight,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.primary,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  memberSince: {
    color: theme.textTertiary,
    fontSize: 14,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editButtonText: {
    color: theme.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionContent: {
    backgroundColor: theme.surface,
    paddingHorizontal: 16,
  },
  infoRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  infoLabel: {
    color: theme.textTertiary,
    fontSize: 13,
    fontWeight: '500',
  },
  infoValue: {
    color: theme.text,
    fontSize: 16,
    marginLeft: 22,
  },
  infoInput: {
    color: theme.text,
    fontSize: 16,
    padding: 8,
    backgroundColor: theme.background,
    borderRadius: 8,
    marginLeft: 22,
    borderWidth: 1,
    borderColor: theme.border,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  preferenceLabel: {
    color: theme.text,
    fontSize: 15,
  },
  accountAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionLabel: {
    color: theme.text,
    fontSize: 15,
  },
  logoutAction: {
    borderBottomWidth: 0,
  },
  logoutLabel: {
    color: theme.danger,
    fontSize: 15,
    fontWeight: '500',
  },
  appInfo: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  appVersion: {
    color: theme.textTertiary,
    fontSize: 14,
    marginBottom: 4,
  },
  appCopyright: {
    color: theme.textTertiary,
    fontSize: 12,
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
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;