import { useNavigation } from "@react-navigation/core"
import React from 'react'
import { Context } from "../../../context"
import { setTimer } from "../../../context/actions/feeds"
import { viewTimePost } from "../../../service/post"
import { SOURCE_FEED_TAB, SOURCE_PDP } from "../../../utils/constants"

const useMainPdp = (props) => {
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

    return {
        navigateToReplyView,
        refreshCache
    }

}

export default useMainPdp