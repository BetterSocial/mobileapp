/* eslint-disable import/prefer-default-export */
import { useState, useEffect, useRef } from 'react';
import { InteractionManager } from 'react-native';

export const useAfterInteractions = () => {
  const [interactionsComplete, setInteractionsComplete] = useState(false);

  const subscriptionRef = useRef(null);

  const transitionRef = useRef(null);

  useEffect(() => {
    subscriptionRef.current = InteractionManager.runAfterInteractions(() => {
      transitionRef.current?.animateNextTransition();
      setInteractionsComplete(true);
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
