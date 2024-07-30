import React from 'react';
import {Keyboard} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const useChatScreenDimensions = () => {
  const safeAreaInsets = useSafeAreaInsets();
  const [isKeyboardOpen, setIsKeyboardOpen] = React.useState(false);

  React.useEffect(() => {
    const willShow = Keyboard.addListener('keyboardWillShow', () => {
      setIsKeyboardOpen(true);
    });

    const willHide = Keyboard.addListener('keyboardWillHide', () => {
      setIsKeyboardOpen(false);
    });

    return () => {
      Keyboard.removeSubscription(willShow);
      Keyboard.removeSubscription(willHide);
    };
  }, []);

  return {
    isKeyboardOpen,
    safeAreaInsets: {
      ...safeAreaInsets,
      bottom: isKeyboardOpen ? 0 : safeAreaInsets.bottom
    }
  };
};

export default useChatScreenDimensions;
