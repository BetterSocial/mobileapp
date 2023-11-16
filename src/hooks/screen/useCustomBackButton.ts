import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {Keyboard} from 'react-native';

const useBackButton = () => {
  const {goBack} = useNavigation();
  const [isKeyboardShow, setIsKeyboardShow] = React.useState(false);
  React.useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardShow(true);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardShow(false);
    });
  }, []);

  const handleBack = async (callback) => {
    if (isKeyboardShow) {
      await Keyboard.dismiss();
      setTimeout(() => {
        goBack();
        if (callback && typeof callback === 'function') callback();
      }, 300);
    } else {
      goBack();
    }
  };

  return {
    isKeyboardShow,
    handleBack
  };
};

export default useBackButton;
