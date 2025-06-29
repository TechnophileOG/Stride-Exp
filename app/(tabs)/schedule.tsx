import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  Calendar, 
  Clock, 
  Video, 
  User, 
  Bell,
  ExternalLink,
  Play,
  Users,
  BookOpen,
  Zap
} from 'lucide-react-native';

interface GoogleMeetClass {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  meetLink: string;
  teacher: {
    name: string;
    email: string;
    avatar?: string;
  };
  subject: string;
  isLive: boolean;
  isUpcoming: boolean;
  attendeeCount?: number;
  recordingAvailable?: boolean;
  youtubeRecordingUrl?: string;
}

// Sample data - In production, this would come from Google Calendar API
const SAMPLE_CLASSES: GoogleMeetClass[] = [
  {
    id: '1',
    title: 'Advanced Calculus: Derivatives and Applications',
    description: 'Deep dive into derivative applications in real-world scenarios',
    startTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    endTime: new Date(Date.now() + 90 * 60 * 1000), // 90 minutes from now
    meetLink: 'https://meet.google.com/abc-defg-hij',
    teacher: {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    subject: 'Mathematics',
    isLive: false,
    isUpcoming: true,
    attendeeCount: 24,
    recordingAvailable: false
  },
  {
    id: '2',
    title: 'Organic Chemistry: Reaction Mechanisms',
    description: 'Understanding complex organic reaction pathways',
    startTime: new Date(Date.now() - 30 * 60 * 1000), // Started 30 minutes ago
    endTime: new Date(Date.now() + 30 * 60 * 1000), // Ends in 30 minutes
    meetLink: 'https://meet.google.com/xyz-uvwx-yz',
    teacher: {
      name: 'Prof. Michael Chen',
      email: 'michael.chen@school.edu',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    subject: 'Chemistry',
    isLive: true,
    isUpcoming: false,
    attendeeCount: 18,
    recordingAvailable: false
  },
  {
    id: '3',
    title: 'Physics: Electromagnetic Waves',
    description: 'Exploring wave properties and electromagnetic spectrum',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
    meetLink: 'https://meet.google.com/pqr-stuv-wxy',
    teacher: {
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@school.edu',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    subject: 'Physics',
    isLive: false,
    isUpcoming: true,
    attendeeCount: 0,
    recordingAvailable: false
  },
  {
    id: '4',
    title: 'Biology: Cell Division and Mitosis',
    description: 'Detailed study of cellular reproduction processes',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    endTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    meetLink: 'https://meet.google.com/def-ghij-klm',
    teacher: {
      name: 'Dr. Amanda Foster',
      email: 'amanda.foster@school.edu',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    subject: 'Biology',
    isLive: false,
    isUpcoming: false,
    attendeeCount: 22,
    recordingAvailable: true,
    youtubeRecordingUrl: 'https://youtube.com/watch?v=example1'
  }
];

export default function ScheduleScreen() {
  const [classes, setClasses] = useState<GoogleMeetClass[]>(SAMPLE_CLASSES);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateClassStatuses();
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const updateClassStatuses = () => {
    const now = new Date();
    setClasses(prevClasses => 
      prevClasses.map(cls => ({
        ...cls,
        isLive: now >= cls.startTime && now <= cls.endTime,
        isUpcoming: now < cls.startTime
      }))
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call to refresh Google Calendar data
    setTimeout(() => {
      updateClassStatuses();
      setRefreshing(false);
    }, 1000);
  };

  const handleJoinMeeting = (meetClass: GoogleMeetClass) => {
    if (meetClass.isLive || meetClass.isUpcoming) {
      // In a real app, this would open the Google Meet link
      Alert.alert(
        'Join Meeting',
        `Opening Google Meet for "${meetClass.title}"`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Join', 
            onPress: () => {
              // Open Google Meet link
              console.log('Opening:', meetClass.meetLink);
            }
          }
        ]
      );
    }
  };

  const handleViewRecording = (meetClass: GoogleMeetClass) => {
    if (meetClass.youtubeRecordingUrl) {
      Alert.alert(
        'View Recording',
        `Opening YouTube recording for "${meetClass.title}"`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Watch', 
            onPress: () => {
              console.log('Opening:', meetClass.youtubeRecordingUrl);
            }
          }
        ]
      );
    }
  };

  const navigateToAnnouncements = () => {
    router.push('/announcements');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (start: Date, end: Date) => {
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    return `${diffMins} min`;
  };

  const getTimeUntil = (date: Date) => {
    const diffMs = date.getTime() - currentTime.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    
    if (diffMins < 0) return 'Started';
    if (diffMins < 60) return `${diffMins}m`;
    
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
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

  // Separate classes by status
  const liveClasses = classes.filter(cls => cls.isLive);
  const upcomingClasses = classes.filter(cls => cls.isUpcoming);
  const pastClasses = classes.filter(cls => !cls.isLive && !cls.isUpcoming);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Calendar size={24} color="#2563EB" />
          <Text style={styles.headerTitle}>Class Schedule</Text>
        </View>
        <TouchableOpacity 
          style={styles.bellButton}
          onPress={navigateToAnnouncements}
        >
          <Bell size={20} color="#6B7280" />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Live Classes */}
        {liveClasses.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Zap size={20} color="#EF4444" />
                <Text style={styles.sectionTitle}>Live Now</Text>
              </View>
              <View style={styles.livePulse} />
            </View>

            {liveClasses.map((meetClass) => (
              <View key={meetClass.id} style={[styles.classCard, styles.liveCard]}>
                <View style={styles.cardHeader}>
                  <View style={styles.subjectBadge} style={[styles.subjectBadge, { backgroundColor: getSubjectColor(meetClass.subject) }]}>
                    <Text style={styles.subjectText}>{meetClass.subject}</Text>
                  </View>
                  <View style={styles.liveIndicator}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                </View>

                <Text style={styles.classTitle}>{meetClass.title}</Text>
                <Text style={styles.classDescription}>{meetClass.description}</Text>

                <View style={styles.teacherInfo}>
                  <View style={styles.teacherAvatar}>
                    <User size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.teacherDetails}>
                    <Text style={styles.teacherName}>{meetClass.teacher.name}</Text>
                    <Text style={styles.teacherEmail}>{meetClass.teacher.email}</Text>
                  </View>
                </View>

                <View style={styles.classMetrics}>
                  <View style={styles.metric}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.metricText}>
                      {formatTime(meetClass.startTime)} - {formatTime(meetClass.endTime)}
                    </Text>
                  </View>
                  <View style={styles.metric}>
                    <Users size={16} color="#6B7280" />
                    <Text style={styles.metricText}>{meetClass.attendeeCount} attending</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={[styles.joinButton, styles.liveJoinButton]}
                  onPress={() => handleJoinMeeting(meetClass)}
                >
                  <Video size={20} color="#FFFFFF" />
                  <Text style={styles.joinButtonText}>Join Live Class</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Upcoming Classes */}
        {upcomingClasses.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Clock size={20} color="#2563EB" />
                <Text style={styles.sectionTitle}>Upcoming</Text>
              </View>
            </View>

            {upcomingClasses.map((meetClass) => (
              <View key={meetClass.id} style={styles.classCard}>
                <View style={styles.cardHeader}>
                  <View style={[styles.subjectBadge, { backgroundColor: getSubjectColor(meetClass.subject) }]}>
                    <Text style={styles.subjectText}>{meetClass.subject}</Text>
                  </View>
                  <Text style={styles.timeUntil}>in {getTimeUntil(meetClass.startTime)}</Text>
                </View>

                <Text style={styles.classTitle}>{meetClass.title}</Text>
                <Text style={styles.classDescription}>{meetClass.description}</Text>

                <View style={styles.teacherInfo}>
                  <View style={styles.teacherAvatar}>
                    <User size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.teacherDetails}>
                    <Text style={styles.teacherName}>{meetClass.teacher.name}</Text>
                    <Text style={styles.teacherEmail}>{meetClass.teacher.email}</Text>
                  </View>
                </View>

                <View style={styles.classMetrics}>
                  <View style={styles.metric}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.metricText}>
                      {formatTime(meetClass.startTime)} - {formatTime(meetClass.endTime)}
                    </Text>
                  </View>
                  <View style={styles.metric}>
                    <BookOpen size={16} color="#6B7280" />
                    <Text style={styles.metricText}>{formatDuration(meetClass.startTime, meetClass.endTime)}</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.joinButton}
                  onPress={() => handleJoinMeeting(meetClass)}
                >
                  <ExternalLink size={20} color="#FFFFFF" />
                  <Text style={styles.joinButtonText}>Join When Ready</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Past Classes with Recordings */}
        {pastClasses.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Play size={20} color="#059669" />
                <Text style={styles.sectionTitle}>Recordings Available</Text>
              </View>
            </View>

            {pastClasses.filter(cls => cls.recordingAvailable).map((meetClass) => (
              <View key={meetClass.id} style={[styles.classCard, styles.pastCard]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.subjectBadge, { backgroundColor: getSubjectColor(meetClass.subject) }]}>
                    <Text style={styles.subjectText}>{meetClass.subject}</Text>
                  </View>
                  <View style={styles.recordingBadge}>
                    <Play size={12} color="#059669" />
                    <Text style={styles.recordingText}>Recorded</Text>
                  </View>
                </View>

                <Text style={styles.classTitle}>{meetClass.title}</Text>
                <Text style={styles.classDescription}>{meetClass.description}</Text>

                <View style={styles.teacherInfo}>
                  <View style={styles.teacherAvatar}>
                    <User size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.teacherDetails}>
                    <Text style={styles.teacherName}>{meetClass.teacher.name}</Text>
                    <Text style={styles.teacherEmail}>{meetClass.teacher.email}</Text>
                  </View>
                </View>

                <View style={styles.classMetrics}>
                  <View style={styles.metric}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.metricText}>
                      {formatTime(meetClass.startTime)} - {formatTime(meetClass.endTime)}
                    </Text>
                  </View>
                  <View style={styles.metric}>
                    <Users size={16} color="#6B7280" />
                    <Text style={styles.metricText}>{meetClass.attendeeCount} attended</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={[styles.joinButton, styles.recordingButton]}
                  onPress={() => handleViewRecording(meetClass)}
                >
                  <Play size={20} color="#FFFFFF" />
                  <Text style={styles.joinButtonText}>Watch Recording</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {classes.length === 0 && (
          <View style={styles.emptyState}>
            <Calendar size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Classes Scheduled</Text>
            <Text style={styles.emptyText}>
              Your Google Meet classes will appear here when scheduled
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginLeft: 8,
  },
  bellButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginLeft: 8,
  },
  livePulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
  },
  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  liveCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  pastCard: {
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  subjectText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
  },
  timeUntil: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  recordingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recordingText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#059669',
    marginLeft: 4,
  },
  classTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 24,
  },
  classDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  teacherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  teacherAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  teacherDetails: {
    flex: 1,
  },
  teacherName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  teacherEmail: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  classMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metricText: {
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
    paddingVertical: 12,
    borderRadius: 12,
  },
  liveJoinButton: {
    backgroundColor: '#EF4444',
  },
  recordingButton: {
    backgroundColor: '#059669',
  },
  joinButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});