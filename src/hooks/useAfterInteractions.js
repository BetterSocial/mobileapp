/* eslint-disable import/prefer-default-export */
import { useState, useEffect, useRef } from 'react';
import { InteractionManager } from 'react-native';
import { debounce } from 'lodash';

export const useAfterInteractions = () => {
  const [interactionsComplete, setInteractionsComplete] = useState(false);

  const subscriptionRef = useRef(null);

  const transitionRef = useRef(null);

  const debounceComplete = debounce(() => {
    setInteractionsComplete(true);
  }, 100);

  useEffect(() => {
    subscriptionRef.current = InteractionManager.runAfterInteractions(() => {
      transitionRef.current?.animateNextTransition();
      debounceComplete();
      subscriptionRef.current = null;
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
