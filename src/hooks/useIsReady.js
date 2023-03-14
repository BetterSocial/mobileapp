import React from 'react';
import {InteractionManager} from 'react-native';
import {debounce} from 'lodash';

const useIsReady = () => {
  const [isReady, setIsReady] = React.useState(false);
  const interactionManagerRef = React.useRef(null);
  const debounceTime = debounce(() => {
    setIsReady(true);
  }, 100);

  const waitAnimation = () => {
    interactionManagerRef.current = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
  };

  React.useEffect(() => {
    waitAnimation();

    return () => {
      if (interactionManagerRef.current) interactionManagerRef.current.cancel();
    };
  }, []);

  return isReady;
};

export default useIsReady;
