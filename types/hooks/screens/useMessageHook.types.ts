import {ContextMenuOnPressNativeEvent} from 'react-native-context-menu-view';
import {NativeSyntheticEvent} from 'react-native';

interface UseMessageHook {
  onContextMenuPressed: (
    e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>,
    message: string
  ) => void;
}

export default UseMessageHook;
