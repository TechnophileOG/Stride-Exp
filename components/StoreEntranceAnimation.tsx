import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { ShoppingBag, BookOpen, Star, Heart } from 'lucide-react-native';

interface StoreEntranceAnimationProps {
  onAnimationComplete: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function StoreEntranceAnimation({ onAnimationComplete }: StoreEntranceAnimationProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // Individual icon animations
  const icon1Anim = useRef(new Animated.Value(0)).current;
  const icon2Anim = useRef(new Animated.Value(0)).current;
  const icon3Anim = useRef(new Animated.Value(0)).current;
  const icon4Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the animation sequence
    Animated.sequence([
      // Main logo animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      
      // Floating icons animation
      Animated.stagger(150, [
        Animated.timing(icon1Anim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(icon2Anim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(icon3Anim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(icon4Anim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      
      // Rotation effect
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      
      // Hold for a moment
      Animated.delay(600),
      
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onAnimationComplete();
    });
  }, []);

  const logoRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />
      
      {/* Floating Icons */}
      <Animated.View
        style={[
          styles.floatingIcon,
          styles.icon1,
          {
            opacity: icon1Anim,
            transform: [
              {
                translateY: icon1Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <BookOpen size={24} color="#2563EB" />
      </Animated.View>
      
      <Animated.View
        style={[
          styles.floatingIcon,
          styles.icon2,
          {
            opacity: icon2Anim,
            transform: [
              {
                translateY: icon2Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Star size={20} color="#F59E0B" />
      </Animated.View>
      
      <Animated.View
        style={[
          styles.floatingIcon,
          styles.icon3,
          {
            opacity: icon3Anim,
            transform: [
              {
                translateY: icon3Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Heart size={18} color="#EF4444" />
      </Animated.View>
      
      <Animated.View
        style={[
          styles.floatingIcon,
          styles.icon4,
          {
            opacity: icon4Anim,
            transform: [
              {
                translateY: icon4Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <BookOpen size={22} color="#059669" />
      </Animated.View>

      {/* Main Logo Container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim },
              { rotate: logoRotation },
            ],
          },
        ]}
      >
        <View style={styles.logoBackground}>
          <ShoppingBag size={80} color="#FFFFFF" />
        </View>
        <Text style={styles.appName}>Book Store</Text>
        <Text style={styles.tagline}>Discover Knowledge</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  logoContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoBackground: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
  },
  appName: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  floatingIcon: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  icon1: {
    top: screenHeight * 0.25,
    left: screenWidth * 0.15,
  },
  icon2: {
    top: screenHeight * 0.3,
    right: screenWidth * 0.2,
  },
  icon3: {
    bottom: screenHeight * 0.3,
    left: screenWidth * 0.2,
  },
  icon4: {
    bottom: screenHeight * 0.25,
    right: screenWidth * 0.15,
  },
});