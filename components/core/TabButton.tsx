import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface TabButtonProps {
  active: boolean;
  onPress: () => void;
  children: React.ReactNode;
}

export const TabButton = ({ active, onPress, children }: TabButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.button,
      active ? styles.activeButton : styles.inactiveButton
    ]}
  >
    <Text style={[
      styles.text,
      active ? styles.activeText : styles.inactiveText
    ]}>
      {children}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#2563EB', // blue-600
  },
  inactiveButton: {
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeText: {
    color: '#FFFFFF',
  },
  inactiveText: {
    color: '#D1D5DB', // gray-300
  },
});