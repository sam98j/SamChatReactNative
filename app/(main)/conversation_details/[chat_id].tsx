import { ChatTypes } from '@/interfaces/chats';
import { useAuthStore } from '@/store/authStore';
import { useChatsStore } from '@/store/chatsStore';
import { Avatar, Icon, ListItem } from '@rneui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import i18n from '@/i18n';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ConversationDetails = () => {
  const { chat_id } = useLocalSearchParams();
  const router = useRouter();
  const { openedChat } = useChatsStore();
  const { currentUser } = useAuthStore();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const isRTL = i18n.locale === 'ar';

  const chat = openedChat;

  const chatDetails = useMemo(() => {
    if (!chat || !currentUser) return null;

    const isGroup = chat.type === ChatTypes.GROUP;
    let name = chat.name;
    let avatar = chat.avatar;
    let info = isGroup ? i18n.t('conversationDetails.group') : i18n.t('conversationDetails.personal');

    if (!isGroup) {
      const otherMember = chat.members.find((m) => m._id !== currentUser._id);
      if (otherMember) {
        name = otherMember.name;
        avatar = otherMember.avatar;
        info = i18n.t('conversationDetails.personal'); // Assuming email might be relevant or just status
        // Note: otherMember only has _id, avatar, name based on ChatMember interface usually. 
        // If email is needed, we might need to fetch it or check if it's there. 
        // For now, use "Personal".
        info = i18n.t('conversationDetails.available'); // Placeholder status
      }
    }

    // Process avatar URL
    const avatarUrl = avatar?.startsWith('http') ? avatar : `${apiUrl}${avatar}`;

    return { name, avatarUrl, info, isGroup };
  }, [chat, currentUser, apiUrl]);

  if (!chat || chat._id !== chat_id) {
    return (
      <View style={styles.centerContainer}>
        <Text>{i18n.t('conversationDetails.chatNotFound')}</Text>
      </View>
    );
  }

  if (!chatDetails) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name={isRTL ? 'chevron-forward' : 'chevron-back'} type='ionicon' size={30} color='dodgerblue' />
        </TouchableOpacity>
        {/* <Text style={styles.headerTitle}>Contact Info</Text> */}
      </View>

      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Avatar
          size={100}
          rounded
          source={{ uri: chatDetails.avatarUrl }}
          containerStyle={{ backgroundColor: '#ccc', marginBottom: 10 }}
        />
        <Text style={styles.name}>{chatDetails.name}</Text>
        <Text style={styles.info}>{chatDetails.isGroup ? `${i18n.t('conversationDetails.group')} · ${i18n.t('conversationDetails.members', { count: chat.members.length })}` : chatDetails.info}</Text>
      </View>

      {/* Action Buttons (Call, Video, Search) */}
      <View style={[styles.actionButtonsContainer, isRTL && { flexDirection: 'row-reverse' }]}>
        <TouchableOpacity style={styles.actionButton}>
           <Icon name='call-outline' type='ionicon' color='dodgerblue' size={24} />
           <Text style={styles.actionText}>{i18n.t('conversationDetails.audio')}</Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.actionButton}>
           <Icon name='videocam-outline' type='ionicon' color='dodgerblue' size={24} />
           <Text style={styles.actionText}>{i18n.t('conversationDetails.video')}</Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.actionButton}>
           <Icon name='search-outline' type='ionicon' color='dodgerblue' size={24} />
           <Text style={styles.actionText}>{i18n.t('conversationDetails.search')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* Members Section for Group */}
      {chatDetails.isGroup && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && { textAlign: 'right' }]}>{i18n.t('conversationDetails.members', { count: chat.members.length })}</Text>
          {chat.members.map((member) => (
            <ListItem key={member._id} bottomDivider containerStyle={[styles.listItem, isRTL && { flexDirection: 'row-reverse' }]}>
               <Avatar
                rounded
                source={{ uri: member.avatar?.startsWith('http') ? member.avatar : `${apiUrl}${member.avatar}` }}
              />
              <ListItem.Content style={isRTL && { alignItems: 'flex-end' }}>
                <ListItem.Title style={styles.itemTitle}>{member.name}</ListItem.Title>
                {member._id === currentUser?._id && <ListItem.Subtitle style={styles.itemSubtitle}>{i18n.t('conversationDetails.you')}</ListItem.Subtitle>}
              </ListItem.Content>
            </ListItem>
          ))}
        </View>
      )}

      {/* Media & Docs */}
      <View style={styles.section}>
         <ListItem bottomDivider containerStyle={[styles.listItem, isRTL && { flexDirection: 'row-reverse' }]} onPress={() => {}}>
            <Icon name='images-outline' type='ionicon' color='#007AFF' size={22} />
            <ListItem.Content style={isRTL && { alignItems: 'flex-end' }}>
                <ListItem.Title style={styles.itemTitle}>{i18n.t('conversationDetails.mediaLinksDocs')}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron iconStyle={isRTL ? { transform: [{ rotate: '180deg' }] } : undefined} />
        </ListItem>
         <ListItem bottomDivider containerStyle={[styles.listItem, isRTL && { flexDirection: 'row-reverse' }]} onPress={() => {}}>
            <Icon name='star-outline' type='ionicon' color='#FEC007' size={22} />
            <ListItem.Content style={isRTL && { alignItems: 'flex-end' }}>
                <ListItem.Title style={styles.itemTitle}>{i18n.t('conversationDetails.starredMessages')}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron iconStyle={isRTL ? { transform: [{ rotate: '180deg' }] } : undefined} />
        </ListItem>
      </View>
      
      <View style={styles.divider} />

      {/* Settings */}
      <View style={styles.section}>
         <ListItem bottomDivider containerStyle={[styles.listItem, isRTL && { flexDirection: 'row-reverse' }]} onPress={() => {}}>
            <Icon name='notifications-outline' type='ionicon' color='black' size={22} />
            <ListItem.Content style={isRTL && { alignItems: 'flex-end' }}>
                <ListItem.Title style={styles.itemTitle}>{i18n.t('conversationDetails.notifications')}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron iconStyle={isRTL ? { transform: [{ rotate: '180deg' }] } : undefined} />
        </ListItem>
      </View>

      <View style={styles.divider} />

      {/* Destructive Actions */}
      <View style={styles.section}>
         <ListItem containerStyle={[styles.listItem, isRTL && { flexDirection: 'row-reverse' }]} onPress={() => {}}>
            <Icon name='trash-outline' type='ionicon' color='red' size={22} />
            <ListItem.Content style={isRTL && { alignItems: 'flex-end' }}>
                <ListItem.Title style={[styles.itemTitle, { color: 'red' }]}>{i18n.t('conversationDetails.clearChat')}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
         <ListItem containerStyle={[styles.listItem, isRTL && { flexDirection: 'row-reverse' }]} onPress={() => {}}>
            <Icon name='ban-outline' type='ionicon' color='red' size={22} />
            <ListItem.Content style={isRTL && { alignItems: 'flex-end' }}>
                <ListItem.Title style={[styles.itemTitle, { color: 'red' }]}>{chatDetails.isGroup ? i18n.t('conversationDetails.blockGroup') : i18n.t('conversationDetails.blockUser')}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
      </View>

    </ScrollView>
  );
};

export default ConversationDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f6', // IOS Grouped Background
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    marginBottom: 5,
    fontFamily: 'BalooBhaijaan2',
  },
  info: {
    fontSize: 16,
    color: 'gray',
    fontFamily: 'BalooBhaijaan2',
  },
  actionButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 10,
      backgroundColor: '#fff',
  },
  actionButton: {
      alignItems: 'center',
      marginHorizontal: 15,
      width: 60,
  },
  actionText: {
      color: 'dodgerblue',
      marginTop: 5,
      fontSize: 12,
  },
  section: {
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1, 
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
  },
  divider: {
      height: 20,
  },
  sectionTitle: {
      padding: 15,
      fontSize: 14,
      color: 'gray',
      textTransform: 'uppercase',
  },
  listItem: {
      paddingVertical: 12,
  },
  itemTitle: {
      fontFamily: 'BalooBhaijaan2',
      fontSize: 16,
  },
  itemSubtitle: {
       fontSize: 12,
       color: 'gray',
  },
});
