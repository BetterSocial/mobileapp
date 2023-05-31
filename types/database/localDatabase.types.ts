import {SQLiteDatabase} from 'react-native-sqlite-storage';

interface UseLocalDatabaseHook {
  localDb: SQLiteDatabase;
  refresh: (key: 'channelList' | 'channelInfo' | 'chat' | 'user' | 'channelMember') => void;
  channelInfo: number;
  channelList: number;
  chat: number;
  user: number;
}

export default UseLocalDatabaseHook;
