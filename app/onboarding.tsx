import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Camera, Brain, Shield, ArrowRight, CircleCheck as CheckCircle } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

const onboardingSteps = [
  {
    id: 1,
    title: 'Scan Your Study Materials',
    description: 'Simply point your camera at textbooks, handwritten notes, or problem sets. Our AI will instantly recognize and process the content.',
    icon: Camera,
    color: '#2563EB',
    tips: ['Ensure good lighting', 'Keep text clearly visible', 'Avoid shadows and glare']
  },
  {
    id: 2,
    title: 'AI-Powered Understanding',
    description: 'Google\'s Gemma 3B model processes everything locally on your device, providing instant explanations and step-by-step solutions.',
    icon: Brain,
    color: '#059669',
    tips: ['Works completely offline', 'Supports multiple subjects', 'Adapts to your learning style']
  },
  {
    id: 3,
    title: 'Your Privacy Protected',
    description: 'All processing happens on your device. Your study materials and conversations never leave your phone, ensuring complete privacy.',
    icon: Shield,
    color: '#EA580C',
    tips: ['No data sent to servers', 'Complete offline functionality', 'You control your data']
  }
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to detailed profile setup (boarding screen)
      router.replace('/boarding');
    }
  };

  const handleSkip = () => {
    // Navigate to detailed profile setup (boarding screen)
    router.replace('/boarding');
  };

  const step = onboardingSteps[currentStep];
  const IconComponent = step.icon;

  return (
    <SafeAreaView style={styles.container}>
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
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: step.color }]}>
          <IconComponent size={48} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.description}>{step.description}</Text>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Key Features:</Text>
          {step.tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <CheckCircle size={16} color={step.color} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity 
          style={[styles.nextButton, { backgroundColor: step.color }]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
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
    top: 60,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
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
  tipsContainer: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  navigation: {
    paddingHorizontal: 32,
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
});