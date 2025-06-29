import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions,
  Platform,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  Camera, 
  Brain, 
  Shield, 
  ArrowRight, 
  ArrowLeft,
  CircleCheck as CheckCircle,
  Zap,
  BookOpen,
  Target,
  Smartphone,
  Monitor
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const onboardingSteps = [
  {
    id: 1,
    title: 'Welcome to AI Study Assistant',
    subtitle: 'Your intelligent learning companion',
    description: 'Transform your study materials into interactive learning experiences with the power of AI. Get instant explanations, step-by-step solutions, and personalized guidance.',
    icon: BookOpen,
    color: '#2563EB',
    features: [
      'Instant problem solving',
      'Step-by-step explanations', 
      'Multi-subject support',
      'Personalized learning'
    ],
    image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 2,
    title: 'Scan Your Study Materials',
    subtitle: 'Point, scan, and learn instantly',
    description: 'Simply use your camera to scan textbooks, handwritten notes, worksheets, or any study material. Our advanced AI will instantly recognize and process the content.',
    icon: Camera,
    color: '#059669',
    features: [
      'Works with any text or math',
      'Handwriting recognition',
      'Multiple languages supported',
      'High accuracy scanning'
    ],
    image: 'https://images.pexels.com/photos/6256065/pexels-photo-6256065.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 3,
    title: 'AI-Powered Understanding',
    subtitle: 'Get intelligent explanations instantly',
    description: 'Our AI analyzes your scanned content and provides detailed explanations, alternative solution methods, and helps you understand the underlying concepts.',
    icon: Brain,
    color: '#EA580C',
    features: [
      'Detailed step-by-step solutions',
      'Concept explanations',
      'Multiple solving approaches',
      'Learning tips and tricks'
    ],
    image: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 4,
    title: 'Privacy-First Learning',
    subtitle: 'Your data stays secure and private',
    description: 'All AI processing happens locally on your device. Your study materials and conversations never leave your phone, ensuring complete privacy and security.',
    icon: Shield,
    color: '#7C3AED',
    features: [
      'Complete offline functionality',
      'No data sent to servers',
      'Local AI processing',
      'You control your information'
    ],
    image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if we're on desktop/web
    setIsDesktop(Platform.OS === 'web' && screenWidth >= 768);
  }, []);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      if (isDesktop) {
        router.replace('/desktop-scan');
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
      if (isDesktop) {
        router.replace('/desktop-scan');
      } else {
        router.replace('/(tabs)');
      }
    }
  };

  const step = onboardingSteps[currentStep];
  const IconComponent = step.icon;
  const isLastStep = currentStep === onboardingSteps.length - 1;

  if (!isDesktop) {
    // For mobile, show simplified onboarding
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.mobileContainer}>
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            {onboardingSteps.map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.progressDot,
                  index <= currentStep ? styles.progressDotActive : styles.progressDotInactive
                ]} 
              />
            ))}
          </View>

          {/* Skip Button */}
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          {/* Content */}
          <View style={styles.mobileContent}>
            <View style={[styles.iconContainer, { backgroundColor: step.color }]}>
              <IconComponent size={48} color="#FFFFFF" />
            </View>

            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>

            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Key Features:</Text>
              {step.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <CheckCircle size={16} color={step.color} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Navigation */}
          <View style={styles.mobileNavigation}>
            <TouchableOpacity 
              style={[styles.nextButton, { backgroundColor: step.color }]}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>
                {isLastStep ? 'Get Started' : 'Continue'}
              </Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Desktop onboarding layout
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.desktopContainer}>
        {/* Header */}
        <View style={styles.desktopHeader}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <BookOpen size={32} color="#2563EB" />
            </View>
            <Text style={styles.logoText}>AI Study Assistant</Text>
          </View>
          
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip Tour</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.desktopProgressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${((currentStep + 1) / onboardingSteps.length) * 100}%`,
                  backgroundColor: step.color 
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentStep + 1} of {onboardingSteps.length}
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.desktopContent}>
          {/* Left Side - Content */}
          <View style={styles.contentLeft}>
            <View style={styles.stepIndicator}>
              <View style={[styles.stepIcon, { backgroundColor: step.color }]}>
                <IconComponent size={32} color="#FFFFFF" />
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepNumber}>Step {currentStep + 1}</Text>
                <Text style={styles.stepTitle}>{step.title}</Text>
              </View>
            </View>

            <Text style={styles.subtitle}>{step.subtitle}</Text>
            <Text style={styles.desktopDescription}>{step.description}</Text>

            <View style={styles.desktopFeatures}>
              <Text style={styles.featuresTitle}>What you'll get:</Text>
              <View style={styles.featuresGrid}>
                {step.features.map((feature, index) => (
                  <View key={index} style={styles.desktopFeatureItem}>
                    <CheckCircle size={18} color={step.color} />
                    <Text style={styles.desktopFeatureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Device Compatibility */}
            <View style={styles.compatibilitySection}>
              <Text style={styles.compatibilityTitle}>Works on all your devices:</Text>
              <View style={styles.deviceIcons}>
                <View style={styles.deviceItem}>
                  <Smartphone size={24} color="#6B7280" />
                  <Text style={styles.deviceText}>Mobile</Text>
                </View>
                <View style={styles.deviceItem}>
                  <Monitor size={24} color="#6B7280" />
                  <Text style={styles.deviceText}>Desktop</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Right Side - Visual */}
          <View style={styles.contentRight}>
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: step.image }} 
                style={styles.stepImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay}>
                <View style={[styles.overlayIcon, { backgroundColor: step.color }]}>
                  <IconComponent size={40} color="#FFFFFF" />
                </View>
              </View>
            </View>

            {/* Feature Highlights */}
            <View style={styles.highlights}>
              <View style={[styles.highlight, { borderLeftColor: step.color }]}>
                <Zap size={20} color={step.color} />
                <Text style={styles.highlightText}>Instant Results</Text>
              </View>
              <View style={[styles.highlight, { borderLeftColor: step.color }]}>
                <Target size={20} color={step.color} />
                <Text style={styles.highlightText}>High Accuracy</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Navigation */}
        <View style={styles.desktopNavigation}>
          <TouchableOpacity 
            style={[styles.navButton, styles.prevButton, currentStep === 0 && styles.navButtonDisabled]}
            onPress={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft size={20} color={currentStep === 0 ? "#D1D5DB" : "#6B7280"} />
            <Text style={[styles.navButtonText, currentStep === 0 && styles.navButtonTextDisabled]}>
              Previous
            </Text>
          </TouchableOpacity>

          <View style={styles.stepDots}>
            {onboardingSteps.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.stepDot,
                  index === currentStep && { backgroundColor: step.color },
                  index < currentStep && { backgroundColor: '#D1FAE5' }
                ]}
                onPress={() => setCurrentStep(index)}
              />
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.navButton, styles.nextButton, { backgroundColor: step.color }]}
            onPress={handleNext}
          >
            <Text style={styles.nextNavButtonText}>
              {isLastStep ? 'Start Learning' : 'Next'}
            </Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Mobile Styles
  mobileContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#2563EB',
  },
  progressDotInactive: {
    backgroundColor: '#E5E7EB',
  },
  skipButton: {
    position: 'absolute',
    top: 20,
    right: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  mobileContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresContainer: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  mobileNavigation: {
    paddingBottom: 32,
  },
  nextButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginRight: 8,
  },

  // Desktop Styles
  desktopContainer: {
    flex: 1,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 32,
  },
  desktopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
  },
  desktopProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    gap: 16,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    minWidth: 60,
  },
  desktopContent: {
    flex: 1,
    flexDirection: 'row',
    gap: 48,
    paddingVertical: 32,
  },
  contentLeft: {
    flex: 1,
    paddingRight: 24,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  stepIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepInfo: {
    flex: 1,
  },
  stepNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 16,
  },
  desktopDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 26,
    marginBottom: 32,
  },
  desktopFeatures: {
    marginBottom: 32,
  },
  featuresGrid: {
    gap: 12,
  },
  desktopFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  desktopFeatureText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    marginLeft: 12,
  },
  compatibilitySection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
  },
  compatibilityTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  deviceIcons: {
    flexDirection: 'row',
    gap: 24,
  },
  deviceItem: {
    alignItems: 'center',
    gap: 8,
  },
  deviceText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  contentRight: {
    flex: 1,
    paddingLeft: 24,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 16,
  },
  stepImage: {
    width: '100%',
    height: 300,
  },
  imageOverlay: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  overlayIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlights: {
    gap: 16,
  },
  highlight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  highlightText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginLeft: 12,
  },
  desktopNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 32,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  prevButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginLeft: 8,
  },
  navButtonTextDisabled: {
    color: '#D1D5DB',
  },
  stepDots: {
    flexDirection: 'row',
    gap: 8,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    cursor: 'pointer',
  },
  nextNavButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginRight: 8,
  },
});