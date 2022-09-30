import * as React from 'react'
import {StyleSheet, View} from 'react-native'
import { useNavigation } from '@react-navigation/core';

// import PostPageDetailComponent from '../../components/PostPageDetail'
import PostPageDetailComponent from '../../components/PostPageDetail'
import {Context} from '../../context';
import { SOURCE_FEED_TAB, SOURCE_PDP } from '../../utils/constants';
import { setFeedByIndex, setTimer } from '../../context/actions/feeds';
import { viewTimePost } from '../../service/post'
import { withInteractionsManaged } from '../../components/WithInteractionManaged';

const FeedsPostDetail = (props) => {
    const [feedsContext, dispatch] = React.useContext(Context).feeds
    const {feedId, refreshCache} = props.route.params
    const navigation = useNavigation()
    const [time, setTime] = React.useState(new Date().getTime())
    const { feeds, timer } = feedsContext
    const navigateToReplyView = (data, updateParent, findCommentAndUpdate, dataFeed, updateVoteLatestChildren) => {
        const currentTime = new Date()
        const feedDiffTime = currentTime.getTime() - timer.getTime()
        const pdpDiffTime = currentTime.getTime() - time;

        if(feedId) {
            viewTimePost(feedId, feedDiffTime, SOURCE_FEED_TAB);
            viewTimePost(feedId, pdpDiffTime, SOURCE_PDP);
        }
        setTime(new Date().getTime())
        setTimer(new Date(), dispatch)
        navigation.navigate('ReplyComment', {...data, page: props.route.name, updateParent, findCommentAndUpdate, dataFeed, updateVoteLatestChildren});
    }

    React.useEffect(() => () => {
            if(refreshCache && typeof refreshCache === 'function') {
                refreshCache()
            }
        }, [])
    return(
        <View style={styles.container}>
            <PostPageDetailComponent 
                feeds={feeds} 
                feedId={feedId}
                dispatch={dispatch} 
                setFeedByIndexProps={setFeedByIndex}
                navigateToReplyView={navigateToReplyView}
                page={props.route.name}
                />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    }
})

export default withInteractionsManaged (FeedsPostDetail)