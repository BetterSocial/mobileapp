import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';

import PostPageDetailComponent from '../../components/PostPageDetail';
import { CONTEXT_SOURCE } from '../../hooks/usePostContextHooks';
import { Context } from '../../context';
import { setFeedByIndex } from '../../context/actions/myProfileFeed';

const ProfilePostDetail = (props) => {
    const [feedsContext, dispatch] = React.useContext(Context).myProfileFeed
    const { index, feedId, refreshParent } = props.route.params
    const navigation = useNavigation()
    const {feeds} = feedsContext

    const navigateToReplyView = (data, updateParent, findCommentAndUpdate, dataFeed) => {
        navigation.navigate('ReplyComment', { ...data, page: props.route.name, updateParent, findCommentAndUpdate, dataFeed });
    }

    React.useEffect(() => () => {
        if (refreshParent) {
            refreshParent()
        }
    }, [])

    return (
        <View style={styles.container}>
            <PostPageDetailComponent
                feedId={feedId}
                feeds={feeds}
                dispatch={dispatch}
                setFeedByIndexProps={setFeedByIndex}
                navigateToReplyView={navigateToReplyView}
                contextSource={CONTEXT_SOURCE.PROFILE_FEEDS} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    }
})

export default ProfilePostDetail