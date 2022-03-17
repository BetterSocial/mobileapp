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
import { convertTopicNameToTopicPageScreenParam } from '../../../utils/string/StringUtils';
import { fonts } from '../../../utils/fonts';
import { getUserId } from '../../../utils/users';

const FROM_FOLLOWED_TOPIC = 'fromfollowedtopics';
const FROM_FOLLOWED_TOPIC_INITIAL = 'fromfollowedtopicsinitial';
const FROM_UNFOLLOWED_TOPIC = 'fromunfollowedtopics';

const TopicFragment = () => {
    const navigation = useNavigation()
    const [myId, setMyId] = React.useState('')
    const [isFirstTimeOpen, setIsFirstTimeOpen] = React.useState(true)
    const [discovery, discoveryDispatch] = React.useContext(Context).discovery
    const [following, followingDispatch] = React.useContext(Context).following

    const { topics } = following
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

    React.useEffect(() => {
        if(followedTopic.length > 0 || unfollowedTopic.length > 0) setIsFirstTimeOpen(false)
    },[ followedTopic, unfollowedTopic ])

    const __handleOnTopicPress = (item) => {
        console.log(item)

        let navigationParam = {
            id: convertTopicNameToTopicPageScreenParam(item.name)
        }

        console.log(navigationParam)
        navigation.push('TopicPageScreen', navigationParam)
    }

    const __renderDiscoveryItem = (from, key, item, index) => {
        return <View key={`${key}-${index}`} style={styles.domainContainer}>
                <DomainList
                    // handleSetFollow={() => __handleFollow(from, true, item, index)}
                    // handleSetUnFollow={() => __handleFollow(from, false, item, index)}
                    key={`followedTopic-${index}`} 
                    onPressBody={() => __handleOnTopicPress(item)} 
                    isHashtag 
                    item={{
                        name: item.name,
                        image: item.profile_pic_path,
                        isunfollowed: item.user_id_follower === null,
                        description: null,
                    }}/>
            </View>
    }

    const __renderTopicItems = () => {
        if(isFirstTimeOpen) return topics.map((item, index) => {
            return __renderDiscoveryItem(FROM_FOLLOWED_TOPIC_INITIAL, "followedTopicDiscovery",
                { ...item, user_id_follower: item.user_id_follower ? item.user_id_follower : myId }, index)
        })

        return (
            <>
                { followedTopic.map((item, index) => {
                    return __renderDiscoveryItem(FROM_FOLLOWED_TOPIC, "followedTopicDiscovery", item, index)
                })}

                { unfollowedTopic.length > 0 && 
                    <View style={styles.unfollowedHeaderContainer}>
                    <Text style={styles.unfollowedHeaders}>{StringConstant.discoveryMoreTopics}</Text>
                    </View>}
                { unfollowedTopic.map((item, index) => {
                    return __renderDiscoveryItem(FROM_UNFOLLOWED_TOPIC, "unfollowedTopicDiscovery", item, index)
                })}
            </>
        )
    }
    
    if(isLoadingDiscovery) return <View style={styles.fragmentContainer}><LoadingWithoutModal/></View>
    if(followedTopic.length === 0 && unfollowedTopic.length === 0 && !isFirstTimeOpen) return <View style={styles.noDataFoundContainer}>
        <Text style={styles.noDataFoundText}>No Topics found</Text>
    </View>

    return <ScrollView style={styles.fragmentContainer}>
        { __renderTopicItems() }
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