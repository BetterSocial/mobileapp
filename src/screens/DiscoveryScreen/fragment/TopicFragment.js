import * as React from 'react';

import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { Context } from '../../../context/Store'
import DomainList from '../../Followings/elements/RenderList';
import Loading from '../../Loading';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';
import { getUserId } from '../../../utils/users';

const TopicFragment = () => {
    const [myId, setMyId] = React.useState('')
    const [discovery, discoveryDispatch] = React.useContext(Context).discovery
    const { isLoadingDiscovery, followedTopic, unfollowedTopic } = discovery

    React.useEffect(() => {
        const parseToken = async () => {
            const id = await getUserId();
                if (id) {
                setMyId(id);
            }
        };
        parseToken();
    }, []);
    
    if(isLoadingDiscovery) return <View style={styles.fragmentContainer}><LoadingWithoutModal/></View>
    if(followedTopic.length === 0 && unfollowedTopic.length ===0) return <View style={styles.noDataFoundContainer}>
        <Text style={styles.noDataFoundText}>No Topics found</Text>
    </View>

    return <ScrollView style={styles.fragmentContainer}>
        { followedTopic.map((item, index) => {
            return <DomainList key={`followedTopic-${index}`} isHashtag item={{
                name: item.name,
                image: item.profile_pic_path,
                isunfollowed: item.user_id_follower === null,
            }} />
        })}

        { unfollowedTopic.length > 0 && <Text style={styles.unfollowedHeaders}>Unfollowed Topics</Text>}
        { unfollowedTopic.map((item, index) => {
            return <DomainList key={`unfollowedTopic-${index}`} isHashtag item={{
                name: item.name,
                image: item.profile_pic_path,
                isunfollowed: item.user_id_follower === null
            }} />
        })}
    </ScrollView>
}

const styles = StyleSheet.create({
    fragmentContainer: {
        flex: 1,
        backgroundColor: colors.white
    },
    noDataFoundContainer: {
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: 'center',
    },
    noDataFoundText: {
        alignSelf: 'center',
        justifyContent: 'center',
        fontFamily: fonts.inter[600],
    },
    unfollowedHeaders: {
        fontFamily: fonts.inter[600],
        marginLeft: 24,
    }
})

export default TopicFragment