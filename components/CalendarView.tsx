import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { Calendar, ChevronLeft, ChevronRight, BookOpen, FileText, Clock, Filter, X, Zap, Users, CreditCard as Edit3 } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = 80;
const CARD_MARGIN = 8;

interface ClassEvent {
  id: string;
  title: string;
  time: string;
  type: 'lecture' | 'lab' | 'seminar' | 'exam' | 'assignment';
  subject: string;
  duration: string;
  isLive?: boolean;
}

interface CalendarDay {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  events: ClassEvent[];
}

interface CalendarViewProps {
  onDateSelect?: (date: Date) => void;
  events?: { [key: string]: ClassEvent[] };
}

const SAMPLE_EVENTS: { [key: string]: ClassEvent[] } = {
  '2024-01-15': [
    {
      id: '1',
      title: 'Advanced Calculus',
      time: '10:00 AM',
      type: 'lecture',
      subject: 'Mathematics',
      duration: '60 min',
      isLive: true,
    },
    {
      id: '2',
      title: 'Physics Quiz',
      time: '2:00 PM',
      type: 'exam',
      subject: 'Physics',
      duration: '30 min',
    },
  ],
  '2024-01-16': [
    {
      id: '3',
      title: 'Chemistry Lab',
      time: '11:00 AM',
      type: 'lab',
      subject: 'Chemistry',
      duration: '90 min',
    },
  ],
  '2024-01-17': [
    {
      id: '4',
      title: 'Essay Submission',
      time: '11:59 PM',
      type: 'assignment',
      subject: 'English',
      duration: 'Due',
    },
  ],
  '2024-01-18': [
    {
      id: '5',
      title: 'Biology Seminar',
      time: '9:00 AM',
      type: 'seminar',
      subject: 'Biology',
      duration: '45 min',
    },
    {
      id: '6',
      title: 'Math Test',
      time: '1:00 PM',
      type: 'exam',
      subject: 'Mathematics',
      duration: '60 min',
    },
    {
      id: '7',
      title: 'History Project',
      time: '3:00 PM',
      type: 'assignment',
      subject: 'History',
      duration: 'Presentation',
    },
  ],
};

export default function CalendarView({ onDateSelect, events = SAMPLE_EVENTS }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(new Date()));
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const expandAnimation = useRef(new Animated.Value(0)).current;

  const filterOptions = [
    { key: 'lecture', label: 'Lectures', color: '#2563EB' },
    { key: 'lab', label: 'Labs', color: '#059669' },
    { key: 'seminar', label: 'Seminars', color: '#EA580C' },
    { key: 'exam', label: 'Exams', color: '#EF4444' },
    { key: 'assignment', label: 'Assignments', color: '#7C3AED' },
  ];

  useEffect(() => {
    // Auto-scroll to today on mount
    const today = new Date();
    const todayIndex = getWeekDays(currentWeekStart).findIndex(day => 
      day.date.toDateString() === today.toDateString()
    );
    if (todayIndex !== -1) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: todayIndex * (CARD_WIDTH + CARD_MARGIN * 2),
          animated: true,
        });
      }, 100);
    }
  }, []);

  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  function getWeekDays(weekStart: Date): CalendarDay[] {
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      
      const dateKey = date.toISOString().split('T')[0];
      const dayEvents = events[dateKey] || [];
      
      // Apply filters
      const filteredEvents = activeFilters.length > 0 
        ? dayEvents.filter(event => activeFilters.includes(event.type))
        : dayEvents;

      days.push({
        date,
        dayName: date.toLocaleDateString('en', { weekday: 'short' }),
        dayNumber: date.getDate(),
        isToday: date.toDateString() === today.toDateString(),
        events: filteredEvents,
      });
    }
    
    return days;
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newWeekStart);
    setExpandedDate(null);
  };

  const handleDatePress = (day: CalendarDay) => {
    const dateKey = day.date.toISOString().split('T')[0];
    
    if (expandedDate === dateKey) {
      // Collapse if already expanded
      Animated.timing(expandAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setExpandedDate(null);
      });
    } else {
      // Expand new date
      setExpandedDate(dateKey);
      setSelectedDate(day.date);
      onDateSelect?.(day.date);
      
      Animated.timing(expandAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const toggleFilter = (filterKey: string) => {
    setActiveFilters(prev => 
      prev.includes(filterKey)
        ? prev.filter(f => f !== filterKey)
        : [...prev, filterKey]
    );
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'lecture': return BookOpen;
      case 'lab': return Zap;
      case 'seminar': return Users;
      case 'exam': return FileText;
      case 'assignment': return Edit3;
      default: return BookOpen;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'lecture': return '#2563EB';
      case 'lab': return '#059669';
      case 'seminar': return '#EA580C';
      case 'exam': return '#EF4444';
      case 'assignment': return '#7C3AED';
      default: return '#6B7280';
    }
  };

  const weekDays = getWeekDays(currentWeekStart);
  const selectedDateKey = selectedDate.toISOString().split('T')[0];
  const selectedDayEvents = events[selectedDateKey] || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Calendar size={24} color="#2563EB" />
          <Text style={styles.headerTitle}>Calendar View</Text>
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Filter size={20} color="#6B7280" />
          {activeFilters.length > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilters.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Month Navigation */}
      <View style={styles.monthNavigation}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateWeek('prev')}>
          <ChevronLeft size={20} color="#6B7280" />
        </TouchableOpacity>
        
        <Text style={styles.monthText}>
          {currentWeekStart.toLocaleDateString('en', { month: 'long', year: 'numeric' })}
        </Text>
        
        <TouchableOpacity style={styles.navButton} onPress={() => navigateWeek('next')}>
          <ChevronRight size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Calendar Cards */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.calendarScroll}
        contentContainerStyle={styles.calendarContent}
      >
        {weekDays.map((day, index) => {
          const dateKey = day.date.toISOString().split('T')[0];
          const isExpanded = expandedDate === dateKey;
          
          return (
            <TouchableOpacity
              key={dateKey}
              style={[
                styles.dateCard,
                day.isToday && styles.todayCard,
                isExpanded && styles.expandedCard,
              ]}
              onPress={() => handleDatePress(day)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dayName,
                day.isToday && styles.todayText,
                isExpanded && styles.expandedText,
              ]}>
                {day.dayName}
              </Text>
              
              <Text style={[
                styles.dayNumber,
                day.isToday && styles.todayText,
                isExpanded && styles.expandedText,
              ]}>
                {day.dayNumber}
              </Text>
              
              {day.events.length > 0 && (
                <View style={[
                  styles.eventIndicator,
                  day.isToday && styles.todayIndicator,
                  isExpanded && styles.expandedIndicator,
                ]}>
                  <Text style={[
                    styles.eventCount,
                    day.isToday && styles.todayEventCount,
                    isExpanded && styles.expandedEventCount,
                  ]}>
                    {day.events.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Expanded Event Details */}
      {expandedDate && (
        <Animated.View style={[
          styles.eventDetails,
          {
            maxHeight: expandAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 300],
            }),
            opacity: expandAnimation,
          }
        ]}>
          <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
            {selectedDayEvents
              .filter(event => activeFilters.length === 0 || activeFilters.includes(event.type))
              .map((event) => {
                const IconComponent = getEventIcon(event.type);
                const eventColor = getEventColor(event.type);
                
                return (
                  <View key={event.id} style={styles.eventItem}>
                    <View style={[styles.eventIcon, { backgroundColor: eventColor }]}>
                      <IconComponent size={16} color="#FFFFFF" />
                    </View>
                    
                    <View style={styles.eventInfo}>
                      <View style={styles.eventHeader}>
                        <Text style={styles.eventTitle}>{event.title}</Text>
                        {event.isLive && (
                          <View style={styles.liveBadge}>
                            <Text style={styles.liveText}>LIVE</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.eventSubject}>{event.subject}</Text>
                      <Text style={styles.eventTime}>{event.time} • {event.duration}</Text>
                    </View>
                  </View>
                );
              })}
          </ScrollView>
        </Animated.View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Events</Text>
            <TouchableOpacity 
              onPress={() => setFilterModalVisible(false)}
              style={styles.closeButton}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.filterOptions}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.filterOption,
                  activeFilters.includes(option.key) && styles.filterOptionActive
                ]}
                onPress={() => toggleFilter(option.key)}
              >
                <View style={[styles.filterIcon, { backgroundColor: option.color }]}>
                  {React.createElement(getEventIcon(option.key), { size: 20, color: '#FFFFFF' })}
                </View>
                <Text style={[
                  styles.filterLabel,
                  activeFilters.includes(option.key) && styles.filterLabelActive
                ]}>
                  {option.label}
                </Text>
                {activeFilters.includes(option.key) && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={() => setActiveFilters([])}
          >
            <Text style={styles.clearFiltersText}>Clear All Filters</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    flex: 1,
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
  filterButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filterBadge: {
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
  filterBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  monthText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
  },
  calendarScroll: {
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  calendarContent: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  dateCard: {
    width: CARD_WIDTH,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: CARD_MARGIN,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  todayCard: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  expandedCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  dayName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  todayText: {
    color: '#FFFFFF',
  },
  expandedText: {
    color: '#2563EB',
  },
  eventIndicator: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayIndicator: {
    backgroundColor: '#FFFFFF',
  },
  expandedIndicator: {
    backgroundColor: '#2563EB',
  },
  eventCount: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  todayEventCount: {
    color: '#EF4444',
  },
  expandedEventCount: {
    color: '#FFFFFF',
  },
  eventDetails: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  eventsList: {
    padding: 16,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  eventIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
  },
  liveBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  liveText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  eventSubject: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
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
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  filterOptions: {
    padding: 20,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filterOptionActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  filterIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  filterLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    flex: 1,
  },
  filterLabelActive: {
    color: '#2563EB',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  clearFiltersButton: {
    margin: 20,
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearFiltersText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
});