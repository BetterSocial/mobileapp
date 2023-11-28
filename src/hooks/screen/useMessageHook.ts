import {ContextMenuOnPressNativeEvent} from 'react-native-context-menu-view';
import {NativeSyntheticEvent} from 'react-native';

import ShareUtils from '../../utils/share';
import UseMessageHook from '../../../types/hooks/screens/useMessageHook.types';

function useMessageHook(): UseMessageHook {
  const onContextMenuPressed = (
    e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>,
    message: string
  ) => {
    const event = e.nativeEvent;
    if (event.index === 1) {
      ShareUtils.copyTextToClipboard(message);
    }
  };

  return {
    onContextMenuPressed
  };
}

export default useMessageHook;
