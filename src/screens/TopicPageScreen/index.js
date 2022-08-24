import * as  React from 'react';
import { StatusBar, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

import BlockComponent from '../../components/BlockComponent';
import MemoizedListComponent from './MemoizedListComponent';
import Navigation from './elements/Navigation';
import ProfileTiktokScroll from '../ProfileScreen/elements/ProfileTiktokScroll';
import dimen from '../../utils/dimen';
import { Context } from '../../context';
import { convertString } from '../../utils/string/StringUtils';
import { downVote, upVote } from '../../service/vote';
import { getFeedDetail } from '../../service/post';
import { getTopicPages } from '../../service/topicPages';
import { getUserId } from '../../utils/users';
import { getUserTopic, putUserTopic } from '../../service/topics';
import { linkContextScreenParamBuilder } from '../../utils/navigation/paramBuilder';
import { setTopicFeedByIndex, setTopicFeeds } from '../../context/actions/feeds';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';
import removePrefixTopic from '../../utils/topics/removePrefixTopic';

const TopicPageScreen = (props) => {
    const route = useRoute();
    const { params } = route
    const [topicName, setTopicName] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [userId, setUserId] = React.useState('');
    const [topicId, setTopicId] = React.useState('');
    const [feedsContext, dispatch] = React.useContext(Context).feeds;
    const feeds = feedsContext.topicFeeds;
    const [isFollow, setIsFollow] = React.useState(false);
    const [userTopicName, setUserTopicName] = React.useState('');
    const [offset, setOffset] = React.useState(0);

    const refBlockComponent = React.useRef();
    const [headerHeightRef, setHeaderHeightRef] = React.useState(0)


    React.useEffect(() => {
        const parseToken = async () => {
            const id = await getUserId();
            if (id) {
                setUserId(id);
            }
        };
        parseToken();

        return () => {
            setTopicFeeds([], dispatch)
        }
    }, []);
    React.useEffect(() => {
        const initData = async () => {
            try {
                setLoading(true)
                console.log(route.params.id)
                const topicWithPrefix = route.params.id
                const id = removePrefixTopic(topicWithPrefix);
                setTopicName(id);
                setUserTopicName(id);
                const query = `?name=${convertString(id, '-', ' ')}`;
                // eslint-disable-next-line no-underscore-dangle
                const _resultGetTopicPages = await getTopicPages(id);
                setTopicId(id);
                setTopicFeeds(_resultGetTopicPages.data, dispatch);
                setOffset(_resultGetTopicPages.offset)

                // eslint-disable-next-line no-underscore-dangle
                const _resultGetUserTopic = await getUserTopic(query);
                console.log(_resultGetUserTopic);
                if (_resultGetUserTopic.data) {
                    setIsFollow(true);
                }

                setLoading(false)
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }

        initData();
    }, []);

    React.useEffect(() => () => {
        updateCount()
    }, [])
    const updateCount = () => {
        if (params.refreshList && typeof params.refreshList === 'function') {
            params.refreshList()
        }
    }

    const refreshingData = async (offsetParam = offset) => {
        try {
            setLoading(true);
            const result = await getTopicPages(topicId, offsetParam);
            const { data } = result; if (offsetParam === 0) {
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
        refreshingData(feeds[feeds.length - 1]?.id);
    };

    const onPress = (item, index) => {
        props.navigation.navigate('PostDetailPage', {
            index,
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
                    data={feeds}
                    onEndReach={onEndReach}
                    onRefresh={onRefresh}
                    refreshing={loading}
                    snapToOffsets={(() => {
                        const posts = feeds.map((item, index) => headerHeightRef + (index * dimen.size.DOMAIN_CURRENT_HEIGHT))
                        // console.log('posts')
                        // console.log(posts)
                        return [headerHeightRef, ...posts]
                    })()}>
                    {({ item, index }) => (
                        <MemoizedListComponent
                            key={`topicitem-${index}`} item={item}
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
