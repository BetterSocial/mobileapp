import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';

import DiscoveryTitleSeparator from '../elements/DiscoveryTitleSeparator';
import DomainList from '../elements/DiscoveryItemList';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import RecentSearch from '../elements/RecentSearch';
import StringConstant from '../../../utils/string/StringConstant';
import useIsReady from '../../../hooks/useIsReady';
import { COLORS } from '../../../utils/theme';
import { Context } from '../../../context/Store'
import { colors } from '../../../utils/colors';
import { convertTopicNameToTopicPageScreenParam } from '../../../utils/string/StringUtils';
import { fonts } from '../../../utils/fonts';
import { getUserId } from '../../../utils/users';
import { withInteractionsManaged } from '../../../components/WithInteractionManaged';

const FROM_FOLLOWED_TOPIC = 'fromfollowedtopics';
const FROM_FOLLOWED_TOPIC_INITIAL = 'fromfollowedtopicsinitial';
const FROM_UNFOLLOWED_TOPIC = 'fromunfollowedtopics';
const FROM_UNFOLLOWED_TOPIC_INITIAL = 'fromunfollowedtopicsinitial';

const TopicFragment = () => {
    const [discovery, discoveryDispatch] = React.useContext(Context).discovery
    const [following, followingDispatch] = React.useContext(Context).following

    const navigation = useNavigation()

    const [initialFollowedTopics, setInitialFollowedTopics] = React.useState(
        discovery.initialTopics.filter((item) => item.user_id_follower !== null)
    )
    const [initialUnfollowedTopics, setInitiaUnfollowedTopics] = React.useState(
        discovery.initialTopics.filter((item) => item.user_id_follower === null)
    )
    const [myId, setMyId] = React.useState('')
    // const [isFirstTimeOpen, setIsFirstTimeOpen] = React.useState(true)

    const isReady = useIsReady()

    // const { topics } = following
    let topics = discovery.initialTopics

    const { isLoadingDiscoveryTopic, followedTopic, unfollowedTopic, isFirstTimeOpen } = discovery

    React.useEffect(() => {
        const parseToken = async () => {
            const id = await getUserId();
            if (id) {
                setMyId(id);
            }
        };
        parseToken();
    }, []);

    // React.useEffect(() => {
    //     if(followedTopic.length > 0 || unfollowedTopic.length > 0) setIsFirstTimeOpen(false)
    // },[ followedTopic, unfollowedTopic ])

    const __handleOnTopicPress = (item) => {
        console.log(item)

        let navigationParam = {
            id: convertTopicNameToTopicPageScreenParam(item.name)
        }

        console.log(navigationParam)
        navigation.push('TopicPageScreen', navigationParam)
    }

    const __renderDiscoveryItem = (from, key, item, index) => {
        console.log('' + item.name)
        console.log('' + item?.user_id_follower)
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
                }} />
        </View>
    }

    const __renderTopicItems = () => {
        if (isFirstTimeOpen) {
            let renderArray = []
            initialFollowedTopics.map((item, index) => renderArray.push(__renderDiscoveryItem(FROM_FOLLOWED_TOPIC_INITIAL, "followedTopicDiscovery", item, index)))
            renderArray.push(<DiscoveryTitleSeparator key="topic-title-separator" text='Suggested Topics' />)
            initialUnfollowedTopics.map((item, index) => renderArray.push(__renderDiscoveryItem(FROM_UNFOLLOWED_TOPIC_INITIAL, "unfollowedTopicDiscovery", item, index)))

            return renderArray
            // return [<DiscoveryTitleSeparator key="topic-title-separator" text='Suggested Topics' />].concat(topics.map((item, index) => {
            //     return __renderDiscoveryItem(FROM_FOLLOWED_TOPIC_INITIAL, "followedTopicDiscovery",
            //         // { ...item, user_id_follower: item.user_id_follower ? item.user_id_follower : myId },
            //         item,
            //         index)
            // }))
        }

        return (
            <>
                {followedTopic.map((item, index) => {
                    return __renderDiscoveryItem(FROM_FOLLOWED_TOPIC, "followedTopicDiscovery", item, index)
                })}

                {unfollowedTopic.length > 0 && followedTopic.length > 0 &&
                    <View style={styles.unfollowedHeaderContainer}>
                        <Text style={styles.unfollowedHeaders}>{StringConstant.discoveryMoreTopics}</Text>
                    </View>}
                {unfollowedTopic.map((item, index) => {
                    return __renderDiscoveryItem(FROM_UNFOLLOWED_TOPIC, "unfollowedTopicDiscovery", item, index)
                })}
            </>
        )
    }

    if (!isReady) return <></>

    if (isLoadingDiscoveryTopic) return <View style={styles.fragmentContainer}><LoadingWithoutModal /></View>
    if (followedTopic.length === 0 && unfollowedTopic.length === 0 && !isFirstTimeOpen) return <View style={styles.noDataFoundContainer}>
        <Text style={styles.noDataFoundText}>No Topics found</Text>
    </View>

    return <View>
        <RecentSearch shown={isFirstTimeOpen} />
        {__renderTopicItems()}
    </View>
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
        marginLeft: 20,
    }
})

export default withInteractionsManaged(TopicFragment)
// export default TopicFragment