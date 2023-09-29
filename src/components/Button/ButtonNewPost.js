import * as React from 'react';
import {useNavigation} from '@react-navigation/core';

import BaseButtonAddPost from './BaseButtonAddPost';
import {Context} from '../../context';
import {NavigationConstants, SOURCE_FEED_TAB} from '../../utils/constants';
import {setTimer} from '../../context/actions/feeds';
import {viewTimePost} from '../../service/post';
import ShadowFloatingButtons from './ShadowFloatingButtons';

const ButtonAddPost = ({onRefresh, isShowArrow}) => {
  const navigator = useNavigation();
  const [feedsContext, dispatch] = React.useContext(Context).feeds;

  const {feeds, timer, viewPostTimeIndex} = feedsContext;
  // eslint-disable-next-line no-underscore-dangle
  const __handleOnAddPostButtonClicked = () => {
    const currentTime = new Date().getTime();
    const id = feeds && feeds[viewPostTimeIndex]?.id;
    if (id) viewTimePost(id, currentTime - timer.getTime(), SOURCE_FEED_TAB);
    navigator.navigate(NavigationConstants.CREATE_POST_SCREEN, {onRefresh});
    setTimer(new Date(), dispatch);
  };

  return (
    <ShadowFloatingButtons>
      <BaseButtonAddPost
        isShowArrow={isShowArrow}
        onAddPostPressed={__handleOnAddPostButtonClicked}
        testID="onpress"
      />
    </ShadowFloatingButtons>
  );
};

export default ButtonAddPost;
