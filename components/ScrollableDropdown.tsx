import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Modal,
  SafeAreaView,
} from 'react-native';
import { ChevronDown, Check, X } from 'lucide-react-native';

interface DropdownOption {
  label: string;
  value: string;
}

interface ScrollableDropdownProps {
  value: string;
  onSelect: (value: string) => void;
  options: DropdownOption[];
  placeholder: string;
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  style?: any;
  maxHeight?: number;
  disabled?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ScrollableDropdown({
  value,
  onSelect,
  options,
  placeholder,
  label,
  icon,
  error,
  style,
  maxHeight = 300,
  disabled = false
}: ScrollableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setIsOpen(false);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          {icon}
          <Text style={styles.label}>{label}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.dropdown,
          error && styles.dropdownError,
          isOpen && styles.dropdownOpen,
          disabled && styles.dropdownDisabled
        ]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dropdownText,
          !selectedOption && styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown
          size={20}
          color={disabled ? "#D1D5DB" : "#6B7280"}
          style={[styles.chevron, isOpen && styles.chevronRotated]}
        />
      </TouchableOpacity>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Full Screen Modal */}
      <Modal
        visible={isOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeDropdown}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {label || placeholder}
            </Text>
            <TouchableOpacity 
              onPress={closeDropdown} 
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Search/Filter Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {options.length} options available
            </Text>
          </View>

          {/* Options List */}
          <ScrollView 
            style={styles.optionsList}
            contentContainerStyle={styles.optionsContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
            keyboardShouldPersistTaps="handled"
          >
            {options.map((option, index) => (
              <TouchableOpacity
                key={`${option.value}-${index}`}
                style={[
                  styles.option,
                  value === option.value && styles.selectedOption
                ]}
                onPress={() => handleSelect(option.value)}
                activeOpacity={0.6}
              >
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionText,
                    value === option.value && styles.selectedOptionText
                  ]}>
                    {option.label}
                  </Text>
                  {value === option.value && (
                    <View style={styles.checkContainer}>
                      <Check size={20} color="#2563EB" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={closeDropdown}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    zIndex: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginLeft: 8,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    minHeight: 56,
  },
  dropdownError: {
    borderColor: '#EF4444',
  },
  dropdownOpen: {
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOpacity: 0.1,
  },
  dropdownDisabled: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    flex: 1,
    textAlign: 'left',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  disabledText: {
    color: '#D1D5DB',
  },
  chevron: {
    marginLeft: 12,
    transform: [{ rotate: '0deg' }],
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    marginTop: 8,
  },
  
  // Modal styles
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    flex: 1,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  optionsList: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  optionsContent: {
    paddingVertical: 8,
  },
  option: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedOption: {
    backgroundColor: '#EFF6FF',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 56,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    flex: 1,
    lineHeight: 24,
  },
  selectedOptionText: {
    color: '#2563EB',
    fontFamily: 'Inter-SemiBold',
  },
  checkContainer: {
    marginLeft: 12,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
});