/* eslint-disable camelcase */
import React from 'react'
import { useNavigation } from "@react-navigation/core";
import { viewTimePost } from '../../../service/post';
import { setTimer } from '../../../context/actions/feeds';
import { getUserId } from '../../../utils/token';
import { Context } from '../../../context';
import { SOURCE_FEED_TAB, SOURCE_PDP } from '../../../utils/constants';

const useFeedHeader = ({actor,

  source,
}) => {
     const navigation = useNavigation();
    const [feedsContext, dispatch] = React.useContext(Context).feeds
    const { feeds, timer, viewPostTimeIndex } = feedsContext

    const userId = actor?.id;
    const { username, profile_pic_url } = actor?.data || {};
    
    const navigateToProfile = async () => {
        if (source) {
        const currentTime = new Date().getTime()
        const id = feeds && feeds[viewPostTimeIndex]?.id
        if (id) viewTimePost(id, currentTime - timer.getTime(), source)
        setTimer(new Date(), dispatch)
        }

        const selfUserId = await getUserId();
        if (selfUserId === userId) {
        return navigation.navigate('ProfileScreen', {
            isNotFromHomeTab: true
        });
        }
        return navigation.navigate('OtherProfile', {
        data: {
            user_id: selfUserId,
            other_id: userId,
            username,
        },
        });
    };

    const onBackNormalUser = () => {
        if (source) {
                    const currentTime = new Date().getTime()
                    const id = feeds && feeds[viewPostTimeIndex]?.id
                    if (id) viewTimePost(id, currentTime - timer.getTime(), source)
                    if (id && source === SOURCE_PDP) viewTimePost(id, currentTime - timer.getTime(), SOURCE_FEED_TAB)
                    setTimer(new Date(), dispatch)
                  }

                  navigation.goBack();
    }

  return {
    navigateToProfile,
    username,
    feeds,
    timer,
    viewPostTimeIndex,
    navigation,
    userId,
    profile_pic_url,
    dispatch,
    onBackNormalUser
  }
}


export default useFeedHeader