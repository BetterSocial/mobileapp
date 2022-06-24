import { InteractionManager } from 'react-native';
import { debounce } from 'lodash';
/* eslint-disable import/prefer-default-export */
import { useEffect, useRef, useState } from 'react';

export const useAfterInteractions = () => {
  const [interactionsComplete, setInteractionsComplete] = useState(false);

  const subscriptionRef = useRef(null);

  const transitionRef = useRef(null);

  const debounceComplete = () => {
    setTimeout(() => {
      setInteractionsComplete(true);
    }, 100);
  };

  useEffect(() => {
    subscriptionRef.current = InteractionManager.runAfterInteractions(() => {
      transitionRef.current?.animateNextTransition();
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
