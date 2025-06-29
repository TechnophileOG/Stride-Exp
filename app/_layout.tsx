import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreenComponent from '@/components/SplashScreen';
import { Platform } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && isOnboardingComplete !== null && !showSplash) {
      if (Platform.OS !== 'web') {
        SplashScreen.hideAsync();
      }
    }
  }, [fontsLoaded, fontError, isOnboardingComplete, showSplash]);

  const initializeApp = async () => {
    try {
      // Add delay for web platform to ensure AsyncStorage is ready
      if (Platform.OS === 'web') {
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      await checkOnboardingStatus();
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setIsOnboardingComplete(false);
    }
  };

  const checkOnboardingStatus = async () => {
    try {
      const onboardingStatus = await AsyncStorage.getItem('onboardingCompleted');
      const userProfile = await AsyncStorage.getItem('userProfile');
      
      // Both onboarding flag AND user profile must exist for completion
      const isComplete = onboardingStatus === 'true' && userProfile !== null;
      
      console.log('Onboarding check:', {
        platform: Platform.OS,
        onboardingStatus,
        hasUserProfile: userProfile !== null,
        userProfile: userProfile ? JSON.parse(userProfile) : null,
        isComplete
      });
      
      setIsOnboardingComplete(isComplete);
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
      // Default to requiring onboarding on error
      setIsOnboardingComplete(false);
    }
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Show loading state while checking onboarding status
  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (isOnboardingComplete === null || showSplash) {
    return <SplashScreenComponent onAnimationComplete={handleSplashComplete} />;
  }

  // Always render all screens but control initial route
  return (
    <>
      <Stack 
        screenOptions={{ headerShown: false }}
        initialRouteName={isOnboardingComplete ? "(tabs)" : "onboarding"}
      >
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="boarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}