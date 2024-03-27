import {SQLiteDatabase} from 'react-native-sqlite-storage';

interface UseLocalDatabaseHook {
  localDb: SQLiteDatabase;
  refresh: (key: 'channelList' | 'channelInfo' | 'chat' | 'user' | 'channelMember') => void;
  refreshWithId: (
    key: 'channelList' | 'channelInfo' | 'chat' | 'user' | 'channelMember',
    id: string
  ) => void;
  channelInfo: number;
  channelList: number;
  chat: number;
  user: number;
}

export default UseLocalDatabaseHook;
