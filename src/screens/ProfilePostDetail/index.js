import * as React from 'react'
import {StyleSheet, View} from 'react-native'
import { useNavigation } from '@react-navigation/core';

import PostPageDetailComponent from '../../components/PostPageDetail'
import {Context} from '../../context';
import { setFeedByIndex } from '../../context/actions/myProfileFeed';

const ProfilePostDetail = (props) => {
    let [feeds, dispatch] = React.useContext(Context).feeds
    let {index, feedId, refreshParent} = props.route.params
    let navigation = useNavigation()

    let navigateToReplyView = (data, updateParent, findCommentAndUpdate, dataFeed) => {
        navigation.navigate('ReplyComment', {...data, page: props.route.name, updateParent, findCommentAndUpdate, dataFeed});
    }
    
    React.useEffect(() => {
        return () => {
            if(refreshParent) {
                refreshParent()
            }
        }
    }, [])
    
    return(
        <View style={styles.container}>
            <PostPageDetailComponent 
                feedId={feedId} 
                feeds={feeds.feeds} 
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

export default ProfilePostDetail