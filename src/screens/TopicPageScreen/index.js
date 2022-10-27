import * as  React from 'react';
import config from 'react-native-config';
import { StatusBar, View } from 'react-native';
import { StreamChat } from 'stream-chat';
import { useNavigation, useRoute } from '@react-navigation/native';

import BlockComponent from '../../components/BlockComponent';
import MemoizedListComponent from './MemoizedListComponent';
import Navigation from './elements/Navigation';
import ProfileTiktokScroll from '../ProfileScreen/elements/ProfileTiktokScroll';
import RenderItem from '../ProfileScreen/elements/RenderItem';
import dimen from '../../utils/dimen';
import removePrefixTopic from '../../utils/topics/removePrefixTopic';
import { Context } from '../../context';
import { convertString } from '../../utils/string/StringUtils';
import { downVote, upVote } from '../../service/vote';
import { getAccessToken } from '../../utils/token';
import { getFeedDetail } from '../../service/post';
import { getTopicPages } from '../../service/topicPages';
import { getUserId } from '../../utils/users';
import { getUserTopic, putUserTopic } from '../../service/topics';
import { linkContextScreenParamBuilder } from '../../utils/navigation/paramBuilder';
import { setTopicFeedByIndex, setTopicFeeds } from '../../context/actions/feeds';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';

const TopicPageScreen = (props) => {
    const route = useRoute();
    const { params } = route
    const [topicName, setTopicName] = React.useState(route?.params?.id);
    const [loading, setLoading] = React.useState(false);
    const [isInitialLoading, setIsInitialLoading] = React.useState(true);
    const [userId, setUserId] = React.useState('');
    const [topicId, setTopicId] = React.useState('');
    const [feedsContext, dispatch] = React.useContext(Context).feeds;
    const feeds = feedsContext.topicFeeds;
    const [isFollow, setIsFollow] = React.useState(false);
    const [userTopicName, setUserTopicName] = React.useState('');
    const [offset, setOffset] = React.useState(0);
    const [client] = React.useContext(Context).client;
    const navigation = useNavigation()

    const refBlockComponent = React.useRef();
    const [headerHeightRef] = React.useState(0);

    const initData = async () => {
        try {
            setIsInitialLoading(true)
            setLoading(true)
            const topicWithPrefix = route.params.id
            const id = removePrefixTopic(topicWithPrefix);
            setTopicName(id);
            setUserTopicName(id);
            const query = `?name=${id}`;
            setTopicId(id);
            // eslint-disable-next-line no-underscore-dangle
            const _resultGetTopicPages = await getTopicPages(id);
            setTopicFeeds(_resultGetTopicPages.data, dispatch);
            setOffset(_resultGetTopicPages.offset)

            // eslint-disable-next-line no-underscore-dangle
            const _resultGetUserTopic = await getUserTopic(query);
            if (_resultGetUserTopic.data) {
                setIsFollow(true);
            }

            setLoading(false)
            setIsInitialLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            initData();
        })

        return unsubscribe
    }, [navigation])

    React.useEffect(() => {
        const parseToken = async () => {
            const id = await getUserId();
            if (id) {
                setUserId(id);
            }
        };

        parseToken();
        initData();
        updateCount()
    }, []);

    const markRead = async () => {
        const filter = { type: 'topics', members: { $in: [userId] }, id: route.params.id };
        const sort = [{ last_message_at: -1 }];
        const thisChannel = await client.client.queryChannels(filter, sort)
        const countRead = await thisChannel[0]?.markRead()
        return countRead
    }

    React.useEffect(() => {
        if (userId !== '') {
            markRead()
        }

    }, [userId])

    const updateCount = () => {
        if (params.refreshList && typeof params.refreshList === 'function') {
            params.refreshList()
        }
    }

    const refreshingData = async (offsetParam = offset) => {
        try {
            setLoading(true);
            const result = await getTopicPages(topicId, offsetParam);
            const { data } = result;
            if (offsetParam === 0) {
                setTopicFeeds(data, dispatch)
            } else {
                setTopicFeeds([...feeds, ...data], dispatch);
            }
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const onDeleteBlockedPostCompleted = async (postId) => {
        const postIndex = feeds.findIndex((item) => item.id === postId)
        const clonedFeeds = [...feeds]
        clonedFeeds.splice(postIndex, 1)
        setTopicFeeds(clonedFeeds, dispatch)
    }

    const onBlockCompleted = async (postId) => {
        onDeleteBlockedPostCompleted(postId)

        await refreshingData(0)
    }

    const handleFollowTopic = async () => {
        try {
            setLoading(true);
            const data = {
                name: userTopicName
            }
            const result = await putUserTopic(data);
            setIsFollow(result.data);
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const onNewPollFetched = (newPolls, index) => {
        setTopicFeedByIndex(
            {
                index,
                singleFeed: newPolls,
            },
            dispatch,
        );
    };

    const onPressDomain = (item) => {
        const param = linkContextScreenParamBuilder(
            item,
            item.og.domain,
            item.og.domainImage,
            item.og.domain_page_id,
        );
        props.navigation.navigate('DomainScreen', param);
    };

    const onEndReach = () => {
        // refreshingData(feeds[feeds.length - 1]?.id);
        refreshingData(offset);
    };

    const onPress = (item) => {
        props.navigation.navigate('PostDetailPage', {
            feedId: item.id,
            isalreadypolling: item.isalreadypolling,
        });
    };

    const onPressComment = (index) => {
        props.navigation.navigate('PostDetailPage', {
            index,
        });
    };

    const onPressBlock = (value) => {
        refBlockComponent.current.openBlockComponent(value)
    };

    const onRefresh = () => {
        refreshingData();
    };


    const setUpVote = async (post, index) => {
        const processVote = await upVote(post);
        updateFeed(post, index);
        return processVote;
    };
    const setDownVote = async (post, index) => {
        const processVote = await downVote(post);
        updateFeed(post, index);
        return processVote
    };


    const updateFeed = async (post, index) => {
        try {
            const data = await getFeedDetail(post.activity_id);
            if (data) {
                setTopicFeedByIndex(
                    {
                        singleFeed: data.data,
                        index,
                    },
                    dispatch,
                );
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <StatusBar barStyle="dark-content" translucent={false} />
            <Navigation domain={topicName} onPress={() => handleFollowTopic()} isFollow={isFollow} />
            <View style={{ flex: 1 }}>
                <ProfileTiktokScroll
                    contentHeight={dimen.size.TOPIC_CURRENT_ITEM_HEIGHT}
                    data={isInitialLoading ? [] : feeds}
                    onEndReach={onEndReach}
                    onRefresh={onRefresh}
                    refreshing={loading}
                    snapToOffsets={(() => {
                        if (feeds) {
                            const posts = feeds?.map((item, index) => headerHeightRef + (index * dimen.size.DOMAIN_CURRENT_HEIGHT))
                            return [headerHeightRef, ...posts]
                        }

                        return [headerHeightRef]
                    })()}
                >
                    {({ item, index }) => (
                        <MemoizedListComponent
                            item={item}
                            onNewPollFetched={onNewPollFetched}
                            index={index}
                            onPressDomain={onPressDomain}
                            onPress={() => onPress(item, index)}
                            onPressComment={() => onPressComment(index)}
                            onPressBlock={() => onPressBlock(item)}
                            onPressUpvote={(post) => setUpVote(post, index)}
                            userId={userId}
                            onPressDownVote={(post) => setDownVote(post, index)}
                            loading={loading}
                        />
                    )}
                </ProfileTiktokScroll>


            </View>
            <BlockComponent ref={refBlockComponent}
                refresh={onBlockCompleted}
                refreshAnonymous={onDeleteBlockedPostCompleted}
                screen="topic_screen" />
        </View>
    );
};
export default withInteractionsManaged(TopicPageScreen);
