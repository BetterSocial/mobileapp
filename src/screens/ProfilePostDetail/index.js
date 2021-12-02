import * as React from 'react'
import {StyleSheet, View} from 'react-native'
import { useNavigation } from '@react-navigation/core';

import PostPageDetailComponent from '../../components/PostPageDetail'
import {Context} from '../../context';
import { setFeedByIndex } from '../../context/actions/myProfileFeed';

const ProfilePostDetail = (props) => {
    let [feeds, dispatch] = React.useContext(Context).myProfileFeed
    let {index} = props.route.params
    let navigation = useNavigation()

    let navigateToReplyView = (data) => {
        navigation.navigate('ProfileReplyComment', data);
    }
    
    return(
        <View style={styles.container}>
            <PostPageDetailComponent index={index} 
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