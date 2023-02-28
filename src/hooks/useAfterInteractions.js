import {InteractionManager} from 'react-native';
/* eslint-disable import/prefer-default-export */
import React from 'react';

export const useAfterInteractions = () => {
  const [interactionsComplete, setInteractionsComplete] = React.useState(false);

  const debounceRef = React.useRef(null);

  const transitionRef = React.useRef(null);

  const debounceComplete = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setInteractionsComplete(true);
    }, 100);
  };

  React.useEffect(() => {
    const interactionHandler = InteractionManager.runAfterInteractions(() => {
      transitionRef?.current?.animateNextTransition();
      debounceComplete();
    });
    return () => {
      interactionHandler.cancel();
      clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    interactionsComplete,
    transitionRef
  };
};
