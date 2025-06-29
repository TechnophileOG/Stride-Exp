import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  Animated,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { User, GraduationCap, MapPin, Globe, BookOpen, Camera, ArrowRight, Navigation, CircleCheck as CheckCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import ScrollableDropdown from '@/components/ScrollableDropdown';
import ProgressBar from '@/components/ProgressBar';

// Import data
import nameData from '@/data/name-suggestions.json';
import locationData from '@/data/locations.json';
import educationData from '@/data/education-boards.json';

interface UserProfile {
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  class: string;
  country: string;
  state: string;
  educationBoard: string;
}

interface LocationData {
  country: string;
  state: string;
}

const CLASS_OPTIONS = [
  { label: 'Class 1', value: 'class-1' },
  { label: 'Class 2', value: 'class-2' },
  { label: 'Class 3', value: 'class-3' },
  { label: 'Class 4', value: 'class-4' },
  { label: 'Class 5', value: 'class-5' },
  { label: 'Class 6', value: 'class-6' },
  { label: 'Class 7', value: 'class-7' },
  { label: 'Class 8', value: 'class-8' },
  { label: 'Class 9', value: 'class-9' },
  { label: 'Class 10', value: 'class-10' },
  { label: 'Class 11', value: 'class-11' },
  { label: 'Class 12', value: 'class-12' },
  { label: 'Entrance Exam', value: 'entrance-exam' },
  { label: 'Dropper', value: 'dropper' },
  { label: 'Others', value: 'others' },
];

export default function BoardingScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    profilePhoto: undefined,
    class: '',
    country: '',
    state: '',
    educationBoard: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<LocationData | null>(null);
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Animation values
  const slideAnim = useState(new Animated.Value(0))[0];
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    if (currentStep === 3) {
      detectLocation();
    }
  }, [currentStep]);

  useEffect(() => {
    // Animate step transition
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const detectLocation = async () => {
    if (Platform.OS === 'web') {
      // For web, simulate location detection
      setIsDetectingLocation(true);
      setTimeout(() => {
        setDetectedLocation({ country: 'India', state: 'Maharashtra' });
        setIsDetectingLocation(false);
      }, 2000);
      return;
    }

    setIsDetectingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setIsDetectingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const { country, region } = reverseGeocode[0];
        if (country && region) {
          setDetectedLocation({ country, state: region });
        }
      }
    } catch (error) {
      console.error('Location detection failed:', error);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const confirmLocation = () => {
    if (detectedLocation) {
      setProfile(prev => ({
        ...prev,
        country: detectedLocation.country,
        state: detectedLocation.state
      }));
      setLocationConfirmed(true);
    }
  };

  const rejectLocation = () => {
    setDetectedLocation(null);
    setLocationConfirmed(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfile(prev => ({ ...prev, profilePhoto: result.assets[0].uri }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    switch (step) {
      case 1:
        if (!profile.firstName.trim()) {
          newErrors.firstName = 'First name is required';
        }
        if (!profile.lastName.trim()) {
          newErrors.lastName = 'Last name is required';
        }
        break;
      case 2:
        if (!profile.class) {
          newErrors.class = 'Please select your class';
        }
        break;
      case 3:
        if (!profile.country) {
          newErrors.country = 'Please select your country';
        }
        if (!profile.state) {
          newErrors.state = 'Please select your state/province';
        }
        break;
      case 4:
        if (!profile.educationBoard) {
          newErrors.educationBoard = 'Please select your education board';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        // Animate out current step
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: -50,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setCurrentStep(currentStep + 1);
          slideAnim.setValue(50);
        });
      } else {
        handleSave();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      // Animate out current step
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(currentStep - 1);
        slideAnim.setValue(-50);
      });
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save user profile
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      // Mark onboarding as completed
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      
      console.log('Profile saved successfully:', profile);
      console.log('Onboarding marked as completed');
      
      // Navigate to main app
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Failed to save profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getCountryOptions = () => {
    return locationData.countries
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(country => ({
        label: country.name,
        value: country.code
      }));
  };

  const getStateOptions = () => {
    const selectedCountry = locationData.countries.find(c => c.code === profile.country);
    if (!selectedCountry) return [];
    
    return selectedCountry.states
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(state => ({
        label: state.name,
        value: state.code
      }));
  };

  const getEducationBoardOptions = () => {
    return educationData.boards
      .filter(board => board.countries.includes(profile.country) || board.countries.includes('OTHER'))
      .map(board => ({
        label: board.name,
        value: board.code
      }));
  };

  const renderStep1 = () => (
    <Animated.View 
      style={[
        styles.stepContainer,
        {
          transform: [{ translateX: slideAnim }],
          opacity: fadeAnim,
        }
      ]}
    >
      <Text style={styles.stepTitle}>Personal Information</Text>
      <Text style={styles.stepSubtitle}>Let's start with your basic details</Text>

      {/* Profile Photo */}
      <View style={styles.photoContainer}>
        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          {profile.profilePhoto ? (
            <Image source={{ uri: profile.profilePhoto }} style={styles.profileImage} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Camera size={32} color="#9CA3AF" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.photoLabel}>Add Profile Photo (Optional)</Text>
      </View>

      {/* Name Fields Row */}
      <View style={styles.nameFieldsContainer}>
        {/* First Name */}
        <View style={styles.nameFieldWrapper}>
          <View style={styles.inputHeader}>
            <User size={20} color="#2563EB" />
            <Text style={styles.inputLabel}>First Name</Text>
          </View>
          <TextInput
            style={[styles.nameInput, errors.firstName && styles.inputError]}
            value={profile.firstName}
            onChangeText={(text) => updateProfile('firstName', text)}
            placeholder="First name"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
            autoCorrect={false}
          />
          {errors.firstName && (
            <Text style={styles.errorText}>{errors.firstName}</Text>
          )}
        </View>

        {/* Last Name */}
        <View style={styles.nameFieldWrapper}>
          <View style={styles.inputHeader}>
            <User size={20} color="#2563EB" />
            <Text style={styles.inputLabel}>Last Name</Text>
          </View>
          <TextInput
            style={[styles.nameInput, errors.lastName && styles.inputError]}
            value={profile.lastName}
            onChangeText={(text) => updateProfile('lastName', text)}
            placeholder="Last name"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
            autoCorrect={false}
          />
          {errors.lastName && (
            <Text style={styles.errorText}>{errors.lastName}</Text>
          )}
        </View>
      </View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View 
      style={[
        styles.stepContainer,
        {
          transform: [{ translateX: slideAnim }],
          opacity: fadeAnim,
        }
      ]}
    >
      <Text style={styles.stepTitle}>Academic Information</Text>
      <Text style={styles.stepSubtitle}>Tell us about your current grade level</Text>

      <ScrollableDropdown
        value={profile.class}
        onSelect={(value) => updateProfile('class', value)}
        options={CLASS_OPTIONS}
        placeholder="Select your class/grade"
        label="Class/Grade"
        icon={<GraduationCap size={20} color="#2563EB" />}
        error={errors.class}
        maxHeight={300}
      />
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View 
      style={[
        styles.stepContainer,
        {
          transform: [{ translateX: slideAnim }],
          opacity: fadeAnim,
        }
      ]}
    >
      <Text style={styles.stepTitle}>Location Details</Text>
      <Text style={styles.stepSubtitle}>Help us personalize your experience</Text>

      {/* GPS Detection */}
      {!locationConfirmed && (
        <View style={styles.locationDetection}>
          {isDetectingLocation ? (
            <View style={styles.detectingContainer}>
              <Navigation size={24} color="#2563EB" />
              <Text style={styles.detectingText}>Detecting your location...</Text>
            </View>
          ) : detectedLocation ? (
            <View style={styles.locationConfirmation}>
              <View style={styles.locationInfo}>
                <MapPin size={20} color="#059669" />
                <Text style={styles.locationText}>
                  We detected you're in {detectedLocation.country}, {detectedLocation.state}
                </Text>
              </View>
              <Text style={styles.confirmQuestion}>Is this correct?</Text>
              <View style={styles.locationButtons}>
                <TouchableOpacity style={styles.confirmButton} onPress={confirmLocation}>
                  <CheckCircle size={16} color="#FFFFFF" />
                  <Text style={styles.confirmButtonText}>Yes, correct</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton} onPress={rejectLocation}>
                  <Text style={styles.rejectButtonText}>No, let me select</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.detectButton} onPress={detectLocation}>
              <Navigation size={20} color="#2563EB" />
              <Text style={styles.detectButtonText}>Detect My Location</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Manual Selection */}
      {(!detectedLocation || !locationConfirmed) && (
        <View style={styles.locationSelectionContainer}>
          <ScrollableDropdown
            value={profile.country}
            onSelect={(value) => {
              updateProfile('country', value);
              updateProfile('state', ''); // Reset state when country changes
            }}
            options={getCountryOptions()}
            placeholder="Select your country"
            label="Country"
            icon={<Globe size={20} color="#2563EB" />}
            error={errors.country}
            maxHeight={250}
          />

          {profile.country && (
            <ScrollableDropdown
              value={profile.state}
              onSelect={(value) => updateProfile('state', value)}
              options={getStateOptions()}
              placeholder="Select your state/province"
              label="State/Province"
              icon={<MapPin size={20} color="#2563EB" />}
              error={errors.state}
              maxHeight={250}
            />
          )}
        </View>
      )}

      {/* Confirmed Location Display */}
      {locationConfirmed && (
        <View style={styles.confirmedLocation}>
          <View style={styles.locationHeader}>
            <CheckCircle size={20} color="#059669" />
            <Text style={styles.confirmedText}>Location Confirmed</Text>
          </View>
          <Text style={styles.confirmedDetails}>
            {profile.country}, {profile.state}
          </Text>
          <TouchableOpacity 
            style={styles.changeLocationButton}
            onPress={() => {
              setLocationConfirmed(false);
              setDetectedLocation(null);
              setProfile(prev => ({ ...prev, country: '', state: '' }));
            }}
          >
            <Text style={styles.changeLocationText}>Change Location</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );

  const renderStep4 = () => (
    <Animated.View 
      style={[
        styles.stepContainer,
        {
          transform: [{ translateX: slideAnim }],
          opacity: fadeAnim,
        }
      ]}
    >
      <Text style={styles.stepTitle}>Education Board</Text>
      <Text style={styles.stepSubtitle}>Select your curriculum or education system</Text>

      <ScrollableDropdown
        value={profile.educationBoard}
        onSelect={(value) => updateProfile('educationBoard', value)}
        options={getEducationBoardOptions()}
        placeholder="Select your education board"
        label="Education Board"
        icon={<BookOpen size={20} color="#2563EB" />}
        error={errors.educationBoard}
        maxHeight={300}
      />
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <GraduationCap size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.headerTitle}>Complete Your Profile</Text>
          <Text style={styles.headerSubtitle}>
            Step {currentStep} of 4
          </Text>
        </View>

        {/* Fluid Progress Bar */}
        <View style={styles.progressContainer}>
          <ProgressBar 
            progress={currentStep / 4} 
            color="#2563EB" 
            height={4}
            animated={true}
          />
        </View>

        {/* Step Content */}
        <View style={styles.content}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigation}>
          {currentStep > 1 && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[
              styles.nextButton,
              isLoading && styles.nextButtonDisabled,
              currentStep === 1 && styles.nextButtonFull
            ]}
            onPress={handleNext}
            disabled={isLoading}
          >
            <Text style={styles.nextButtonText}>
              {isLoading ? 'Saving...' : currentStep === 4 ? 'Complete Setup' : 'Continue'}
            </Text>
            {!isLoading && <ArrowRight size={20} color="#FFFFFF" />}
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  content: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  stepContainer: {
    minHeight: 400,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 12,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  photoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  nameFieldsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  nameFieldWrapper: {
    flex: 1,
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginLeft: 8,
  },
  nameInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    marginTop: 4,
  },
  locationDetection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detectingContainer: {
    alignItems: 'center',
  },
  detectingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
    marginTop: 8,
  },
  locationConfirmation: {
    alignItems: 'center',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#059669',
    marginLeft: 8,
    textAlign: 'center',
  },
  confirmQuestion: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  locationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  rejectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  rejectButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  detectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
  },
  detectButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginLeft: 8,
  },
  locationSelectionContainer: {
    gap: 0,
  },
  confirmedLocation: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  confirmedText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
    marginLeft: 8,
  },
  confirmedDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    marginBottom: 12,
  },
  changeLocationButton: {
    alignSelf: 'flex-start',
  },
  changeLocationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  navigation: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  nextButton: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginRight: 8,
  },
});