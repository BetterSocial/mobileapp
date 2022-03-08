import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';

import DomainList from '../elements/DiscoveryItemList';
import Loading from '../../Loading';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import StringConstant from '../../../utils/string/StringConstant';
import { COLORS } from '../../../utils/theme';
import { Context } from '../../../context/Store'
import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';
import { getUserId } from '../../../utils/users';

const TopicFragment = () => {
    const navigation = useNavigation()
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

    const __handleOnTopicPress = (item) => {
        console.log(item)
    }
    
    if(isLoadingDiscovery) return <View style={styles.fragmentContainer}><LoadingWithoutModal/></View>
    if(followedTopic.length === 0 && unfollowedTopic.length ===0) return <View style={styles.noDataFoundContainer}>
        <Text style={styles.noDataFoundText}>No Topics found</Text>
    </View>

    return <ScrollView style={styles.fragmentContainer}>
        { followedTopic.map((item, index) => {
            return <DomainList key={`followedTopic-${index}`} onPressBody={() => __handleOnTopicPress(item)} 
                isHashtag 
                item={{
                    name: item.name,
                    image: item.profile_pic_path,
                    isunfollowed: item.user_id_follower === null,
                    description: null,
            }} />
        })}

        { unfollowedTopic.length > 0 && 
            <View style={styles.unfollowedHeaderContainer}>
                <Text style={styles.unfollowedHeaders}>{StringConstant.discoveryMoreTopics}</Text>
            </View>
        }
        { unfollowedTopic.map((item, index) => {
            return <DomainList key={`unfollowedTopic-${index}`} onPressBody={() => __handleOnTopicPress(item)} 
                isHashtag 
                item={{
                    name: item.name,
                    image: item.profile_pic_path,
                    isunfollowed: item.user_id_follower === null,
                    description: null,
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
    unfollowedHeaderContainer: {
        backgroundColor: COLORS.lightgrey,
        height: 40,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    unfollowedHeaders: {
        fontFamily: fonts.inter[600],
        marginLeft: 24,
    }
})

export default TopicFragment