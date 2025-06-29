import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Shield, Bell, CircleHelp as HelpCircle, Settings, Download, Trash2, ChevronRight, Brain, Clock, Trophy, Target } from 'lucide-react-native';

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);

  const stats = [
    { label: 'Problems Solved', value: '127', icon: Trophy, color: '#EA580C' },
    { label: 'Study Sessions', value: '45', icon: Clock, color: '#2563EB' },
    { label: 'Concepts Learned', value: '23', icon: Brain, color: '#059669' },
    { label: 'Accuracy Rate', value: '89%', icon: Target, color: '#7C3AED' },
  ];

  const handleDeleteHistory = () => {
    Alert.alert(
      'Delete Study History',
      'Are you sure you want to delete all your study history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // In a real app, this would delete the history
            console.log('Deleting history...');
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    // In a real app, this would export user data
    Alert.alert('Export Data', 'Your study data has been exported successfully.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.profileTitle}>Study Profile</Text>
          <Text style={styles.profileSubtitle}>Your AI learning companion</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                    <IconComponent size={20} color="#FFFFFF" />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Privacy & Security</Text>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Offline-First Processing</Text>
            <Text style={styles.settingDescription}>
              All AI processing happens on your device for maximum privacy
            </Text>
            <Switch
              value={offlineMode}
              onValueChange={setOfflineMode}
              trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity style={styles.settingButton} onPress={handleDeleteHistory}>
            <Trash2 size={20} color="#EF4444" />
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: '#EF4444' }]}>Delete Study History</Text>
              <Text style={styles.settingDescription}>
                Permanently remove all saved queries and solutions
              </Text>
            </View>
            <ChevronRight size={16} color="#EF4444" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton} onPress={handleExportData}>
            <Download size={20} color="#059669" />
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: '#059669' }]}>Export My Data</Text>
              <Text style={styles.settingDescription}>
                Download all your study data and progress
              </Text>
            </View>
            <ChevronRight size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Settings size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>App Settings</Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Text style={styles.settingDescription}>
              Get notified about study reminders and new features
            </Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Auto-Save Solutions</Text>
            <Text style={styles.settingDescription}>
              Automatically save AI solutions to your history
            </Text>
            <Switch
              value={autoSave}
              onValueChange={setAutoSave}
              trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Help & Support */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <HelpCircle size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Help & Support</Text>
          </View>

          <TouchableOpacity style={styles.settingButton}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>How to Use AI Assistant</Text>
              <Text style={styles.settingDescription}>
                Learn how to get the best results from your AI tutor
              </Text>
            </View>
            <ChevronRight size={16} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Scanning Tips</Text>
              <Text style={styles.settingDescription}>
                Best practices for capturing clear study materials
              </Text>
            </View>
            <ChevronRight size={16} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>
                Learn how we protect your educational data
              </Text>
            </View>
            <ChevronRight size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>AI Study Assistant</Text>
          <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
          <Text style={styles.appInfoDescription}>
            Powered by Google's Gemma 3B model for offline-first AI learning assistance
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  profileTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginLeft: 8,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  settingButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  appInfoTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  appInfoVersion: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  appInfoDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});