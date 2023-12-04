import {ContextMenuOnPressNativeEvent} from 'react-native-context-menu-view';
import {NativeSyntheticEvent} from 'react-native';

interface UseMessageHook {
  replyPreview: any;
  setReplyPreview: (any) => void;
  clearReplyPreview: () => void;
  onContextMenuPressed: (
    e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>,
    messageId: string,
    message: string
  ) => void;
}

export default UseMessageHook;
