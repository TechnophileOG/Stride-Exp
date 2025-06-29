import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Linking,
  RefreshControl,
  Dimensions,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Heart, Star, ShoppingBag, ExternalLink, BookOpen, TrendingUp, Award, DollarSign, Grid3x3 as Grid3X3, List, ChevronDown, ArrowUpDown, X, Scissors, PenTool, Palette } from 'lucide-react-native';
import StoreEntranceAnimation from '@/components/StoreEntranceAnimation';
import StoreDisclaimerModal from '@/components/StoreDisclaimerModal';

const { width: screenWidth } = Dimensions.get('window');

interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  amazonUrl: string;
  category: string;
  description: string;
  isWishlisted: boolean;
  isBestseller?: boolean;
  isRecommended?: boolean;
  tags: string[];
}

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
}

const CATEGORIES: Category[] = [
  { id: 'mathematics', name: 'Mathematics', icon: Award, color: '#2563EB' },
  { id: 'physics', name: 'Physics', icon: TrendingUp, color: '#EA580C' },
  { id: 'chemistry', name: 'Chemistry', icon: BookOpen, color: '#059669' },
  { id: 'biology', name: 'Biology', icon: Heart, color: '#7C3AED' },
  { id: 'computer-science', name: 'Computer Science', icon: Grid3X3, color: '#DC2626' },
  { id: 'engineering', name: 'Engineering', icon: Award, color: '#B45309' },
  { id: 'stationery', name: 'Stationery', icon: PenTool, color: '#EC4899' },
];

const SAMPLE_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Calculus: Early Transcendentals',
    author: 'James Stewart',
    coverUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 299.99,
    originalPrice: 349.99,
    rating: 4.6,
    reviewCount: 1247,
    amazonUrl: 'https://amazon.com/dp/example1',
    category: 'mathematics',
    description: 'Comprehensive calculus textbook with clear explanations and extensive problem sets.',
    isWishlisted: false,
    isBestseller: true,
    isRecommended: true,
    tags: ['Calculus', 'Mathematics', 'Textbook']
  },
  {
    id: '2',
    title: 'University Physics with Modern Physics',
    author: 'Hugh Young & Roger Freedman',
    coverUrl: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 279.95,
    originalPrice: 319.95,
    rating: 4.4,
    reviewCount: 892,
    amazonUrl: 'https://amazon.com/dp/example2',
    category: 'physics',
    description: 'Complete physics course covering classical and modern physics concepts.',
    isWishlisted: true,
    isBestseller: false,
    isRecommended: true,
    tags: ['Physics', 'Modern Physics', 'University']
  },
  {
    id: '3',
    title: 'Organic Chemistry',
    author: 'Paula Yurkanis Bruice',
    coverUrl: 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 259.99,
    rating: 4.3,
    reviewCount: 634,
    amazonUrl: 'https://amazon.com/dp/example3',
    category: 'chemistry',
    description: 'Comprehensive organic chemistry with mechanism-based approach.',
    isWishlisted: false,
    isBestseller: false,
    isRecommended: false,
    tags: ['Organic Chemistry', 'Mechanisms', 'Laboratory']
  },
  {
    id: '4',
    title: 'Campbell Biology',
    author: 'Jane Reece & Lisa Urry',
    coverUrl: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 329.99,
    originalPrice: 379.99,
    rating: 4.7,
    reviewCount: 1456,
    amazonUrl: 'https://amazon.com/dp/example4',
    category: 'biology',
    description: 'The definitive biology textbook covering all major biological concepts.',
    isWishlisted: false,
    isBestseller: true,
    isRecommended: true,
    tags: ['Biology', 'Cell Biology', 'Genetics']
  },
  {
    id: '5',
    title: 'Introduction to Algorithms',
    author: 'Thomas Cormen',
    coverUrl: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 199.99,
    rating: 4.5,
    reviewCount: 2103,
    amazonUrl: 'https://amazon.com/dp/example5',
    category: 'computer-science',
    description: 'Comprehensive guide to algorithms and data structures.',
    isWishlisted: true,
    isBestseller: true,
    isRecommended: false,
    tags: ['Algorithms', 'Computer Science', 'Programming']
  },
  {
    id: '6',
    title: 'Engineering Mechanics: Statics',
    author: 'Russell Hibbeler',
    coverUrl: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 249.99,
    originalPrice: 289.99,
    rating: 4.2,
    reviewCount: 567,
    amazonUrl: 'https://amazon.com/dp/example6',
    category: 'engineering',
    description: 'Fundamental principles of engineering statics with practical applications.',
    isWishlisted: false,
    isBestseller: false,
    isRecommended: true,
    tags: ['Engineering', 'Statics', 'Mechanics']
  },
  {
    id: '7',
    title: 'Linear Algebra and Its Applications',
    author: 'David Lay',
    coverUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 189.99,
    originalPrice: 229.99,
    rating: 4.3,
    reviewCount: 789,
    amazonUrl: 'https://amazon.com/dp/example7',
    category: 'mathematics',
    description: 'Essential linear algebra concepts with real-world applications.',
    isWishlisted: false,
    isBestseller: false,
    isRecommended: true,
    tags: ['Linear Algebra', 'Mathematics', 'Applications']
  },
  {
    id: '8',
    title: 'Fundamentals of Physics',
    author: 'David Halliday',
    coverUrl: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 349.99,
    rating: 4.5,
    reviewCount: 1123,
    amazonUrl: 'https://amazon.com/dp/example8',
    category: 'physics',
    description: 'Comprehensive physics textbook covering mechanics, thermodynamics, and more.',
    isWishlisted: false,
    isBestseller: true,
    isRecommended: false,
    tags: ['Physics', 'Fundamentals', 'Mechanics']
  },
  // Stationery Items
  {
    id: '9',
    title: 'Premium Fountain Pen Set',
    author: 'Parker',
    coverUrl: 'https://images.pexels.com/photos/1053687/pexels-photo-1053687.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.8,
    reviewCount: 456,
    amazonUrl: 'https://amazon.com/dp/example9',
    category: 'stationery',
    description: 'Professional fountain pen set with multiple ink cartridges and elegant case.',
    isWishlisted: false,
    isBestseller: true,
    isRecommended: true,
    tags: ['Fountain Pen', 'Writing', 'Professional']
  },
  {
    id: '10',
    title: 'Leather-Bound Notebook Collection',
    author: 'Moleskine',
    coverUrl: 'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 45.99,
    rating: 4.6,
    reviewCount: 892,
    amazonUrl: 'https://amazon.com/dp/example10',
    category: 'stationery',
    description: 'Set of 3 premium leather-bound notebooks with dotted pages.',
    isWishlisted: true,
    isBestseller: false,
    isRecommended: true,
    tags: ['Notebook', 'Leather', 'Premium']
  },
  {
    id: '11',
    title: 'Professional Art Supply Kit',
    author: 'Faber-Castell',
    coverUrl: 'https://images.pexels.com/photos/1053924/pexels-photo-1053924.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.7,
    reviewCount: 234,
    amazonUrl: 'https://amazon.com/dp/example11',
    category: 'stationery',
    description: 'Complete art supply kit with colored pencils, markers, and sketching tools.',
    isWishlisted: false,
    isBestseller: false,
    isRecommended: true,
    tags: ['Art Supplies', 'Drawing', 'Creative']
  },
  {
    id: '12',
    title: 'Ergonomic Desk Organizer',
    author: 'Bamboo Craft',
    coverUrl: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 34.99,
    rating: 4.4,
    reviewCount: 567,
    amazonUrl: 'https://amazon.com/dp/example12',
    category: 'stationery',
    description: 'Sustainable bamboo desk organizer with multiple compartments.',
    isWishlisted: false,
    isBestseller: false,
    isRecommended: false,
    tags: ['Desk Organizer', 'Bamboo', 'Sustainable']
  }
];

type SortOption = 'price-low' | 'price-high' | 'rating' | 'newest';

export default function StoreScreen() {
  const [books, setBooks] = useState<Book[]>(SAMPLE_BOOKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('price-low');
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [showEntranceAnimation, setShowEntranceAnimation] = useState(true);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  useEffect(() => {
    // Check if disclaimer was already accepted in this session
    const checkDisclaimerStatus = () => {
      // In a real app, you might check AsyncStorage or a global state
      // For now, we'll show it once per session
      if (!disclaimerAccepted) {
        setShowDisclaimerModal(true);
      }
    };

    if (!showEntranceAnimation) {
      checkDisclaimerStatus();
    }
  }, [showEntranceAnimation, disclaimerAccepted]);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.reviewCount - a.reviewCount;
      default:
        return 0;
    }
  });

  const toggleWishlist = (bookId: string) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === bookId ? { ...book, isWishlisted: !book.isWishlisted } : book
      )
    );
  };

  const handleBookPress = (book: Book) => {
    Alert.alert(
      'Open Amazon',
      `View "${book.title}" on Amazon?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Amazon', 
          onPress: () => Linking.openURL(book.amazonUrl)
        }
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleEntranceAnimationComplete = () => {
    setShowEntranceAnimation(false);
  };

  const handleDisclaimerAccept = () => {
    setDisclaimerAccepted(true);
    setShowDisclaimerModal(false);
  };

  const handleDisclaimerClose = () => {
    setShowDisclaimerModal(false);
    // Optionally navigate back or show a different screen
  };

  const renderTubeBookCard = (book: Book) => {
    return (
      <TouchableOpacity
        key={book.id}
        style={styles.tubeCard}
        onPress={() => handleBookPress(book)}
        activeOpacity={0.7}
      >
        {/* Book Cover */}
        <View style={styles.tubeCoverContainer}>
          <Image source={{ uri: book.coverUrl }} style={styles.tubeCover} />
          
          {/* Badges */}
          {(book.isBestseller || book.isRecommended) && (
            <View style={styles.tubeBadgeContainer}>
              {book.isBestseller && (
                <View style={styles.tubeBadge}>
                  <Award size={8} color="#FFFFFF" />
                </View>
              )}
              {book.isRecommended && (
                <View style={[styles.tubeBadge, styles.recommendedTubeBadge]}>
                  <Star size={8} color="#FFFFFF" />
                </View>
              )}
            </View>
          )}
        </View>

        {/* Book Info */}
        <View style={styles.tubeInfo}>
          <Text style={styles.tubeTitle} numberOfLines={1}>
            {book.title}
          </Text>
          <Text style={styles.tubeAuthor} numberOfLines={1}>
            {book.author}
          </Text>
          
          {/* Rating and Price Row */}
          <View style={styles.tubeMetrics}>
            <View style={styles.tubeRating}>
              <Star size={10} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.tubeRatingText}>{book.rating}</Text>
            </View>
            
            <View style={styles.tubePriceContainer}>
              <Text style={styles.tubePrice}>${book.price}</Text>
              {book.originalPrice && (
                <Text style={styles.tubeOriginalPrice}>${book.originalPrice}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.tubeActions}>
          <TouchableOpacity
            style={[styles.tubeWishlistButton, book.isWishlisted && styles.tubeWishlistActive]}
            onPress={() => toggleWishlist(book.id)}
          >
            <Heart 
              size={12} 
              color={book.isWishlisted ? "#FFFFFF" : "#6B7280"} 
              fill={book.isWishlisted ? "#FFFFFF" : "none"}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tubeAmazonButton}>
            <ExternalLink size={12} color="#FF9900" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Show entrance animation first
  if (showEntranceAnimation) {
    return (
      <StoreEntranceAnimation onAnimationComplete={handleEntranceAnimationComplete} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Filter Icon */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ShoppingBag size={24} color="#2563EB" />
          <Text style={styles.headerTitle}>Book Store</Text>
        </View>
        
        {/* Filter Icon Button */}
        <TouchableOpacity 
          style={styles.filterIconButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Filter size={20} color="#6B7280" />
          {(selectedCategory !== 'all' || sortBy !== 'price-low') && (
            <View style={styles.filterActiveBadge}>
              <Text style={styles.filterActiveBadgeText}>•</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search books, authors, topics..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Subject Classification Tabs - Moved Below Search Bar */}
      <View style={styles.subjectTabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.subjectTabsScroll}
          contentContainerStyle={styles.subjectTabsContent}
        >
          {/* All Books Tab */}
          <TouchableOpacity
            style={[
              styles.subjectTab,
              selectedCategory === 'all' && styles.subjectTabActive
            ]}
            onPress={() => setSelectedCategory('all')}
          >
            <BookOpen 
              size={16} 
              color={selectedCategory === 'all' ? '#FFFFFF' : '#6B7280'} 
            />
            <Text style={[
              styles.subjectTabText,
              selectedCategory === 'all' && styles.subjectTabTextActive
            ]}>
              All Books
            </Text>
          </TouchableOpacity>

          {/* Category Tabs */}
          {CATEGORIES.map((category) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.subjectTab,
                  isSelected && styles.subjectTabActive,
                  isSelected && { backgroundColor: category.color }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <IconComponent 
                  size={16} 
                  color={isSelected ? '#FFFFFF' : category.color} 
                />
                <Text style={[
                  styles.subjectTabText,
                  isSelected && styles.subjectTabTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Tube-Shaped Books List */}
      <ScrollView 
        style={styles.tubeContainer}
        contentContainerStyle={styles.tubeContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {sortedBooks.map(book => renderTubeBookCard(book))}

        {/* Empty State */}
        {sortedBooks.length === 0 && (
          <View style={styles.emptyState}>
            <BookOpen size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Books Found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or browse different categories
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter & Sort</Text>
            <TouchableOpacity 
              onPress={() => setFilterModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Sort Section */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Sort by Price</Text>
              <View style={styles.sortOptionsGrid}>
                <TouchableOpacity 
                  style={[
                    styles.modalSortOption,
                    sortBy === 'price-low' && styles.modalSortOptionActive
                  ]}
                  onPress={() => setSortBy('price-low')}
                >
                  <ArrowUpDown size={16} color={sortBy === 'price-low' ? '#FFFFFF' : '#2563EB'} />
                  <Text style={[
                    styles.modalSortOptionText,
                    sortBy === 'price-low' && styles.modalSortOptionTextActive
                  ]}>
                    Low to High
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.modalSortOption,
                    sortBy === 'price-high' && styles.modalSortOptionActive
                  ]}
                  onPress={() => setSortBy('price-high')}
                >
                  <ArrowUpDown size={16} color={sortBy === 'price-high' ? '#FFFFFF' : '#2563EB'} />
                  <Text style={[
                    styles.modalSortOptionText,
                    sortBy === 'price-high' && styles.modalSortOptionTextActive
                  ]}>
                    High to Low
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Categories Section */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Categories</Text>
              
              <TouchableOpacity
                style={[
                  styles.modalCategoryOption,
                  selectedCategory === 'all' && styles.modalCategoryOptionActive
                ]}
                onPress={() => setSelectedCategory('all')}
              >
                <BookOpen size={20} color={selectedCategory === 'all' ? '#FFFFFF' : '#6B7280'} />
                <Text style={[
                  styles.modalCategoryText,
                  selectedCategory === 'all' && styles.modalCategoryTextActive
                ]}>
                  All Books
                </Text>
                {selectedCategory === 'all' && (
                  <View style={styles.modalCheckmark}>
                    <Text style={styles.modalCheckmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
              
              {CATEGORIES.map((category) => {
                const IconComponent = category.icon;
                const isSelected = selectedCategory === category.id;
                
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.modalCategoryOption,
                      isSelected && styles.modalCategoryOptionActive,
                      isSelected && { backgroundColor: category.color }
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <IconComponent 
                      size={20} 
                      color={isSelected ? '#FFFFFF' : category.color} 
                    />
                    <Text style={[
                      styles.modalCategoryText,
                      isSelected && styles.modalCategoryTextActive
                    ]}>
                      {category.name}
                    </Text>
                    {isSelected && (
                      <View style={styles.modalCheckmark}>
                        <Text style={styles.modalCheckmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Results Count */}
            <View style={styles.modalResultsSection}>
              <Text style={styles.modalResultsText}>
                {sortedBooks.length} books found
              </Text>
            </View>
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.modalResetButton}
              onPress={() => {
                setSelectedCategory('all');
                setSortBy('price-low');
              }}
            >
              <Text style={styles.modalResetText}>Reset Filters</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalApplyButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.modalApplyText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Disclaimer Modal */}
      <StoreDisclaimerModal
        visible={showDisclaimerModal}
        onAccept={handleDisclaimerAccept}
        onClose={handleDisclaimerClose}
      />
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
  filterIconButton: {
    position: 'relative',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterActiveBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterActiveBadgeText: {
    fontSize: 6,
    color: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    marginLeft: 12,
  },
  
  // Subject Tabs - Moved Below Search Bar
  subjectTabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
  },
  subjectTabsScroll: {
    paddingHorizontal: 16,
  },
  subjectTabsContent: {
    paddingHorizontal: 4,
  },
  subjectTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  subjectTabActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  subjectTabText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginLeft: 6,
  },
  subjectTabTextActive: {
    color: '#FFFFFF',
  },

  tubeContainer: {
    flex: 1,
  },
  tubeContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tubeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // Reduced from 40 to 12 for less rounded, more rectangular appearance
    padding: 12,
    marginBottom: 16,
    height: 80,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tubeCoverContainer: {
    position: 'relative',
    marginRight: 12,
  },
  tubeCover: {
    width: 56,
    height: 56,
    borderRadius: 6, // Reduced from 8 to 6 for less rounded corners
    resizeMode: 'cover',
  },
  tubeBadgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    flexDirection: 'row',
  },
  tubeBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
  },
  recommendedTubeBadge: {
    backgroundColor: '#059669',
  },
  tubeInfo: {
    flex: 1,
    paddingRight: 8,
  },
  tubeTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  tubeAuthor: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  tubeMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tubeRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tubeRatingText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginLeft: 3,
  },
  tubePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tubePrice: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#059669',
  },
  tubeOriginalPrice: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  tubeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tubeWishlistButton: {
    width: 28,
    height: 28,
    borderRadius: 8, // Reduced from 14 to 8 for less rounded corners
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  tubeWishlistActive: {
    backgroundColor: '#EF4444',
  },
  tubeAmazonButton: {
    width: 28,
    height: 28,
    borderRadius: 8, // Reduced from 14 to 8 for less rounded corners
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDBA74',
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
  
  // Modal Styles
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
  modalCloseButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalSection: {
    marginTop: 24,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  sortOptionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  modalSortOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DBEAFE',
  },
  modalSortOptionActive: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  modalSortOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginLeft: 6,
  },
  modalSortOptionTextActive: {
    color: '#FFFFFF',
  },
  modalCategoryOption: {
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
  modalCategoryOptionActive: {
    backgroundColor: '#2563EB',
  },
  modalCategoryText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    flex: 1,
    marginLeft: 12,
  },
  modalCategoryTextActive: {
    color: '#FFFFFF',
  },
  modalCheckmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCheckmarkText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  modalResultsSection: {
    marginTop: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  modalResultsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  modalResetButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalResetText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  modalApplyButton: {
    flex: 2,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalApplyText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});