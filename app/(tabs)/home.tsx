import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  Camera, 
  Clock, 
  Calendar,
  Video,
  ChevronRight,
  Brain,
  Zap,
  Play,
  GraduationCap,
  Target,
  Trophy
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import data
import messagesData from '@/data/messages.json';

interface UserProfile {
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  class: string;
  country: string;
  state: string;
  educationBoard: string;
}

interface LiveClass {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  date: string;
  time: string;
  duration: string;
  isLive: boolean;
  canJoin: boolean;
  thumbnail: string;
}

const SAMPLE_CLASSES: LiveClass[] = [
  {
    id: '1',
    title: 'Advanced Calculus: Derivatives and Applications',
    subject: 'Mathematics',
    teacher: 'Dr. Sarah Johnson',
    date: 'Today',
    time: '2:00 PM',
    duration: '60 min',
    isLive: false,
    canJoin: true,
    thumbnail: 'https://images.pexels.com/photos/6256065/pexels-photo-6256065.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    title: 'Organic Chemistry: Reaction Mechanisms',
    subject: 'Chemistry',
    teacher: 'Prof. Michael Chen',
    date: 'Tomorrow',
    time: '10:30 AM',
    duration: '45 min',
    isLive: false,
    canJoin: false,
    thumbnail: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    title: 'Physics: Electromagnetic Waves',
    subject: 'Physics',
    teacher: 'Dr. Emily Rodriguez',
    date: 'Jan 18',
    time: '4:00 PM',
    duration: '50 min',
    isLive: false,
    canJoin: false,
    thumbnail: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function HomeScreen() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greetingMessage, setGreetingMessage] = useState('');
  const [motivationalMessage, setMotivationalMessage] = useState('');

  useEffect(() => {
    loadUserProfile();
    loadMessages();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const loadUserProfile = async () => {
    try {
      const profileData = await AsyncStorage.getItem('userProfile');
      if (profileData) {
        setUserProfile(JSON.parse(profileData));
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const loadMessages = () => {
    try {
      // Get time-based greeting
      const hour = new Date().getHours();
      let timeOfDay: 'morning' | 'afternoon' | 'evening';
      
      if (hour < 12) {
        timeOfDay = 'morning';
      } else if (hour < 17) {
        timeOfDay = 'afternoon';
      } else {
        timeOfDay = 'evening';
      }

      const greetings = messagesData.greetings[timeOfDay];
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      setGreetingMessage(randomGreeting);

      // Get motivational message
      const motivationalMessages = messagesData.motivational;
      const randomMotivational = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      setMotivationalMessage(randomMotivational);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setGreetingMessage('Ready to learn something new today?');
      setMotivationalMessage('Every expert was once a beginner. Keep going! 💪');
    }
  };

  const handleStartScan = () => {
    router.push('/(tabs)');
  };

  const handleJoinClass = (classItem: LiveClass) => {
    if (classItem.canJoin) {
      // In a real app, this would open the live class
      console.log('Joining class:', classItem.title);
    }
  };

  const handleViewAllClasses = () => {
    // Navigate to full class schedule
    console.log('View all classes');
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      'Mathematics': '#2563EB',
      'Chemistry': '#059669',
      'Physics': '#EA580C',
      'Biology': '#7C3AED',
      'English': '#DC2626',
      'History': '#B45309',
    };
    return colors[subject] || '#6B7280';
  };

  const stats = [
    { label: 'Problems Solved', value: '127', icon: Trophy, color: '#EA580C' },
    { label: 'Study Time', value: '45h', icon: Clock, color: '#059669' },
    { label: 'Accuracy', value: '89%', icon: Target, color: '#2563EB' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Time-based Greeting */}
        <View style={styles.header}>
          <View style={styles.welcomeSection}>
            <Text style={styles.greeting}>
              {userProfile ? `Hello, ${userProfile.firstName}!` : 'Hello, Student!'}
            </Text>
            <Text style={styles.greetingMessage}>{greetingMessage}</Text>
            <Text style={styles.motivationalMessage}>{motivationalMessage}</Text>
          </View>
        </View>

        {/* Upcoming Live Classes - Moved to Top */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Video size={20} color="#2563EB" />
              <Text style={styles.sectionTitle}>Upcoming Live Classes</Text>
            </View>
            <TouchableOpacity onPress={handleViewAllClasses}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.classesContainer}
            contentContainerStyle={styles.classesContent}
          >
            {SAMPLE_CLASSES.map((classItem) => (
              <View key={classItem.id} style={styles.classCard}>
                <View style={styles.classImageContainer}>
                  <Image 
                    source={{ uri: classItem.thumbnail }} 
                    style={styles.classImage}
                  />
                  <View style={[
                    styles.subjectBadge, 
                    { backgroundColor: getSubjectColor(classItem.subject) }
                  ]}>
                    <Text style={styles.subjectText}>{classItem.subject}</Text>
                  </View>
                  {classItem.isLive && (
                    <View style={styles.liveBadge}>
                      <View style={styles.liveIndicator} />
                      <Text style={styles.liveText}>LIVE</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.classInfo}>
                  <Text style={styles.classTitle} numberOfLines={2}>
                    {classItem.title}
                  </Text>
                  <Text style={styles.teacherName}>by {classItem.teacher}</Text>
                  
                  <View style={styles.classSchedule}>
                    <View style={styles.scheduleItem}>
                      <Calendar size={14} color="#6B7280" />
                      <Text style={styles.scheduleText}>{classItem.date}</Text>
                    </View>
                    <View style={styles.scheduleItem}>
                      <Clock size={14} color="#6B7280" />
                      <Text style={styles.scheduleText}>
                        {classItem.time} • {classItem.duration}
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={[
                      styles.joinButton,
                      !classItem.canJoin && styles.joinButtonDisabled
                    ]}
                    onPress={() => handleJoinClass(classItem)}
                    disabled={!classItem.canJoin}
                  >
                    <Play size={16} color="#FFFFFF" />
                    <Text style={styles.joinButtonText}>
                      {classItem.canJoin ? 'Join Class' : 'Scheduled'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Divider with proper spacing */}
        <View style={styles.divider} />

        {/* User Statistics - Moved Below Classes with proper spacing */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                    <IconComponent size={20} color="#FFFFFF" />
                  </View>
                  <Text style={styles.statNumber}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Start Scan Card */}
        <TouchableOpacity style={styles.scanCard} onPress={handleStartScan}>
          <View style={styles.scanCardContent}>
            <View style={styles.scanCardLeft}>
              <View style={styles.scanIcon}>
                <Camera size={32} color="#FFFFFF" />
              </View>
              <View style={styles.scanTextContainer}>
                <Text style={styles.scanTitle}>Start AI Scan</Text>
                <Text style={styles.scanSubtitle}>
                  Scan your study materials for instant AI assistance
                </Text>
              </View>
            </View>
            <ChevronRight size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  welcomeSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  greetingMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
    marginBottom: 8,
    lineHeight: 24,
  },
  motivationalMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginLeft: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  classesContainer: {
    marginHorizontal: -24,
  },
  classesContent: {
    paddingHorizontal: 24,
  },
  classCard: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  classImageContainer: {
    position: 'relative',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  classImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  subjectBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subjectText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  classInfo: {
    padding: 16,
  },
  classTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 22,
  },
  teacherName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  classSchedule: {
    marginBottom: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  scheduleText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 6,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 8,
  },
  joinButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  joinButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 24,
    marginVertical: 24,
  },
  statsSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
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
  statNumber: {
    fontSize: 20,
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
  scanCard: {
    backgroundColor: '#2563EB',
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  scanCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scanCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scanIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  scanTextContainer: {
    flex: 1,
  },
  scanTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  scanSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
});