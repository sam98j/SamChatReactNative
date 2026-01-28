import * as SQLite from 'expo-sqlite';
import { ChatCard } from '@/interfaces/chats';

const DB_NAME = 'samchat.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

const getDB = (): Promise<SQLite.SQLiteDatabase> => {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbPromise;
};

export const initDatabase = async () => {
  const db = await getDB();
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY NOT NULL,
      data TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  return db;
};

export const saveChatsToDB = async (chats: ChatCard[]) => {
  if (!Array.isArray(chats) || chats.length === 0) return;
  
  const db = await getDB();
  
  await db.withTransactionAsync(async () => {
    for (const chat of chats) {
      await db.runAsync(
        'INSERT OR REPLACE INTO chats (id, data, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
        [chat._id, JSON.stringify(chat)]
      );
    }
  });
};

export const getChatsFromDB = async (): Promise<ChatCard[]> => {
  const db = await getDB();
  const allRows = await db.getAllAsync<{ data: string }>('SELECT data FROM chats ORDER BY updated_at DESC');
  return allRows.map(row => JSON.parse(row.data));
};

export const clearChatsDB = async () => {
  const db = await getDB();
  await db.runAsync('DELETE FROM chats');
};

export const deleteChatFromDB = async (chatId: string) => {
  const db = await getDB();
  await db.runAsync('DELETE FROM chats WHERE id = ?', [chatId]);
};

export const updateChatInDB = async (chat: ChatCard) => {
  const db = await getDB();
  await db.runAsync(
    'INSERT OR REPLACE INTO chats (id, data, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
    [chat._id, JSON.stringify(chat)]
  );
};

