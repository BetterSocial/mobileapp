import { atom } from 'recoil';

export const unreadMessageAtom = atom({
  key: 'unreadMessageAtom',
  default: {
    total_unread_count: 0,
    unread_channels: 0,
    unread_count: 0,
    unread_post: 0
  }
});
