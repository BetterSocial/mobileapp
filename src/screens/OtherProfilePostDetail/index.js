import * as React from 'react'
import {StyleSheet, View} from 'react-native'
import { useNavigation } from '@react-navigation/core';

import PostPageDetailComponent from '../../components/PostPageDetail'
import {Context} from '../../context';
import { setFeedByIndex } from '../../context/actions/otherProfileFeed';

const OtherProfilePostDetail = (props) => {
    let [feeds, dispatch] = React.useContext(Context).otherProfileFeed
    let {index} = props.route.params
    let navigation = useNavigation()

    let navigateToReplyView = (data) => {
        navigation.navigate('OtherProfileReplyComment', data);
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

export default OtherProfilePostDetail