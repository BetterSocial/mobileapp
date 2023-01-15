import * as React from 'react';
/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import { useNavigation } from '@react-navigation/core';
import { debounce } from 'lodash';
import PSL from 'psl'
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
import Toast from 'react-native-simple-toast';
/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import {
    Alert,
    BackHandler,
    Dimensions,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Animated
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { openSettings } from 'react-native-permissions';

import ContentLink from './elements/ContentLink';
import CreatePollContainer from './elements/CreatePollContainer';
import CreatePostInput from '../../components/CreatePostInput';
import Gap from '../../components/Gap';
import Header from '../../components/Header';
import ListItem from '../../components/MenuPostItem';
import Loading from '../Loading';
import Location from '../../assets/icons/Ic_location';
import MemoIc_hastag from '../../assets/icons/Ic_hastag';
import Timer from '../../assets/icons/Ic_timer';
import MemoIc_user_group from '../../assets/icons/Ic_user_group';
import MemoIc_world from '../../assets/icons/Ic_world';
import ProfileDefault from '../../assets/images/ProfileDefault.png';
import { Button, ButtonAddMedia } from '../../components/Button';
import TopicItem from '../../components/TopicItem';
import { Context } from '../../context';
import { getLinkPreviewInfo } from '../../service/feeds';
import { ShowingAudience, createPollPost, createPost } from '../../service/post';
import { getMyProfile } from '../../service/profile';
import { getSpecificCache } from '../../utils/cache';
import { PROFILE_CACHE } from '../../utils/cache/constant';
import { colors } from '../../utils/colors';
import { convertString } from '../../utils/string/StringUtils';
import { fonts, normalizeFontSize } from '../../utils/fonts';
import { MAX_POLLING_ALLOWED, MIN_POLLING_ALLOWED } from '../../utils/constants';
import {
    requestCameraPermission,
    requestExternalStoragePermission,
} from '../../utils/permission';
import {
    getDurationId,
    getLocationId,
    getPrivacyId,
    setDurationId,
    setPrivacyId
} from '../../utils/setting';
import { getUrl, isContainUrl } from '../../utils/Utils';
import { getUserId } from '../../utils/users';
import WarningAnimatedMessage from '../../components/WarningAnimateMessage';
import StringConstant from '../../utils/string/StringConstant';
import SheetAddTopic from './elements/SheetAddTopic';
import SheetCloseBtn from './elements/SheetCloseBtn';
import SheetExpiredPost from './elements/SheetExpiredPost';
import SheetGeographic from './elements/SheetGeographic';
import SheetMedia from './elements/SheetMedia';
import SheetPrivacy from './elements/SheetPrivacy';
import ShowMedia from './elements/ShowMedia';
import useHastagMention from './elements/useHastagMention';
import UserProfile from './elements/UserProfile';
import { Analytics } from '../../libraries/analytics/firebaseAnalytics';


const MemoShowMedia = React.memo(ShowMedia, compire);
function compire(prevProps, nextProps) {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}
const CreatePost = () => {
    const defaultPollItem = [{ text: '' }, { text: '' }];
    const navigation = useNavigation();
    const sheetMediaRef = React.useRef();
    const sheetTopicRef = React.useRef();
    const sheetExpiredRef = React.useRef();
    const sheetGeoRef = React.useRef();
    const sheetPrivacyRef = React.useRef();
    const sheetBackRef = React.useRef();

    const [message, setMessage] = React.useState('');
    const [mediaStorage, setMediaStorage] = React.useState([]);
    const [listTopic, setListTopic] = React.useState([]);
    const [listTopicChat, setListTopicChat] = React.useState([])
    const [isPollShown, setIsPollShown] = React.useState(false);
    const [polls, setPolls] = React.useState([...defaultPollItem]);
    const [isPollMultipleChoice, setIsPollMultipleChoice] = React.useState(false);
    const [linkPreviewMeta, setLinkPreviewMeta] = React.useState(null);
    const [isLinkPreviewShown, setIsLinkPreviewShown] = React.useState(false);
    const [audienceEstimations, setAudienceEstimations] = React.useState(0);
    const [privacySelect, setPrivacySelect] = React.useState(0);
    const [dataImage, setDataImage] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [typeUser, setTypeUser] = React.useState(false);
    const [dataProfile, setDataProfile] = React.useState({});
    const [geoList, setGeoList] = React.useState([]);
    const [geoSelect, setGeoSelect] = React.useState(0);
    const [topicSearch, setTopicSearch] = React.useState([]);
    const [listUsersForTagging, setListUsersForTagging] = React.useState([]);
    const [positionTopicSearch, setPositionTopicSearch] = React.useState(0);
    const [locationId, setLocationId] = React.useState('');
    const [hastagPosition, setHastagPosition] = React.useState(0);
    const [positionKeyboard, setPositionKeyboard] = React.useState('never')
    const [taggingUsers, setTaggingUsers] = React.useState([])
    const { setHashtags } = useHastagMention('');
    const [client] = React.useContext(Context).client;
    const [user] = React.useContext(Context).profile;
    const [allTaggingUser, setAllTaggingUser] = React.useState([])
    const animatedReminder = React.useRef(new Animated.Value(0)).current

    const [selectedTime, setSelectedTime] = React.useState({
        day: 1,
        hour: 0,
        minute: 0,
    });
    const [expiredSelect, setExpiredSelect] = React.useState(0);
    const [postExpired] = React.useState([
        {
            label: '24 hours',
            value: '1',
            expiredobject: {
                hour: 24,
                day: 1,
            },
        },
        {
            label: '7 days',
            value: '7',
            expiredobject: {
                hour: 24,
                day: 7,
            },
        },
        {
            label: '30 days',
            value: '30',
            expiredobject: {
                hour: 24,
                day: 30,
            },
        },
        {
            label: 'Never',
            value: 'never',
            expiredobject: {
                hour: 24,
                day: 30,
            },
        },
    ]);

    const debounced = React.useCallback(debounce((changedText) => {
        if (isContainUrl(changedText)) {
            getPreviewUrl(getUrl(changedText));
        } else {
            setIsLinkPreviewShown(false);
        }
    }, 1000), [])

    const listPostExpired = [
        {
            label: '24 hours',
            value: '1',
            expiredobject: {
                hour: 24,
                day: 1,
            },
        },
        {
            label: '7 days',
            value: '7',
            expiredobject: {
                hour: 24,
                day: 7,
            },
        },
        {
            label: '30 days',
            value: '30',
            expiredobject: {
                hour: 24,
                day: 30,
            },
        },
        {
            label: 'Never',
            value: 'never',
            expiredobject: {
                hour: 24,
                day: 30,
            },
        },
    ]

    const listPrivacy = [
        {
            icon: <MemoIc_world height={16.67} width={16.67} />,
            label: 'Public',
            desc: 'Anyone in your geographic target area can see your post',
            key: 'public',
        },
        {
            icon: <MemoIc_user_group height={16.67} width={16.67} />,
            label: 'People I follow',
            desc: 'Only those you follow can see your post',
            key: 'people_i_follow',
        },
    ];

    React.useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const privacyId = await getPrivacyId();
        if (privacyId) {
            setPrivacySelect(privacyId);
        }
        const durationId = await getDurationId();
        if (durationId) {
            setExpiredSelect(durationId);
        }
        const locationId = await getLocationId();
        if (locationId) {
            setGeoSelect(locationId);
        }
    };

    const getPreviewUrl = async (link) => {
        const newLink = link;

        const urlWithoutProtocol = link.replace(/(^\w+:|^)\/\//, '');
        const urlDomainOnly = urlWithoutProtocol.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/igm)
        const parsedUrl = PSL.parse(urlDomainOnly[0] || urlWithoutProtocol)

        const response = await getLinkPreviewInfo(parsedUrl?.domain, newLink)
        if (response?.success) {
            const data = response?.data
            const { domain, meta } = data || {}
            setLinkPreviewMeta({
                domain: domain?.name,
                domainImage: domain?.image,
                title: meta?.title,
                description: meta?.description,
                image: meta?.image,
                url: meta?.url
            })
        } else setLinkPreviewMeta(null)
        setIsLinkPreviewShown(response?.success)
    }

    React.useEffect(() => {
        debounced(message)
    }, [message]);

    const location = [
        {
            location_id: 'everywhere',
            neighborhood: 'Everywhere',
        },
    ];

    const fetchMyProfile = async () => {
        setLoading(true);
        const userId = await getUserId();
        if (userId) {
            const result = await getMyProfile(userId);
            if (result.code === 200) {
                setDataProfile(result.data);
                setLoading(false);
                handleLocation(result.data)
            }

            setLoading(false);
        }
    };

    React.useEffect(() => {
        getSpecificCache(PROFILE_CACHE, async (res) => {
            if (!res) {
                fetchMyProfile()
            } else {
                setDataProfile(res);
                handleLocation(res)
            }
        })
    }, [])


    const handleLocation = async (res) => {
        await res.locations.map((res) => {
            location.push({
                location_id: res.location_id,
                neighborhood: res.neighborhood,
            });
        });
        setGeoList(location)
        setLoading(false)
    }

    React.useEffect(() => {
        fetchMyProfile();
    }, []);

    React.useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', onBack);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBack);
        };
    }, [message]);

    const getEstimationsAudience = async (privacy, location) => {
        const data = await ShowingAudience(privacy, location);
        setAudienceEstimations(data.data);
    };

    const uploadMediaFromLibrary = async () => {
        const { success, message } = await requestExternalStoragePermission();
        if (success) {
            launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (res) => {
                if (res.didCancel && __DEV__) {
                    console.log('User cancelled image picker');
                } else if (res.uri) {
                    const newArr = {
                        id: mediaStorage.length,
                        data: res.uri,
                    };
                    setMediaStorage((val) => [...val, newArr]);
                    setDataImage((val) => [...val, res.base64]);
                    sheetMediaRef.current.close();
                } else {
                    // console.log(res);
                }
            });
        } else {
            Alert.alert('Permission denied', 'Allow Better Social to access photos and media on your device ?', [{ text: 'Open Settings', onPress: () => openSettings().then(() => sheetMediaRef.current.close()) }, { text: 'Close' }])
        }
    };

    const takePhoto = async () => {
        const { success, message } = await requestCameraPermission();
        if (success) {
            launchCamera({ mediaType: 'photo', includeBase64: true }, (res) => {
                if (res.didCancel && __DEV__) {
                    console.log('User cancelled image picker');
                } else if (res.uri) {
                    const newArr = {
                        id: mediaStorage.length,
                        data: res.uri,
                    };
                    setMediaStorage((val) => [...val, newArr]);
                    setDataImage((val) => [...val, res.base64]);
                    sheetMediaRef.current.close();
                }
            });
        } else {
            Toast.show(message, Toast.SHORT);
        }
    };

    const onRemoveItem = (v) => {
        const deleteItem = mediaStorage.filter((item) => item.id !== v);
        const index = mediaStorage.findIndex((item) => item.id === v)
        const newImageData = [...dataImage].splice(index)
        setDataImage(newImageData)
        setMediaStorage(deleteItem);
    };

    const onRemoveAllMedia = () => {
        setMediaStorage([]);
    };

    const removeTopic = (v) => {
        const newArr = listTopic.filter((e) => e !== v);
        const newChat = listTopicChat.filter((chat) => chat !== `topic_${v}`)
        setListTopic(newArr);
        setHashtags(newArr);
        setListTopicChat(newChat)
    };
    const onSetExpiredSelect = (v) => {
        setExpiredSelect(v);
        sheetExpiredRef.current.close();
    };
    const onSetGeoSelect = (v) => {
        getEstimationsAudience(
            listPrivacy[privacySelect].key,
            geoList[v].location_id,
        );
        setGeoSelect(v);
        setLocationId(geoList[v].location_id);
        sheetGeoRef.current.close();
    };
    const onSetPrivacySelect = (v) => {
        getEstimationsAudience(listPrivacy[v].key, geoList[geoSelect].location_id);
        setPrivacySelect(v);
        sheetPrivacyRef.current.close();
    };

    const getReducedPoll = () => {
        const reducedPoll = polls.reduce((acc, current) => {
            if (current.text !== '') {
                acc.push(current);
            }
            return acc;
        }, []);

        return reducedPoll;
    };
    const onBack = () => {
        if (message || getReducedPoll().length > 0 || mediaStorage.length > 0) {
            sheetBackRef.current.open();
            return true;
        }

        navigation.goBack();
        return true;
    };

    const onSaveTopic = (v, topicChat) => {
        setListTopic(v);
        setHashtags(v)
        setListTopicChat(topicChat)
        sheetTopicRef.current.close();
    };

    const checkTaggingUser = () => {
        const mapTagUser = taggingUsers.map((data) => {
            const findData = allTaggingUser.find((dataUser) => dataUser.username === data)
            return findData.user_id
        })
        return mapTagUser
    }

    const postTopic = async () => {
        try {
            if (message === '') {
                showMessage({
                    message: StringConstant.createPostFailedNoMessage,
                    type: 'danger',
                });
                return true;
            }
            const data = {
                topics: listTopic,
                message,
                verb: 'tweet',
                feedGroup: 'main_feed',
                // privacy: listPrivacy[privacySelect].label,
                privacy: listPrivacy[privacySelect].key,
                anonimity: typeUser,
                location: geoList[geoSelect].neighborhood,
                location_id: locationId,
                duration_feed: postExpired[expiredSelect].value,
                images_url: dataImage,
                tagUsers: checkTaggingUser()
            };

            setLocationId(JSON.stringify(geoSelect));
            setDurationId(JSON.stringify(expiredSelect));
            setPrivacyId(JSON.stringify(privacySelect));
            Analytics.logEvent('create_post', {
                id: 6,
                newpost_reach: geoList[geoSelect].neighborhood,
                newpost_privacy: listPrivacy[privacySelect].label,
                num_images: dataImage.length,
                added_poll: false,
                topics_added: listTopic,
                anon: typeUser,
                predicted_audience: audienceEstimations,
            });
            navigation.navigate('HomeTabs', {
                screen: 'Feed',
                params: {
                    refresh: true,
                },
            });
            await createPost(data);
            handleTopicChat()
            showMessage({
                message: StringConstant.createPostDone,
                type: 'success',
            });
        } catch (error) {
            if (__DEV__) {
                console.log(error);
            }
        }
    };

    const randerComponentMedia = () => {
        if (isPollShown || isLinkPreviewShown) {
            return <View />;
        }

        if (mediaStorage.length > 0) {
            return (
                <MemoShowMedia
                    data={mediaStorage.reverse()}
                    onRemoveItem={onRemoveItem}
                    onRemoveAll={() => onRemoveAllMedia()}
                    onAddMedia={() => sheetMediaRef.current.open()}
                />
            );
        }

        return (
            <ButtonAddMedia
                label="+ Add media or poll"
                onPress={() => sheetMediaRef.current.open()}
                labelStyle={styles.labelButtonAddMedia}
            />
        );

    };

    const handleTextMessage = () => {
        if (!typeUser) {
            return `New posts by ${user.myProfile.username} & others`
        }
        return `New posts by Anonymous & others`
    }

    const handleTopicChat = async () => {
        const defaultImage = 'https://res.cloudinary.com/hpjivutj2/image/upload/v1636632905/vdg8solozeepgvzxyfbv.png'
        const allTopics = listTopic

        allTopics.forEach(async (topic) => {
            const channel = await client.client.channel('topics', `topic_${topic}`, { name: `#${topic}`, members: [user.myProfile.user_id], channel_type: 3, channel_image: defaultImage, channelImage: defaultImage, image: defaultImage })
            await channel.create()
            await channel.addMembers([user.myProfile.user_id])
            await channel.sendMessage({ text: handleTextMessage() }, { skip_push: true })
        })
    }
    const createPoll = () => {
        setIsPollShown(true);
        sheetMediaRef.current.close();
    };

    const removeAllPoll = () => {
        const isPollNotEmpty = polls.reduce(
            (accumulator, current) => accumulator || current.text !== '',
            false,
        );
        if (isPollNotEmpty) {
            return Alert.alert('Are you sure?', 'This cannot be undone', [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    onPress: () => {
                        setIsPollShown(false);
                        setPolls(defaultPollItem);
                    },
                },
            ]);
        }

        setIsPollShown(false);
        setPolls(defaultPollItem);
        return null
    };

    const addNewPollItem = () => {
        if (polls.length >= MAX_POLLING_ALLOWED) {
            return;
        }
        setPolls([...polls, { text: '' }]);
    };

    const removeSinglePollByIndex = (index) => {
        if (polls.length <= MIN_POLLING_ALLOWED) {
            return;
        }
        polls.splice(index, 1);
        setPolls([...polls]);
    };

    const onSinglePollChanged = (item, index) => {
        polls[index] = item;
        setPolls([...polls]);
    };

    const isPollButtonDisabled = () => getReducedPoll().length < 2;

    const sendPollPost = async () => {
        // setLoading(true);
        const data = {
            message,
            topics: ['poll'],
            verb: 'poll',
            object: {},
            feedGroup: 'main_feed',
            privacy: listPrivacy[privacySelect].label,
            anonimity: typeUser,
            location: geoList[geoSelect].neighborhood,
            location_id: locationId,
            duration_feed: postExpired[expiredSelect].value,
            polls: getReducedPoll(),
            pollsduration: selectedTime,
            multiplechoice: isPollMultipleChoice,
            tagUsers: checkTaggingUser()
        };

        setLocationId(JSON.stringify(geoSelect));
        setDurationId(JSON.stringify(expiredSelect));
        setPrivacyId(JSON.stringify(privacySelect));
        navigation.navigate('HomeTabs', {
            screen: 'Feed',
            params: {
                refresh: true,
            },
        });
        try {
            await createPollPost(data);
            showMessage({
                message: StringConstant.createPostDone,
                type: 'success',
            });
        } catch (e) {
            if (__DEV__) {
                console.log(e);
            }
        }
        Analytics.logEvent('create_post', {
            id: 6,
            newpost_reach: geoList[geoSelect].neighborhood,
            newpost_privacy: listPrivacy[privacySelect].label,
            num_images: 0,
            added_poll: true,
            topics_added: listTopic,
            anon: typeUser,
            predicted_audience: audienceEstimations,
        });
    };

    const renderListTopic = () => {
        if (listTopic.length > 0) {
            return (
                <ScrollView
                    style={styles.listTopic}
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    {listTopic.map((value, index) => (
                        <Pressable key={index} onPress={openTopic}>
                            <TopicItem label={value} removeTopic={removeTopic} onTopicPress={() => openTopic()} />
                        </Pressable>
                    ))}
                </ScrollView>
            );
        }
        return <View />;
    };

    // eslint-disable-next-line no-extend-native, func-names
    String.prototype.insert = function (index, string) {
        if (index > 0) {
            return this.substring(0, index) + string + this.substr(index);
        }

        return string + this;
    };

    const openTopic = () => {
        setPositionKeyboard('always')
        sheetTopicRef.current.open()
    }

    const reformatStringByPosition = (str = '', strFromState = '') => {
        const topicItem = convertString(str, " ", "");
        const topicItemWithSpace = topicItem.concat(' ');
        const oldMessage = strFromState;
        const start = hastagPosition + 1;
        const end = positionTopicSearch + 1;
        const s = oldMessage.substring(0, end);
        const newMessage = s.insert(start, topicItemWithSpace);
        return newMessage;
    }

    const handleTagUser = debounce(() => {
        const regex = /(^|\W)(@[a-z\d][\w-]*)/ig
        const findRegex = message.match(regex)
        if (findRegex) {
            const newMapRegex = findRegex.map((tagUser) => {
                const newTagUser = tagUser.replace(/\s/g, '').replace('@', '')
                return newTagUser
            })
            setTaggingUsers(newMapRegex)
        } else {
            setTaggingUsers([])
        }
    }, 500)


    React.useEffect(() => {
        handleTagUser()
    }, [message])

    React.useEffect(() => {
        if(typeUser) {
            Animated.sequence([
                Animated.timing(animatedReminder, {
                    toValue: 1,
                    useNativeDriver: true
                })
            ]).start()
        } else {
            animatedReminder.setValue(0)
        }
    }, [typeUser])

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent={false} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={positionKeyboard}
            >
                <Header title="Create a post" onPress={() => onBack()} />
                <View style={{ paddingHorizontal: 15 }} >
                    <UserProfile
                        typeUser={typeUser}
                        setTypeUser={setTypeUser}
                        username={
                            dataProfile.username ? dataProfile.username : 'Loading . . .'
                        }
                        photo={
                            dataProfile.profile_pic_path
                                ? { uri: dataProfile.profile_pic_path }
                                : ProfileDefault
                        }
                        onPress={() => {
                            setMessage('');
                            navigation.navigate('ProfileScreen', {
                                isNotFromHomeTab: true
                            });
                        }}
                    />
                    <Gap style={styles.height(8)} />
                    <CreatePostInput
                        setMessage={setMessage}
                        setPositionKeyboard={setPositionKeyboard}
                        setTopics={setListTopic}
                        topics={listTopic}
                        message={message}
                        setTopicChats={setListTopicChat}
                        topicChats={listTopicChat}
                        allTaggedUser={allTaggingUser}
                        setAllTaggedUser={setAllTaggingUser}
                    />
                    {typeUser && (
                    <Animated.View style={[{opacity: animatedReminder}, styles.reminderContainer]} >
                        <Text style={styles.whiteText} >Even when anonymous, you can be blocked by others.</Text>
                    </Animated.View>
                    )}

                    {isLinkPreviewShown && (
                        <ContentLink
                            og={
                                linkPreviewMeta || {
                                    domain: '',
                                    domainImage: null,
                                    title: '',
                                    description: '',
                                    image: null,
                                    url: '',
                                }
                            }
                        />
                    )}

                    {isPollShown && (
                        <CreatePollContainer
                            polls={polls}
                            onaddpoll={() => addNewPollItem()}
                            onsinglepollchanged={(item, index) =>
                                onSinglePollChanged(item, index)
                            }
                            onremovesinglepoll={(index) => removeSinglePollByIndex(index)}
                            onremoveallpoll={() => removeAllPoll()}
                            ismultiplechoice={isPollMultipleChoice}
                            selectedtime={selectedTime}
                            ontimechanged={(timeObject) => setSelectedTime(timeObject)}
                            onmultiplechoicechanged={(ismultiplechoice) =>
                                setIsPollMultipleChoice(ismultiplechoice)
                            }
                            expiredobject={postExpired[expiredSelect].expiredobject}
                        />
                    )}
                    <Gap style={styles.height(26)} />
                    {randerComponentMedia()}
                    <Gap style={styles.height(29)} />
                    <Text style={styles.label}>Advanced Settings</Text>
                    <Gap style={styles.height(12)} />
                    <ListItem
                        icon={<MemoIc_hastag width={16.67} height={16.67} />}
                        topic={listTopic.length > 0}
                        listTopic={renderListTopic()}
                        label="Add Topics"
                        labelStyle={styles.hastagText}
                        onPress={openTopic}
                    />
                    <Gap style={styles.height(16)} />
                    <ListItem
                        icon={<Timer width={16.67} height={16.67} />}
                        label={postExpired.length === 0
                            ? 'Loading...'
                            : listPostExpired[expiredSelect].label}
                        labelStyle={styles.listText}
                        onPress={() => sheetExpiredRef.current.open()}
                    />
                    <Gap style={styles.height(16)} />
                    <ListItem
                        icon={<Location width={16.67} height={16.67} />}
                        label={
                            geoList.length === 0
                                ? 'Loading...'
                                : geoList[geoSelect].neighborhood
                        }
                        labelStyle={styles.listText}
                        onPress={() => sheetGeoRef.current.open()}
                    />
                    <Gap style={styles.height(16)} />
                    <ListItem
                        icon={<MemoIc_world width={16.67} height={16.67} />}
                        label={listPrivacy.length === 0
                            ? 'Loading...'
                            : listPrivacy[privacySelect].label}
                        labelStyle={styles.listText}
                        onPress={() => sheetPrivacyRef.current.open()}
                    />
                    {/* <Gap style={styles.height(16)} />
        <Text style={styles.desc}>
          Your post targets{' '}
          <Text style={styles.userTarget}>~ {audienceEstimations}</Text> users.
        </Text> */}
                    <Gap style={styles.height(25)} />
                    {isPollShown ? (
                        <Button
                            disabled={isPollButtonDisabled()}
                            onPress={() => sendPollPost()}>
                            Post
                        </Button>
                    ) : (
                        <Button onPress={() => postTopic()}>Post</Button>
                    )}
                    <Gap style={styles.height(18)} />
                    <SheetMedia
                        refMedia={sheetMediaRef}
                        medias={mediaStorage}
                        uploadFromMedia={() => uploadMediaFromLibrary()}
                        takePhoto={() => takePhoto()}
                        createPoll={() => createPoll()}
                    />
                    <SheetAddTopic
                        refTopic={sheetTopicRef}
                        onAdd={(v, chatTopci) => onSaveTopic(v, chatTopci)}
                        topics={listTopic} chatTopics={listTopicChat}
                        onClose={() => sheetTopicRef.current.close()}
                    // saveOnClose={(v, chatTopic) => onSaveTopic(v, chatTopic)}
                    />
                    <SheetExpiredPost
                        refExpired={sheetExpiredRef}
                        data={postExpired}
                        select={expiredSelect}
                        onSelect={onSetExpiredSelect}
                    />
                    <SheetGeographic
                        geoRef={sheetGeoRef}
                        data={geoList}
                        select={geoSelect}
                        onSelect={onSetGeoSelect}
                    />
                    <SheetPrivacy
                        privacyRef={sheetPrivacyRef}
                        data={listPrivacy}
                        select={privacySelect}
                        onSelect={onSetPrivacySelect}
                    />
                    <SheetCloseBtn
                        backRef={sheetBackRef}
                        goBack={() => navigation.goBack()}
                        continueToEdit={() => sheetBackRef.current.close()}
                    />
                </View>

            </ScrollView>
            <Loading visible={loading} />
            <WarningAnimatedMessage isSHow={typeUser} />

        </SafeAreaView>
    );
};

export default CreatePost;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
    },
    input: {
        backgroundColor: colors.lightgrey,
        paddingVertical: 16,
        paddingHorizontal: 12,
        minHeight: 100,
        justifyContent: 'flex-start',
        overflow: 'scroll',
    },
    hastagText: {
        color: colors.gray1,
        fontSize: 14,
        fontFamily: fonts.inter[400],
    },
    listText: {
        color: colors.black,
        fontSize: 14,
        fontFamily: fonts.inter[400],
    },
    label: {
        color: colors.black,
        fontFamily: fonts.inter[600],
        fontWeight: 'bold',
    },
    desc: { fontSize: 14, fontFamily: fonts.poppins[400] },
    labelButtonAddMedia: {
        color: colors.black,
        fontFamily: fonts.inter[600],
        fontSize: 14,
        fontWeight: 'bold',
    },
    listTopic: {
        flexDirection: 'row',
        marginLeft: 10,
        zIndex: 999,
        paddingTop: 11,
        paddingBottom: 13,
    },
    userTarget: {
        color: colors.bondi_blue,
        fontSize: 14,
        fontFamily: fonts.poppins[400],
    },
    height: (height) => ({
        height,
    }),
    reminderContainer: {
        backgroundColor: '#2F80ED',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 7,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10

    },
    whiteText: {
        color: 'white',
        fontSize: normalizeFontSize(10),
        textAlign: 'center'
    }
});
