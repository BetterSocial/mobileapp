import * as React from 'react'
import {StyleSheet, View} from 'react-native'
import { useNavigation } from '@react-navigation/core';

// import PostPageDetailComponent from '../../components/PostPageDetail'
import PostPageDetailComponent from './PostPageDetailId'
import {Context} from '../../context';
import { setFeedByIndex } from '../../context/actions/feeds';

const FeedsPostDetail = (props) => {
    let [feeds, dispatch] = React.useContext(Context).feeds
    let {index, feedId} = props.route.params
    let navigation = useNavigation()

    let navigateToReplyView = (data, updateParent) => {
        navigation.navigate('ReplyComment', {...data, updateParent});
    }
    // const feedIndex = () => {
    //     if(feeds && feeds.feeds && Array.isArray(feeds.feeds)) {
    //         const findIndex = feeds.feeds.findIndex((feed) => feed.id === feedId) 
    //         if(findIndex >= 0) {
    //             return findIndex
    //         }
    //         return 0
       
    //     }
    //     return 0
    //   }
    // console.log(feedIndex(), feeds, 'mantap')
    return(
        <View style={styles.container}>
            <PostPageDetailComponent 
                feeds={feeds.feeds} 
                feedId={feedId}
                dispatch={dispatch} 
                setFeedByIndexProps={setFeedByIndex}
                navigateToReplyView={navigateToReplyView}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    }
})

export default FeedsPostDetail