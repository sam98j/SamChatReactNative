import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import i18n from '@/i18n';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type Props = {
  visible: boolean;
  onClose: () => void;
  onShare: () => void;
  onSave: () => void;
  onDelete: () => void;
};

const ImageOptionsDropdown: React.FC<Props> = ({ visible, onClose, onShare, onSave, onDelete }) => {
  if (!visible) return null;

  return (
    <>
      <TouchableOpacity style={styles.overlay} onPress={onClose} />
      <Animated.View style={styles.menuContainer} entering={FadeIn.duration(200)} exiting={FadeOut}>
        <TouchableOpacity style={styles.menuItem} onPress={onShare}>
          <Icon name='share-social-outline' size={20} color='black' />
          <Text style={styles.menuItemText}>{i18n.t('openedChat.media-viewer.options-menu.share') || 'Share'}</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.menuItem} onPress={onSave}>
          <Icon name='save-outline' size={20} color='black' />
          <Text style={styles.menuItemText}>
            {i18n.t('openedChat.media-viewer.options-menu.save-to-gallery') || 'Save to gallery'}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.menuItem} onPress={onDelete}>
          <Icon name='trash-outline' size={20} color='red' />
          <Text style={[styles.menuItemText, { color: 'red' }]}>
            {i18n.t('openedChat.media-viewer.options-menu.delete') || 'Delete'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

export default ImageOptionsDropdown;

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: 45,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 5,
    zIndex: 2000,
    elevation: 5,
    minWidth: 150,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'BalooBhaijaan2',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 1500,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    width: '100%',
  },
});
