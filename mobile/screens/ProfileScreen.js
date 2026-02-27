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
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');

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

  const SectionCard = ({ children, style }) => (
    <View style={[styles.sectionCard, style]}>
      {children}
    </View>
  );

  const SectionHeader = ({ title, icon, onEdit }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleContainer}>
        <View style={[styles.iconCircle, { backgroundColor: theme.primary + '20' }]}>
          <MaterialIcons name={icon} size={22} color={theme.primary} />
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

  const InfoRow = ({ label, value, icon, field, multiline = false }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIconContainer}>
        <MaterialIcons name={icon} size={18} color={theme.textTertiary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
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
    </View>
  );

  const PreferenceItem = ({ icon, label, value, onValueChange }) => (
    <View style={styles.preferenceItem}>
      <View style={styles.preferenceLeft}>
        <View style={[styles.iconCircle, { backgroundColor: theme.primary + '20', width: 40, height: 40 }]}>
          <MaterialIcons name={icon} size={20} color={theme.primary} />
        </View>
        <Text style={styles.preferenceLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.border, true: theme.primary }}
        thumbColor={theme.text}
        ios_backgroundColor={theme.border}
      />
    </View>
  );

  const ActionItem = ({ icon, label, onPress, danger = false, rightText }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.actionLeft}>
        <View style={[styles.iconCircle, { 
          backgroundColor: danger ? theme.danger + '20' : theme.primary + '20',
          width: 40,
          height: 40
        }]}>
          <MaterialIcons name={icon} size={20} color={danger ? theme.danger : theme.primary} />
        </View>
        <Text style={[styles.actionLabel, danger && styles.dangerLabel]}>{label}</Text>
      </View>
      {rightText ? (
        <Text style={styles.actionRightText}>{rightText}</Text>
      ) : (
        <MaterialIcons name="chevron-right" size={22} color={theme.textTertiary} />
      )}
    </TouchableOpacity>
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
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header Card */}
        <View style={styles.profileHeaderCard}>
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
                <MaterialIcons name="camera-alt" size={16} color={theme.text} />
              </View>
            )}
          </TouchableOpacity>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{personalInfo.fullName}</Text>
            <Text style={styles.profileUsername}>{personalInfo.username}</Text>
            <View style={styles.memberBadge}>
              <MaterialIcons name="calendar-today" size={14} color={theme.textTertiary} />
              <Text style={styles.memberSince}>Member since 2024</Text>
            </View>
          </View>
        </View>

        {/* Personal Information Section */}
        <SectionCard>
          <SectionHeader
            title="Personal Information"
            icon="person-outline"
            onEdit={() => setIsEditing(true)}
          />
          <View style={styles.sectionContent}>
            <InfoRow label="Full Name" value={personalInfo.fullName} icon="badge" field="personal.fullName" />
            <InfoRow label="Username" value={personalInfo.username} icon="alternate-email" field="personal.username" />
            <InfoRow label="Email" value={personalInfo.email} icon="email" field="personal.email" />
            <InfoRow label="Bio" value={personalInfo.bio} icon="description" field="personal.bio" multiline />
          </View>
        </SectionCard>

        {/* Contact Information Section */}
        <SectionCard>
          <SectionHeader
            title="Contact Information"
            icon="phone"
            onEdit={() => setIsEditing(true)}
          />
          <View style={styles.sectionContent}>
            <InfoRow label="Phone" value={contactInfo.phone} icon="phone" field="contact.phone" />
            <InfoRow label="Address" value={contactInfo.address} icon="location-on" field="contact.address" />
            <InfoRow label="City" value={contactInfo.city} icon="location-city" field="contact.city" />
            <InfoRow label="Country" value={contactInfo.country} icon="public" field="contact.country" />
          </View>
        </SectionCard>

        {/* Preferences Section */}
        <SectionCard>
          <SectionHeader title="Preferences" icon="settings" />
          <View style={styles.sectionContent}>
            <PreferenceItem
              icon="notifications"
              label="Email Notifications"
              value={preferences.emailNotifications}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, emailNotifications: value }))}
            />
            <PreferenceItem
              icon="notifications-active"
              label="Push Notifications"
              value={preferences.pushNotifications}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, pushNotifications: value }))}
            />
            <PreferenceItem
              icon="history"
              label="Save Watch History"
              value={preferences.saveHistory}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, saveHistory: value }))}
            />
          </View>
        </SectionCard>

        {/* Account Actions Section */}
        <SectionCard>
          <SectionHeader title="Account" icon="security" />
          <View style={styles.sectionContent}>
            <ActionItem
              icon="lock"
              label="Change Password"
              onPress={() => Alert.alert('Coming Soon', 'Password change coming soon!')}
            />
            <ActionItem
              icon="privacy-tip"
              label="Privacy Settings"
              onPress={() => Alert.alert('Coming Soon', 'Privacy settings coming soon!')}
            />
            <ActionItem
              icon="help"
              label="Help & Support"
              onPress={() => Alert.alert('Coming Soon', 'Help center coming soon!')}
            />
            <ActionItem
              icon="logout"
              label="Logout"
              danger
              onPress={() => setShowLogoutModal(true)}
            />
          </View>
        </SectionCard>

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
            <View style={[styles.modalIconCircle, { backgroundColor: theme.danger + '20' }]}>
              <MaterialIcons name="logout" size={32} color={theme.danger} />
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: theme.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    fontSize: 15,
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
    fontSize: 15,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  profileHeaderCard: {
    backgroundColor: theme.surface,
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: theme.primary,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.primary,
  },
  profileImagePlaceholderText: {
    color: theme.text,
    fontSize: 32,
    fontWeight: 'bold',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.surfaceLight,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.primary,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberSince: {
    color: theme.textTertiary,
    fontSize: 12,
  },
  sectionCard: {
    backgroundColor: theme.surface,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.primary + '20',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  editButtonText: {
    color: theme.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  sectionContent: {
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  infoIconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: theme.textTertiary,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    color: theme.text,
    fontSize: 16,
    lineHeight: 22,
  },
  infoInput: {
    color: theme.text,
    fontSize: 16,
    padding: 10,
    backgroundColor: theme.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    marginTop: 4,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  preferenceItem: {
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
    fontWeight: '500',
  },
  actionItem: {
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
    fontWeight: '500',
  },
  dangerLabel: {
    color: theme.danger,
  },
  actionRightText: {
    color: theme.textTertiary,
    fontSize: 14,
  },
  appInfo: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  appVersion: {
    color: theme.textTertiary,
    fontSize: 13,
    marginBottom: 4,
  },
  appCopyright: {
    color: theme.textTertiary,
    fontSize: 11,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.surface,
    borderRadius: 28,
    padding: 24,
    width: width * 0.85,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 15,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.border,
  },
  modalCancelText: {
    color: theme.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  modalConfirmButton: {
    backgroundColor: theme.danger,
  },
  modalConfirmText: {
    color: theme.text,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ProfileScreen;