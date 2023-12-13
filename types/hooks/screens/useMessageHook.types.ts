import {ContextMenuOnPressNativeEvent} from 'react-native-context-menu-view';
import {NativeSyntheticEvent} from 'react-native';

interface UseMessageHook {
  replyPreview: any;
  setReplyPreview: (any) => void;
  clearReplyPreview: () => void;
  onContextMenuPressed: (
    e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>,
    data: any,
    type: 'ANONYMOUS' | 'SIGNED'
  ) => void;
  onOpenMediaPreview: (medias: any, index: number, navigation: any) => void;
}

export default UseMessageHook;
