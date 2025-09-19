import { LoggedInUserData } from '@/store/auth.slice';
// Chat
export interface SingleChat {
  _id: string;
  name: string;
  avatar: string;
  type: ChatTypes;
  members: ChatMember[];
}
// Chat's Types
export enum ChatTypes {
  'INDIVISUAL' = 'INDIVISUAL',
  'GROUP' = 'GROUP',
}
// chat card
export interface ChatCard extends SingleChat {
  lastMessage: Omit<ChatMessage, 'fileSize'>;
  unReadedMsgs: number;
}
// chat Message interface
export interface ChatMessage {
  _id: string;
  content: string;
  type: MessagesTypes;
  actionMsgType?: ActionMessagesTypes;
  replyTo: string | null | undefined;
  msgReplyedTo: ResponseToMessageData | null;
  sender: ChatMember;
  fileName: string | null;
  fileSize: string | null;
  receiverId: string;
  forwardedTo?: string[];
  status: MessageStatus | null;
  date: string;
  voiceNoteDuration: string;
}

// responseToMessageData
export type ResponseToMessageData = Pick<
  ChatMessage,
  'sender' | 'content' | 'type' | '_id' | 'voiceNoteDuration' | 'fileName'
>;

// Chat's Member
export type ChatMember = Pick<LoggedInUserData, '_id' | 'avatar' | 'name'>;

// message types
export enum MessagesTypes {
  TEXT = 'TEXT',
  VIDEO = 'VIDEO',
  PHOTO = 'PHOTO',
  FILE = 'FILE',
  VOICENOTE = 'VOICENOTE',
  ACTION = 'ACTION',
}
export enum MessageStatus {
  'SENT' = 'SENT',
  'DELEVERED' = 'DELEVERED',
  'READED' = 'READED',
}

// chat user actions
export enum ChatActionsTypes {
  'TYPEING' = 'TYPEING',
  'RECORDING_VOICE' = 'RECORDING_VOICE',
}
// chat Actions
export type ActionMessagesTypes = 'CREATION' | 'MEMBER_ADITION';

// ChangeMessageStatusDTO
export interface ChangeMessageStatusDTO {
  msgIDs: string[];
  msgStatus: MessageStatus;
  chatId: string;
  senderIDs?: string[];
}

// chat profile
export interface ChatProfile {
  avatar: string;
  name: string;
  email: string;
}

export type MessagesToBeForwarded = {
  messages: string[];
  chats: string[];
};
