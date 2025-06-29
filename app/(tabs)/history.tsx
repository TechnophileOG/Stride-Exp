import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Calculator, 
  Beaker,
  Globe,
  Clock,
  Share2,
  Bookmark
} from 'lucide-react-native';

interface HistoryItem {
  id: string;
  title: string;
  subject: 'math' | 'science' | 'history' | 'literature';
  timestamp: Date;
  preview: string;
  solved: boolean;
  imageUrl?: string;
}

const SAMPLE_HISTORY: HistoryItem[] = [
  {
    id: '1',
    title: 'Quadratic Equation Solving',
    subject: 'math',
    timestamp: new Date('2024-01-15T10:30:00'),
    preview: 'Solve x² - 5x + 6 = 0 using the quadratic formula...',
    solved: true,
    imageUrl: 'https://images.pexels.com/photos/6256065/pexels-photo-6256065.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    title: 'Chemical Bonding Concepts',
    subject: 'science',
    timestamp: new Date('2024-01-14T14:15:00'),
    preview: 'Explain ionic vs covalent bonds with examples...',
    solved: true,
    imageUrl: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    title: 'Shakespeare Sonnet Analysis',
    subject: 'literature',
    timestamp: new Date('2024-01-13T16:45:00'),
    preview: 'Literary devices in Sonnet 18: "Shall I compare thee..."',
    solved: false,
    imageUrl: 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '4',
    title: 'World War II Timeline',
    subject: 'history',
    timestamp: new Date('2024-01-12T09:20:00'),
    preview: 'Key events and dates from 1939-1945...',
    solved: true,
    imageUrl: 'https://images.pexels.com/photos/1329296/pexels-photo-1329296.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [history, setHistory] = useState<HistoryItem[]>(SAMPLE_HISTORY);

  const subjects = [
    { key: 'all', label: 'All', icon: BookOpen, color: '#6B7280' },
    { key: 'math', label: 'Math', icon: Calculator, color: '#2563EB' },
    { key: 'science', label: 'Science', icon: Beaker, color: '#059669' },
    { key: 'history', label: 'History', icon: Globe, color: '#EA580C' },
    { key: 'literature', label: 'Literature', icon: BookOpen, color: '#7C3AED' },
  ];

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || item.subject === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getSubjectIcon = (subject: string) => {
    const subjectConfig = subjects.find(s => s.key === subject);
    if (!subjectConfig) return BookOpen;
    return subjectConfig.icon;
  };

  const getSubjectColor = (subject: string) => {
    const subjectConfig = subjects.find(s => s.key === subject);
    return subjectConfig?.color || '#6B7280';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return `${diffMins}m ago`;
      }
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const toggleBookmark = (id: string) => {
    // In a real app, this would update the bookmark status
    console.log('Toggle bookmark for:', id);
  };

  const shareItem = (item: HistoryItem) => {
    // In a real app, this would share the item
    console.log('Share item:', item.title);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Study History</Text>
        <Text style={styles.headerSubtitle}>Your AI-assisted learning journey</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your history..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Filter Pills */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {subjects.map((subject) => {
          const IconComponent = subject.icon;
          const isSelected = selectedFilter === subject.key;
          
          return (
            <TouchableOpacity
              key={subject.key}
              style={[
                styles.filterPill,
                isSelected && { backgroundColor: subject.color }
              ]}
              onPress={() => setSelectedFilter(subject.key)}
            >
              <IconComponent 
                size={16} 
                color={isSelected ? '#FFFFFF' : subject.color} 
              />
              <Text 
                style={[
                  styles.filterText,
                  isSelected && { color: '#FFFFFF' }
                ]}
              >
                {subject.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* History List */}
      <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
        {filteredHistory.map((item) => {
          const SubjectIcon = getSubjectIcon(item.subject);
          const subjectColor = getSubjectColor(item.subject);
          
          return (
            <TouchableOpacity key={item.id} style={styles.historyCard}>
              <View style={styles.cardHeader}>
                <View style={styles.subjectIndicator}>
                  <SubjectIcon size={16} color={subjectColor} />
                </View>
                <View style={styles.cardMeta}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View style={styles.metaRow}>
                    <Clock size={12} color="#9CA3AF" />
                    <Text style={styles.metaText}>{formatTimeAgo(item.timestamp)}</Text>
                    {item.solved && (
                      <>
                        <View style={styles.solvedIndicator} />
                        <Text style={styles.solvedText}>Solved</Text>
                      </>
                    )}
                  </View>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => shareItem(item)}
                  >
                    <Share2 size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => toggleBookmark(item.id)}
                  >
                    <Bookmark size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <Text style={styles.cardPreview}>{item.preview}</Text>
              
              {item.imageUrl && (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
        
        {filteredHistory.length === 0 && (
          <View style={styles.emptyState}>
            <BookOpen size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No history found</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Try adjusting your search terms' : 'Start scanning to build your study history'}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    marginLeft: 12,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterContent: {
    paddingRight: 20,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 6,
  },
  historyList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  subjectIndicator: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardMeta: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginLeft: 4,
  },
  solvedIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
    marginLeft: 12,
    marginRight: 4,
  },
  solvedText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#059669',
  },
  cardActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  cardPreview: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
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