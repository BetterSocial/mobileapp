import { InteractionManager } from 'react-native';
/* eslint-disable import/prefer-default-export */
import React from 'react';

export const useAfterInteractions = () => {
  const [interactionsComplete, setInteractionsComplete] = React.useState(false);

  const subscriptionRef = React.useRef(null);

  const transitionRef = React.useRef(null);

  const debounceComplete = () => {
    setTimeout(() => {
      // console.log(setInteractionsComplete, 'fak');
      setInteractionsComplete(true);
    }, 100);
  };

  React.useEffect(() => {
    subscriptionRef.current = InteractionManager.runAfterInteractions(() => {
      transitionRef?.current?.animateNextTransition();
      debounceComplete();
    });
    return () => {
      subscriptionRef.current?.cancel();
    };
  }, []);

  return {
    interactionsComplete,
    transitionRef,
  };
};
