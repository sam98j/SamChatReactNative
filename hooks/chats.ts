import { ChatMessage, MessagesTypes } from '@/interfaces/chats';
import { useChatsStore } from '@/store/zuChats';
import { chunkFile } from '@/utils/files';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

// ChatMsgStatus Interface
interface ChatMsgStatus {
  delevered: boolean | null;
}

const useChatMessagesSender = (socket: Socket) => {
  // mulitChunksMessage
  const [chatMessage, setChatMessage] = useState<ChatMessage | null>(null);
  // message replyed to
  const { responseToMessage, setResponseToMessage, setFileMessageUploadIndicator } = useChatsStore();
  // multi chunks status
  const [chatMsgStatus, setChatMsgStatus] = useState<ChatMsgStatus>({
    delevered: null,
  });

  // multiChunks
  const [chunks, setChunks] = useState<null | string[]>(null);
  // chunk index
  const [chunkIndex, setChunkIndex] = useState<number>(0);
  // send multi chunks msg
  const sendChatMessage = async (message: ChatMessage) => {
    // set chunk index
    setChunkIndex(0);
    // set message to send
    setChatMessage({ ...message });
    // make chunks from message content
    const messageContentChunks = await chunkFile(message.content);
    // set chunks
    setChunks(messageContentChunks);
    // hide response to message modal
    if (responseToMessage) setResponseToMessage(null);
  };

  // listen for file chunks
  useEffect(() => {
    // if there is no chunks
    if (!chunks) return;
    // is it last chunk
    const isLastChunk = chunkIndex === chunks.length - 1;
    // terminate after last chunk
    if (chunkIndex > chunks.length - 1) return;
    // multi chunks status
    const { delevered } = chatMsgStatus;
    // termenate if chunk is not delivered
    if (delevered === false) return;
    // if delevered is null or socket is null
    if (!chatMessage || !socket) return;
    // create message with single chunk
    const message = {
      ...chatMessage,
      content: chunks[chunkIndex],
    } as ChatMessage;
    // fire an socket event
    socket.emit('multi_chunks_message', { data: message, isLastChunk });
    // increment chunk index
    setChunkIndex(chunkIndex + 1);
    // check for invalid case
    if (chatMessage!.type === MessagesTypes.TEXT || chatMessage!.type === MessagesTypes.ACTION) return;
    // send chatMessage chunks lenght to the redux store
    setFileMessageUploadIndicator((chunkIndex / chunks?.length) * 100);
  }, [chunks, chatMsgStatus]);

  // listen for chunk delevery res
  useEffect(() => {
    // terminate if no socket
    socket?.removeAllListeners('chunk_recieved');
    // terminate if no socket
    if (!socket) return;
    // chunk delevered handler
    const chunkRecievedHandler = () => {
      setChatMsgStatus({ delevered: true });
    };
    // on chunk of multi chunks message received
    socket?.on('chunk_recieved', chunkRecievedHandler);
  }, [socket]);
  //  return
  return { sendChatMessage };
};

export default useChatMessagesSender;
