import * as React from 'react';
import {useNavigation} from '@react-navigation/native';

export const LIST_VIEW_TYPE = {
  FLAT_LIST: 'FLAT_LIST',
  SCROLL_VIEW: 'SCROLL_VIEW',
  TIKTOK_SCROLL: 'TIKTOK_SCROLL'
};

const useOnBottomNavigationTabPressHook = (listViewType, callback = null) => {
  const navigation = useNavigation();
  const listRef = React.useRef(null);

  const onTabPressed = () => {
    if (callback) callback();
    switch (listViewType) {
      case LIST_VIEW_TYPE.TIKTOK_SCROLL:
        if (listRef.current.scrollToTop) listRef.current.scrollToTop();
        break;

      case LIST_VIEW_TYPE.FLAT_LIST:
        if (listRef.current.scrollToOffset)
          listRef.current.scrollToOffset({offset: 0, animated: true});
        break;

      case LIST_VIEW_TYPE.SCROLL_VIEW:
        if (listRef.current.scrollTo) listRef.current.scrollTo({x: 0, y: 0, animated: true});
        break;

      default:
        break;
    }
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', onTabPressed);
    return unsubscribe;
  }, [navigation, callback]);

  return {
    listRef
  };
};

export default useOnBottomNavigationTabPressHook;
