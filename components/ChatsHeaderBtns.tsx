import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useSystemStore } from '@/store/zuSystem';

export default function ChatsHeaderBtns() {
  // zuSystem stroe
  const { toggleBottomSheet } = useSystemStore();
  // Handle press in event
  const handlePress = () => toggleBottomSheet();
  return (
    <View style={styles.container}>
      {/* Add Chat Button */}
      <TouchableOpacity onPress={handlePress} style={[styles.iconButton, { backgroundColor: 'dodgerblue' }]}>
        <FeatherIcon name='plus' size={20} color='white' />
      </TouchableOpacity>

      {/* Camera Button */}
      <TouchableOpacity style={[styles.iconButton, { backgroundColor: '#EEE' }]}>
        <Icon name='camera' size={20} color='black' />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
    gap: 20,
  },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
