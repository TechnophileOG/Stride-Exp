import { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  Animated
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Brain, User, Lightbulb, BookOpen, Calculator, Camera, X, FlashlightOff as FlashOff, Slash as FlashOn, RotateCcw, Zap } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'guru';
  timestamp: Date;
  type?: 'solution' | 'explanation' | 'steps';
  imageUri?: string;
}

export default function GuruScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "🙏 Namaste! I am your AI Guru, here to guide you on your learning journey. Share your study materials with me - scan them with the camera or ask me any question. I'll provide wisdom and step-by-step guidance to help you understand deeply.",
      sender: 'guru',
      timestamp: new Date(),
      type: 'explanation'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (showCamera) {
      // Pulse animation for scanning overlay
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Scan line animation
      Animated.loop(
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        })
      ).start();
    }
  }, [showCamera]);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const sendMessage = async (messageText?: string, imageUri?: string) => {
    const textToSend = messageText || inputText;
    if (textToSend.trim() === '' && !imageUri) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: imageUri ? 'I\'ve shared an image with you. Please analyze it and help me understand.' : textToSend,
      sender: 'user',
      timestamp: new Date(),
      imageUri: imageUri,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      const guruResponse: Message = {
        id: Date.now().toString() + '_guru',
        text: getGuruResponse(textToSend, !!imageUri),
        sender: 'guru',
        timestamp: new Date(),
        type: imageUri ? 'solution' : 'explanation'
      };
      setMessages(prev => [...prev, guruResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const getGuruResponse = (input: string, hasImage: boolean): string => {
    if (hasImage) {
      return "🔍 I can see your study material clearly. This appears to be a mathematical problem. Let me guide you through the solution:\n\n📚 **Step-by-step approach:**\n\n1. **Identify the problem type** - This looks like a quadratic equation\n2. **Apply the formula** - We'll use the quadratic formula: x = (-b ± √(b²-4ac)) / 2a\n3. **Substitute values** - Let's identify a=1, b=-5, c=6\n4. **Calculate** - x = (5 ± √(25-24)) / 2 = (5 ± 1) / 2\n5. **Final answer** - x = 3 or x = 2\n\n💡 **Understanding the concept:** Quadratic equations represent parabolas and help us find where the curve crosses the x-axis. This knowledge is fundamental for advanced mathematics.\n\nDo you have any questions about this solution, my dear student?";
    }
    
    // Simulate intelligent responses based on input
    if (input.toLowerCase().includes('solve')) {
      return "🧮 **Mathematical Wisdom:**\n\nLet me guide you through this problem step by step:\n\n1. **Understand the question** - Read carefully and identify what's being asked\n2. **Gather known information** - List all given values and formulas\n3. **Choose the right method** - Select the most appropriate approach\n4. **Work systematically** - Solve step by step, showing all work\n5. **Verify your answer** - Check if the solution makes sense\n\n✨ Remember: Mathematics is not about memorizing formulas, but understanding patterns and relationships. Each problem teaches us something new about the beautiful logic of numbers.";
    } else if (input.toLowerCase().includes('explain')) {
      return "📖 **Deeper Understanding:**\n\nTrue learning comes from understanding the 'why' behind concepts, not just the 'how'. Let me illuminate this topic for you:\n\n🌟 **Core Concept:** Every subject has fundamental principles that connect to create a beautiful web of knowledge.\n\n🔗 **Connections:** This concept relates to other topics you've learned, creating a stronger foundation.\n\n🎯 **Application:** Understanding this will help you solve similar problems and think more critically.\n\n💭 **Reflection:** Take a moment to think about how this fits into the bigger picture of your studies.\n\nWhat specific aspect would you like me to explore further, my thoughtful student?";
    } else if (input.toLowerCase().includes('help')) {
      return "🙏 **Your Learning Journey:**\n\nI am here to be your guide and mentor. Here's how I can assist you:\n\n📸 **Scan & Analyze** - Use the camera to capture any study material\n🧠 **Step-by-step Solutions** - Break down complex problems into manageable steps\n💡 **Concept Explanations** - Understand the deeper meaning behind topics\n🎯 **Practice Guidance** - Get personalized learning recommendations\n🌟 **Wisdom Sharing** - Learn study techniques and mental models\n\n**Remember:** The path of learning is a journey, not a destination. Every question you ask makes you wiser. I'm honored to walk this path with you.\n\nWhat would you like to explore today?";
    }
    return "🌸 **Thoughtful Response:**\n\nI sense your curiosity and eagerness to learn. This is the mark of a true scholar.\n\n🧘‍♂️ **Guru's Wisdom:** Every question is a seed of knowledge waiting to bloom. Let me nurture your understanding with detailed explanations and practical guidance.\n\n📚 **Learning Approach:**\n- Break complex topics into simple, digestible parts\n- Connect new knowledge to what you already know\n- Practice with real examples and applications\n- Reflect on the deeper meaning and significance\n\n✨ **Remember:** The wise student asks not just 'what' and 'how', but also 'why' and 'what if'. Your questions show great wisdom.\n\nHow can I guide you further on this beautiful journey of discovery?";
  };

  const handleCameraPress = () => {
    if (!permission) {
      requestPermission();
      return;
    }
    
    if (!permission.granted) {
      Alert.alert(
        'Camera Permission Required',
        'We need camera access to scan your study materials and provide AI-powered assistance.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Grant Permission', onPress: requestPermission }
        ]
      );
      return;
    }

    setShowCamera(true);
  };

  const handleCapture = async () => {
    setIsScanning(true);
    
    // Simulate image capture and processing
    setTimeout(() => {
      setIsScanning(false);
      setShowCamera(false);
      
      // Send message with simulated image
      sendMessage('', 'simulated-image-uri');
    }, 2000);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
  };

  const handleQuickAction = (action: string) => {
    if (action === 'explain') {
      sendMessage('Please explain this concept in detail');
    } else if (action === 'solve') {
      sendMessage('Please solve this step by step');
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    
    return (
      <View key={message.id} style={[styles.messageContainer, isUser ? styles.userMessage : styles.guruMessage]}>
        <View style={styles.messageHeader}>
          <View style={[styles.avatar, isUser ? styles.userAvatar : styles.guruAvatar]}>
            {isUser ? <User size={16} color="#FFFFFF" /> : <Brain size={16} color="#FFFFFF" />}
          </View>
          <Text style={styles.messageTime}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.guruBubble]}>
          {!isUser && message.type && (
            <View style={styles.messageTypeIcon}>
              {message.type === 'solution' && <Calculator size={16} color="#059669" />}
              {message.type === 'explanation' && <BookOpen size={16} color="#7C3AED" />}
              {message.type === 'steps' && <Lightbulb size={16} color="#EA580C" />}
            </View>
          )}
          <Text style={[styles.messageText, isUser ? styles.userText : styles.guruText]}>
            {message.text}
          </Text>
        </View>
      </View>
    );
  };

  if (showCamera) {
    return (
      <SafeAreaView style={styles.cameraContainer}>
        <CameraView 
          style={styles.camera} 
          facing={facing}
          flash={flashEnabled ? 'on' : 'off'}
        >
          {/* Header */}
          <View style={styles.cameraHeader}>
            <TouchableOpacity style={styles.cameraHeaderButton} onPress={() => setShowCamera(false)}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.cameraHeaderTitle}>Scan Study Material</Text>
            <TouchableOpacity style={styles.cameraHeaderButton} onPress={toggleFlash}>
              {flashEnabled ? 
                <FlashOn size={24} color="#FFFFFF" /> : 
                <FlashOff size={24} color="#FFFFFF" />
              }
            </TouchableOpacity>
          </View>

          {/* Scanning Overlay */}
          <View style={styles.scanningArea}>
            <Animated.View 
              style={[
                styles.scanFrame,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              {/* Corner indicators */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {/* Scan line */}
              <Animated.View 
                style={[
                  styles.scanLine,
                  {
                    top: scanLineAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 250],
                    }),
                  }
                ]} 
              />
            </Animated.View>
            
            <Text style={styles.scanInstructions}>
              Position your study material within the frame
            </Text>
          </View>

          {/* Controls */}
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.cameraControlButton} onPress={toggleCameraFacing}>
              <RotateCcw size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.captureButton, isScanning && styles.captureButtonScanning]} 
              onPress={handleCapture}
              disabled={isScanning}
            >
              {isScanning ? (
                <Zap size={32} color="#FFFFFF" />
              ) : (
                <Camera size={32} color="#FFFFFF" />
              )}
            </TouchableOpacity>
            
            <View style={styles.cameraControlButton} />
          </View>

          {isScanning && (
            <View style={styles.processingOverlay}>
              <View style={styles.processingCard}>
                <Brain size={48} color="#7C3AED" />
                <Text style={styles.processingText}>Guru is analyzing...</Text>
                <Text style={styles.processingSubtext}>Understanding your study material</Text>
              </View>
            </View>
          )}
        </CameraView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Brain size={24} color="#7C3AED" />
        <Text style={styles.headerTitle}>Chat with Guru</Text>
        <View style={styles.statusIndicator}>
          <View style={styles.onlineIndicator} />
          <Text style={styles.statusText}>Wise & Ready</Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          
          {isTyping && (
            <View style={[styles.messageContainer, styles.guruMessage]}>
              <View style={styles.messageHeader}>
                <View style={[styles.avatar, styles.guruAvatar]}>
                  <Brain size={16} color="#FFFFFF" />
                </View>
              </View>
              <View style={[styles.messageBubble, styles.guruBubble, styles.typingBubble]}>
                <Text style={styles.typingText}>Guru is contemplating...</Text>
                <View style={styles.typingIndicator}>
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => handleQuickAction('explain')}
            >
              <Text style={styles.quickActionText}>Explain concept</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => handleQuickAction('solve')}
            >
              <Text style={styles.quickActionText}>Solve step-by-step</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputRow}>
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={handleCameraPress}
            >
              <Camera size={20} color="#7C3AED" />
            </TouchableOpacity>
            
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask your Guru anything..."
              placeholderTextColor="#9CA3AF"
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : null]}
              onPress={() => sendMessage()}
              disabled={!inputText.trim()}
            >
              <Send size={20} color={inputText.trim() ? "#FFFFFF" : "#9CA3AF"} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginLeft: 12,
    flex: 1,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7C3AED',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#7C3AED',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 20,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  guruMessage: {
    alignItems: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userAvatar: {
    backgroundColor: '#2563EB',
  },
  guruAvatar: {
    backgroundColor: '#7C3AED',
  },
  messageTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    position: 'relative',
  },
  userBubble: {
    backgroundColor: '#2563EB',
    borderBottomRightRadius: 6,
  },
  guruBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageTypeIcon: {
    position: 'absolute',
    top: -8,
    left: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
  userText: {
    color: '#FFFFFF',
  },
  guruText: {
    color: '#374151',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginRight: 12,
  },
  typingIndicator: {
    flexDirection: 'row',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
    marginHorizontal: 2,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  quickAction: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  cameraButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#7C3AED',
  },
  
  // Camera styles
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  cameraHeaderButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraHeaderTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  scanningArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  scanFrame: {
    width: 280,
    height: 280,
    borderRadius: 20,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#7C3AED',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 20,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 20,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 20,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 20,
  },
  scanLine: {
    position: 'absolute',
    left: 4,
    right: 4,
    height: 2,
    backgroundColor: '#7C3AED',
    opacity: 0.8,
  },
  scanInstructions: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  cameraControlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  captureButtonScanning: {
    backgroundColor: '#059669',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  processingText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginTop: 16,
  },
  processingSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 8,
  },
});