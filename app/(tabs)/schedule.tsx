import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  Platform,
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, Video, User, Bell, ExternalLink, Play, Users, BookOpen, Zap, Filter, Download, Upload, Plus, CreditCard as Edit3, Trash2, MapPin, X, Save, Grid3x3, List, ChevronDown } from 'lucide-react-native';
import CalendarView from '@/components/CalendarView';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ClassEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  meetLink?: string;
  instructor: {
    name: string;
    email: string;
    avatar?: string;
  };
  subject: string;
  type: 'lecture' | 'lab' | 'seminar' | 'exam' | 'assignment';
  isLive: boolean;
  isUpcoming: boolean;
  attendeeCount?: number;
  recordingAvailable?: boolean;
  recordingUrl?: string;
  materials?: string[];
  color: string;
}

interface ScheduleData {
  classes: ClassEvent[];
  lastUpdated: string;
  version: string;
}

type ViewMode = 'list' | 'calendar';
type FilterType = 'all' | 'lecture' | 'lab' | 'seminar' | 'exam' | 'assignment';

export default function ScheduleScreen() {
  const [classes, setClasses] = useState<ClassEvent[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ClassEvent[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [addEventModalVisible, setAddEventModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ClassEvent | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for adding/editing events
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(),
    location: '',
    meetLink: '',
    instructorName: '',
    instructorEmail: '',
    subject: '',
    type: 'lecture' as ClassEvent['type'],
    materials: [] as string[],
  });

  useEffect(() => {
    loadScheduleData();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateClassStatuses();
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [classes, activeFilter, selectedInstructor, searchQuery]);

  const loadScheduleData = async () => {
    try {
      setLoading(true);
      
      // Try to load from AsyncStorage first
      const cachedData = await AsyncStorage.getItem('scheduleData');
      if (cachedData) {
        const parsedData: ScheduleData = JSON.parse(cachedData);
        const classesWithDates = parsedData.classes.map(cls => ({
          ...cls,
          startTime: new Date(cls.startTime),
          endTime: new Date(cls.endTime),
        }));
        setClasses(classesWithDates);
      } else {
        // Load sample data if no cached data
        await loadSampleData();
      }
    } catch (error) {
      console.error('Failed to load schedule data:', error);
      await loadSampleData();
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = async () => {
    const sampleClasses: ClassEvent[] = [
      {
        id: '1',
        title: 'Advanced Calculus: Derivatives and Applications',
        description: 'Deep dive into derivative applications in real-world scenarios',
        startTime: new Date(Date.now() + 30 * 60 * 1000),
        endTime: new Date(Date.now() + 90 * 60 * 1000),
        location: 'Room 301, Math Building',
        meetLink: 'https://meet.google.com/abc-defg-hij',
        instructor: {
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@school.edu',
        },
        subject: 'Mathematics',
        type: 'lecture',
        isLive: false,
        isUpcoming: true,
        attendeeCount: 24,
        recordingAvailable: false,
        materials: ['Calculus Textbook Ch. 3', 'Problem Set 5'],
        color: '#2563EB'
      },
      {
        id: '2',
        title: 'Organic Chemistry Lab',
        description: 'Synthesis of aspirin and analysis of reaction mechanisms',
        startTime: new Date(Date.now() - 30 * 60 * 1000),
        endTime: new Date(Date.now() + 30 * 60 * 1000),
        location: 'Chemistry Lab 2',
        instructor: {
          name: 'Prof. Michael Chen',
          email: 'michael.chen@school.edu',
        },
        subject: 'Chemistry',
        type: 'lab',
        isLive: true,
        isUpcoming: false,
        attendeeCount: 18,
        recordingAvailable: false,
        materials: ['Lab Manual Ch. 8', 'Safety Guidelines'],
        color: '#059669'
      },
      {
        id: '3',
        title: 'Physics Seminar: Quantum Mechanics',
        description: 'Guest lecture on quantum entanglement and applications',
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
        location: 'Auditorium A',
        meetLink: 'https://meet.google.com/pqr-stuv-wxy',
        instructor: {
          name: 'Dr. Emily Rodriguez',
          email: 'emily.rodriguez@school.edu',
        },
        subject: 'Physics',
        type: 'seminar',
        isLive: false,
        isUpcoming: true,
        attendeeCount: 0,
        recordingAvailable: false,
        materials: ['Quantum Physics Notes', 'Research Papers'],
        color: '#EA580C'
      },
      {
        id: '4',
        title: 'Biology Midterm Exam',
        description: 'Comprehensive exam covering cellular biology and genetics',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 26 * 60 * 60 * 1000),
        location: 'Exam Hall B',
        instructor: {
          name: 'Dr. Amanda Foster',
          email: 'amanda.foster@school.edu',
        },
        subject: 'Biology',
        type: 'exam',
        isLive: false,
        isUpcoming: true,
        attendeeCount: 45,
        recordingAvailable: false,
        materials: ['Study Guide', 'Practice Exam'],
        color: '#7C3AED'
      }
    ];

    setClasses(sampleClasses);
    await saveScheduleData(sampleClasses);
  };

  const saveScheduleData = async (classData: ClassEvent[]) => {
    try {
      const scheduleData: ScheduleData = {
        classes: classData,
        lastUpdated: new Date().toISOString(),
        version: '1.0.0'
      };
      await AsyncStorage.setItem('scheduleData', JSON.stringify(scheduleData));
    } catch (error) {
      console.error('Failed to save schedule data:', error);
    }
  };

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

  const applyFilters = () => {
    let filtered = classes;

    // Filter by type
    if (activeFilter !== 'all') {
      filtered = filtered.filter(cls => cls.type === activeFilter);
    }

    // Filter by instructor
    if (selectedInstructor !== 'all') {
      filtered = filtered.filter(cls => cls.instructor.name === selectedInstructor);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cls => 
        cls.title.toLowerCase().includes(query) ||
        cls.description.toLowerCase().includes(query) ||
        cls.subject.toLowerCase().includes(query) ||
        cls.instructor.name.toLowerCase().includes(query)
      );
    }

    setFilteredClasses(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadScheduleData();
    setRefreshing(false);
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      startTime: new Date(),
      endTime: new Date(Date.now() + 60 * 60 * 1000),
      location: '',
      meetLink: '',
      instructorName: '',
      instructorEmail: '',
      subject: '',
      type: 'lecture',
      materials: [],
    });
    setAddEventModalVisible(true);
  };

  const handleEditEvent = (event: ClassEvent) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location || '',
      meetLink: event.meetLink || '',
      instructorName: event.instructor.name,
      instructorEmail: event.instructor.email,
      subject: event.subject,
      type: event.type,
      materials: event.materials || [],
    });
    setAddEventModalVisible(true);
  };

  const handleSaveEvent = async () => {
    if (!eventForm.title.trim() || !eventForm.instructorName.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newEvent: ClassEvent = {
      id: editingEvent?.id || Date.now().toString(),
      title: eventForm.title,
      description: eventForm.description,
      startTime: eventForm.startTime,
      endTime: eventForm.endTime,
      location: eventForm.location,
      meetLink: eventForm.meetLink,
      instructor: {
        name: eventForm.instructorName,
        email: eventForm.instructorEmail,
      },
      subject: eventForm.subject,
      type: eventForm.type,
      isLive: false,
      isUpcoming: eventForm.startTime > new Date(),
      materials: eventForm.materials,
      color: getTypeColor(eventForm.type),
    };

    let updatedClasses;
    if (editingEvent) {
      updatedClasses = classes.map(cls => cls.id === editingEvent.id ? newEvent : cls);
    } else {
      updatedClasses = [...classes, newEvent];
    }

    setClasses(updatedClasses);
    await saveScheduleData(updatedClasses);
    setAddEventModalVisible(false);
  };

  const handleDeleteEvent = async (eventId: string) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedClasses = classes.filter(cls => cls.id !== eventId);
            setClasses(updatedClasses);
            await saveScheduleData(updatedClasses);
          }
        }
      ]
    );
  };

  const handleExportData = async () => {
    try {
      const scheduleData: ScheduleData = {
        classes,
        lastUpdated: new Date().toISOString(),
        version: '1.0.0'
      };
      
      const dataString = JSON.stringify(scheduleData, null, 2);
      
      if (Platform.OS === 'web') {
        // For web, create a download link
        const blob = new Blob([dataString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `schedule-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // For mobile, use Share API
        await Share.share({
          message: dataString,
          title: 'Class Schedule Data',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export schedule data');
    }
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'This feature would allow you to import schedule data from a JSON file. In a production app, this would open a file picker.',
      [{ text: 'OK' }]
    );
  };

  const getTypeColor = (type: ClassEvent['type']) => {
    const colors = {
      lecture: '#2563EB',
      lab: '#059669',
      seminar: '#EA580C',
      exam: '#EF4444',
      assignment: '#7C3AED',
    };
    return colors[type];
  };

  const getTypeIcon = (type: ClassEvent['type']) => {
    switch (type) {
      case 'lecture': return BookOpen;
      case 'lab': return Zap;
      case 'seminar': return Users;
      case 'exam': return Clock;
      case 'assignment': return Edit3;
      default: return BookOpen;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (start: Date, end: Date) => {
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    return `${diffMins} min`;
  };

  const getUniqueInstructors = () => {
    const instructors = classes.map(cls => cls.instructor.name);
    return ['all', ...Array.from(new Set(instructors))];
  };

  const renderEventCard = (event: ClassEvent) => {
    const IconComponent = getTypeIcon(event.type);
    
    return (
      <View key={event.id} style={[styles.eventCard, { borderLeftColor: event.color }]}>
        <View style={styles.eventHeader}>
          <View style={styles.eventTypeContainer}>
            <View style={[styles.eventTypeIcon, { backgroundColor: event.color }]}>
              <IconComponent size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.eventType}>{event.type.toUpperCase()}</Text>
          </View>
          
          <View style={styles.eventActions}>
            <TouchableOpacity onPress={() => handleEditEvent(event)} style={styles.actionButton}>
              <Edit3 size={16} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteEvent(event.id)} style={styles.actionButton}>
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDescription}>{event.description}</Text>

        <View style={styles.eventDetails}>
          <View style={styles.eventDetailRow}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.eventDetailText}>
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </Text>
          </View>
          
          {event.location && (
            <View style={styles.eventDetailRow}>
              <MapPin size={14} color="#6B7280" />
              <Text style={styles.eventDetailText}>{event.location}</Text>
            </View>
          )}
          
          <View style={styles.eventDetailRow}>
            <User size={14} color="#6B7280" />
            <Text style={styles.eventDetailText}>{event.instructor.name}</Text>
          </View>
        </View>

        {event.materials && event.materials.length > 0 && (
          <View style={styles.materialsSection}>
            <Text style={styles.materialsTitle}>Materials:</Text>
            {event.materials.map((material, index) => (
              <Text key={index} style={styles.materialItem}>• {material}</Text>
            ))}
          </View>
        )}

        {event.meetLink && (
          <TouchableOpacity style={styles.joinButton}>
            <ExternalLink size={16} color="#FFFFFF" />
            <Text style={styles.joinButtonText}>Join Meeting</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderCalendarEvents = () => {
    const eventsByDate: { [key: string]: ClassEvent[] } = {};
    
    filteredClasses.forEach(event => {
      const dateKey = event.startTime.toISOString().split('T')[0];
      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = [];
      }
      eventsByDate[dateKey].push({
        id: event.id,
        title: event.title,
        time: formatTime(event.startTime),
        type: event.type as any,
        subject: event.subject,
        duration: formatDuration(event.startTime, event.endTime),
        isLive: event.isLive,
      });
    });

    return <CalendarView events={eventsByDate} />;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading schedule...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Calendar size={24} color="#2563EB" />
          <Text style={styles.headerTitle}>Class Schedule</Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={() => setFilterModalVisible(true)}>
            <Filter size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleAddEvent}>
            <Plus size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* View Mode Toggle */}
      <View style={styles.viewModeContainer}>
        <View style={styles.viewModeToggle}>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'list' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <List size={16} color={viewMode === 'list' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.viewModeText, viewMode === 'list' && styles.viewModeTextActive]}>
              List
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'calendar' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('calendar')}
          >
            <Grid3x3 size={16} color={viewMode === 'calendar' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.viewModeText, viewMode === 'calendar' && styles.viewModeTextActive]}>
              Calendar
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.exportButton} onPress={handleExportData}>
          <Download size={16} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search classes, instructors, subjects..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Content */}
      {viewMode === 'calendar' ? (
        renderCalendarEvents()
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {filteredClasses.length === 0 ? (
            <View style={styles.emptyState}>
              <Calendar size={64} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No Classes Found</Text>
              <Text style={styles.emptyText}>
                {searchQuery || activeFilter !== 'all' || selectedInstructor !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'Add your first class to get started'}
              </Text>
            </View>
          ) : (
            filteredClasses.map(renderEventCard)
          )}
        </ScrollView>
      )}

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter & Sort</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Type Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Event Type</Text>
              {(['all', 'lecture', 'lab', 'seminar', 'exam', 'assignment'] as const).map(type => (
                <TouchableOpacity
                  key={type}
                  style={[styles.filterOption, activeFilter === type && styles.filterOptionActive]}
                  onPress={() => setActiveFilter(type)}
                >
                  <Text style={[styles.filterOptionText, activeFilter === type && styles.filterOptionTextActive]}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Instructor Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Instructor</Text>
              {getUniqueInstructors().map(instructor => (
                <TouchableOpacity
                  key={instructor}
                  style={[styles.filterOption, selectedInstructor === instructor && styles.filterOptionActive]}
                  onPress={() => setSelectedInstructor(instructor)}
                >
                  <Text style={[styles.filterOptionText, selectedInstructor === instructor && styles.filterOptionTextActive]}>
                    {instructor === 'all' ? 'All Instructors' : instructor}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Import/Export */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Data Management</Text>
              <TouchableOpacity style={styles.dataButton} onPress={handleExportData}>
                <Download size={20} color="#2563EB" />
                <Text style={styles.dataButtonText}>Export Schedule</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dataButton} onPress={handleImportData}>
                <Upload size={20} color="#059669" />
                <Text style={styles.dataButtonText}>Import Schedule</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Add/Edit Event Modal */}
      <Modal
        visible={addEventModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAddEventModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </Text>
            <TouchableOpacity onPress={() => setAddEventModalVisible(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Title *</Text>
              <TextInput
                style={styles.formInput}
                value={eventForm.title}
                onChangeText={(text) => setEventForm(prev => ({ ...prev, title: text }))}
                placeholder="Enter event title"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                style={[styles.formInput, styles.formTextArea]}
                value={eventForm.description}
                onChangeText={(text) => setEventForm(prev => ({ ...prev, description: text }))}
                placeholder="Enter event description"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Instructor Name *</Text>
              <TextInput
                style={styles.formInput}
                value={eventForm.instructorName}
                onChangeText={(text) => setEventForm(prev => ({ ...prev, instructorName: text }))}
                placeholder="Enter instructor name"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Instructor Email</Text>
              <TextInput
                style={styles.formInput}
                value={eventForm.instructorEmail}
                onChangeText={(text) => setEventForm(prev => ({ ...prev, instructorEmail: text }))}
                placeholder="Enter instructor email"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Subject</Text>
              <TextInput
                style={styles.formInput}
                value={eventForm.subject}
                onChangeText={(text) => setEventForm(prev => ({ ...prev, subject: text }))}
                placeholder="Enter subject"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Location</Text>
              <TextInput
                style={styles.formInput}
                value={eventForm.location}
                onChangeText={(text) => setEventForm(prev => ({ ...prev, location: text }))}
                placeholder="Enter location or room number"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Meeting Link</Text>
              <TextInput
                style={styles.formInput}
                value={eventForm.meetLink}
                onChangeText={(text) => setEventForm(prev => ({ ...prev, meetLink: text }))}
                placeholder="Enter meeting link (optional)"
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveEvent}>
              <Save size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>
                {editingEvent ? 'Update Event' : 'Save Event'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  viewModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  viewModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewModeButtonActive: {
    backgroundColor: '#2563EB',
  },
  viewModeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 4,
  },
  viewModeTextActive: {
    color: '#FFFFFF',
  },
  exportButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTypeIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  eventType: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#6B7280',
  },
  eventActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  eventDetails: {
    marginBottom: 12,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    marginLeft: 8,
  },
  materialsSection: {
    marginBottom: 12,
  },
  materialsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  materialItem: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 8,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 6,
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  filterOption: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterOptionActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  filterOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  filterOptionTextActive: {
    color: '#2563EB',
    fontFamily: 'Inter-SemiBold',
  },
  dataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dataButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginLeft: 8,
  },
  formSection: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  formTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});