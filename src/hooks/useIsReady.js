import { useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';
import { debounce } from 'lodash';

const useIsReady = () => {
  const [isReady, setIsReady] = useState(false);
  const debounceTime = debounce(() => {
    setIsReady(true);
  }, 100);

  const waitAnimation = () => {
    InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
  };

  useEffect(() => {
    waitAnimation();
  }, []);

  return isReady;
};

export default useIsReady;
