import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Reusable button for the navigation bar.
 * @param {object} props
 * @param {string} props.title - Text label for the button.
 * @param {string} props.iconName - Name of the Ionicons icon (e.g., 'home').
 * @param {function} props.onPress - Function to execute when the button is pressed.
 */
const NavButton = ({ title, iconName, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Ionicons name={iconName} size={24} color="#333" />
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    flex: 1, // Ensures buttons share space equally
  },
  buttonText: {
    fontSize: 12,
    marginTop: 4,
    color: '#333',
    fontWeight: '600',
  },
});

export default NavButton;