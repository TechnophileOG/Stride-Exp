import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TriangleAlert as AlertTriangle, ExternalLink, ShoppingBag, X } from 'lucide-react-native';

interface StoreDisclaimerModalProps {
  visible: boolean;
  onAccept: () => void;
  onClose: () => void;
}

export default function StoreDisclaimerModal({ visible, onAccept, onClose }: StoreDisclaimerModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <AlertTriangle size={24} color="#EA580C" />
            <Text style={styles.headerTitle}>Important Notice</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.iconContainer}>
            <ShoppingBag size={64} color="#2563EB" />
          </View>

          <Text style={styles.title}>Book Store Disclaimer</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📚 Educational Purpose</Text>
            <Text style={styles.sectionText}>
              This book store is designed as a demonstration feature for educational apps. All book listings, prices, and availability are for illustrative purposes only.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔗 External Links</Text>
            <Text style={styles.sectionText}>
              Clicking on books will redirect you to Amazon or other external retailers. We are not responsible for:
            </Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• Actual product availability or pricing</Text>
              <Text style={styles.bulletPoint}>• Purchase transactions or customer service</Text>
              <Text style={styles.bulletPoint}>• Product quality or delivery issues</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 Recommendation System</Text>
            <Text style={styles.sectionText}>
              Book recommendations and categories are curated for demonstration purposes and may not reflect actual academic requirements or personal preferences.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🛡️ Privacy & Data</Text>
            <Text style={styles.sectionText}>
              Your browsing activity within this store demo is not tracked or stored. However, external links may have their own privacy policies.
            </Text>
          </View>

          <View style={styles.warningBox}>
            <ExternalLink size={20} color="#EA580C" />
            <Text style={styles.warningText}>
              By proceeding, you acknowledge that this is a demonstration feature and any external purchases are made at your own discretion.
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.declineButton} onPress={onClose}>
            <Text style={styles.declineText}>Go Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
            <Text style={styles.acceptText}>I Understand</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
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
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginLeft: 8,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  iconContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  bulletPoints: {
    marginTop: 8,
    marginLeft: 16,
  },
  bulletPoint: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 12,
    padding: 16,
    marginVertical: 24,
  },
  warningText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    flex: 1,
    marginLeft: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  declineText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  acceptButton: {
    flex: 2,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});