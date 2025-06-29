import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { QrCode, Smartphone, Download, ArrowRight, CircleCheck as CheckCircle, Camera, Brain, Shield, BookOpen, Zap, Target, Users, Star } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function DesktopScanScreen() {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    // Generate QR code URL - in a real app, this would be dynamic
    const appUrl = 'https://your-app-url.com/download';
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}`);
  }, []);

  const features = [
    {
      icon: Camera,
      title: 'Instant Scanning',
      description: 'Point your camera at any study material for instant AI analysis',
      color: '#2563EB'
    },
    {
      icon: Brain,
      title: 'Smart AI Tutor',
      description: 'Get step-by-step explanations and personalized learning guidance',
      color: '#059669'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All processing happens on your device - your data stays private',
      color: '#EA580C'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get answers in seconds with our optimized AI processing',
      color: '#7C3AED'
    }
  ];

  const stats = [
    { icon: Users, value: '50K+', label: 'Active Students' },
    { icon: BookOpen, value: '1M+', label: 'Problems Solved' },
    { icon: Target, value: '95%', label: 'Accuracy Rate' },
    { icon: Star, value: '4.9', label: 'App Rating' }
  ];

  const handleBackToOnboarding = () => {
    router.push('/onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <BookOpen size={32} color="#2563EB" />
            </View>
            <Text style={styles.logoText}>AI Study Assistant</Text>
          </View>
          
          <TouchableOpacity style={styles.backButton} onPress={handleBackToOnboarding}>
            <Text style={styles.backButtonText}>← Back to Tour</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mainContent}>
          {/* Left Side - QR Code and Instructions */}
          <View style={styles.leftContent}>
            <View style={styles.qrSection}>
              <Text style={styles.mainTitle}>Get Started on Mobile</Text>
              <Text style={styles.subtitle}>
                Scan the QR code with your phone to download the AI Study Assistant app
              </Text>

              <View style={styles.qrContainer}>
                <View style={styles.qrCodeWrapper}>
                  {qrCodeUrl ? (
                    <Image 
                      source={{ uri: qrCodeUrl }} 
                      style={styles.qrCode}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.qrPlaceholder}>
                      <QrCode size={120} color="#6B7280" />
                    </View>
                  )}
                </View>
                <View style={styles.qrLabel}>
                  <Smartphone size={20} color="#2563EB" />
                  <Text style={styles.qrLabelText}>Scan with your phone camera</Text>
                </View>
              </View>

              <View style={styles.downloadOptions}>
                <Text style={styles.downloadTitle}>Or download directly:</Text>
                <View style={styles.downloadButtons}>
                  <TouchableOpacity style={styles.downloadButton}>
                    <Download size={20} color="#FFFFFF" />
                    <Text style={styles.downloadButtonText}>App Store</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.downloadButton}>
                    <Download size={20} color="#FFFFFF" />
                    <Text style={styles.downloadButtonText}>Google Play</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* How it Works */}
            <View style={styles.howItWorks}>
              <Text style={styles.sectionTitle}>How it works</Text>
              <View style={styles.steps}>
                <View style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Download & Open</Text>
                    <Text style={styles.stepDescription}>
                      Install the app on your mobile device and open it
                    </Text>
                  </View>
                </View>
                <View style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Scan Your Material</Text>
                    <Text style={styles.stepDescription}>
                      Point your camera at textbooks, notes, or worksheets
                    </Text>
                  </View>
                </View>
                <View style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Get AI Assistance</Text>
                    <Text style={styles.stepDescription}>
                      Receive instant explanations and step-by-step solutions
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Right Side - Features and Benefits */}
          <View style={styles.rightContent}>
            {/* Stats */}
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>Trusted by students worldwide</Text>
              <View style={styles.statsGrid}>
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <View key={index} style={styles.statCard}>
                      <IconComponent size={24} color="#2563EB" />
                      <Text style={styles.statValue}>{stat.value}</Text>
                      <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Features */}
            <View style={styles.featuresSection}>
              <Text style={styles.sectionTitle}>Why students love our app</Text>
              <View style={styles.featuresGrid}>
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <View key={index} style={styles.featureCard}>
                      <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                        <IconComponent size={24} color="#FFFFFF" />
                      </View>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureDescription}>{feature.description}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Testimonial */}
            <View style={styles.testimonial}>
              <View style={styles.testimonialContent}>
                <Text style={styles.testimonialText}>
                  "This app has completely transformed how I study. The AI explanations are so clear and helpful!"
                </Text>
                <View style={styles.testimonialAuthor}>
                  <View style={styles.authorAvatar}>
                    <Text style={styles.authorInitial}>S</Text>
                  </View>
                  <View>
                    <Text style={styles.authorName}>Sarah Chen</Text>
                    <Text style={styles.authorTitle}>Computer Science Student</Text>
                  </View>
                </View>
              </View>
              <View style={styles.testimonialRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} color="#FCD34D" fill="#FCD34D" />
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Ready to revolutionize your learning experience?
          </Text>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Download Now</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
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
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  mainContent: {
    flexDirection: 'row',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 32,
    paddingVertical: 48,
    gap: 64,
  },
  leftContent: {
    flex: 1,
  },
  qrSection: {
    marginBottom: 48,
  },
  mainTitle: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
    marginBottom: 16,
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 32,
    lineHeight: 28,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  qrCodeWrapper: {
    width: 200,
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 16,
  },
  qrCode: {
    width: 160,
    height: 160,
  },
  qrPlaceholder: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  qrLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qrLabelText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  downloadOptions: {
    alignItems: 'center',
  },
  downloadTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 16,
  },
  downloadButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  howItWorks: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 24,
  },
  steps: {
    gap: 24,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 24,
  },
  rightContent: {
    flex: 1,
    gap: 32,
  },
  statsSection: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: 120,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  featuresSection: {},
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  testimonial: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  testimonialContent: {
    marginBottom: 16,
  },
  testimonialText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 16,
  },
  testimonialAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInitial: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  authorName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  authorTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  testimonialRating: {
    flexDirection: 'row',
    gap: 4,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
    backgroundColor: '#F9FAFB',
  },
  footerText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});