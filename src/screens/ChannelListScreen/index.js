import * as React from 'react';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import moment from 'moment'
import { ActivityIndicator, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import {
  ChannelList,
  ChannelPreviewMessage,
  ChannelPreviewMessenger,
  ChannelPreviewStatus,
  ChannelPreviewTitle,
  Chat,
  Streami18n,
} from 'stream-chat-react-native';

import CustomPreviewAvatar from './elements/CustomPreviewAvatar';
import IconChatCheckMark from '../../assets/icon/IconChatCheckMark'
import Loading from '../Loading';
import Search from './elements/Search';
import {
  CHANNEL_TYPE_GROUP_LOCATION,
  CHANNEL_TYPE_TOPIC,
} from '../../utils/constants';
import { COLORS } from '../../utils/theme';
import { Context } from '../../context';
import { calculateTime } from '../../utils/time';
import { getChatName } from '../../utils/string/StringUtils';
import { getUserId } from '../../utils/users';
import { setChannel } from '../../context/actions/setChannel';
import { setMainFeeds } from '../../context/actions/feeds';
import { unReadMessageState } from '../../context/reducers/unReadMessageReducer';
import { useClientGetstream } from '../../utils/getstream/ClientGetStram';

const ChannelListScreen = ({ navigation }) => {
  const streami18n = new Streami18n({
    language: 'en',
  });

  const [userId, setUserId] = React.useState('');
  const [client] = React.useContext(Context).client;
  const [, dispatch] = React.useContext(Context).channel;
  const [, dispatchFeed] = React.useContext(Context).feeds;
  const [profile] = React.useContext(Context).profile;
  const [unReadMessage, dispatchUnReadMessage] =
    React.useContext(Context).unReadMessage;
  let connect = useClientGetstream();
  const filters = {
    members: { $in: [userId] },
    type: 'messaging',
  };

  React.useEffect(() => { }, [unReadMessage]);

  const sort = [{ last_message_at: -1 }, { cid: -1 }];
  const options = {
    state: true,
    watch: true,
    presence: true,
  };

  const memoizedFilters = React.useMemo(() => filters, [userId]);

  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'ChannelListScreen',
      screen_name: 'Channel List',
    });
    connect();
    setupClient();
  }, []);
  const setupClient = async () => {
    try {
      const id = await getUserId();
      console.log('user id ', id);
      setUserId(id);
    } catch (err) {
      crashlytics().recordError(err);
    }
  };

  const customPreviewStatus = (props) => {
    let newLatestMessagePreview = { ...props.latestMessagePreview };
    console.log('props.latestMessagePreview');
    console.log(props.latestMessagePreview);
    // if (props.latestMessagePreview.status > 1) {
    //   newLatestMessagePreview.status = 3;
    // }


    let renderCheckMark = () => {
      let showCheckMark = props?.latestMessagePreview?.messageObject?.id?.indexOf(userId) > -1
      let checkMarkStatus = props?.latestMessagePreview?.status
      if(!showCheckMark) return <></>
      
      // Not sent yet
      if(checkMarkStatus === 0) {
        // TODO: Change to clock icon
        return <Text>p</Text>
      } else {
        return <IconChatCheckMark height={16} width={16}/>
      }
    }

    let renderDate = () => {
      let updatedAt = props?.latestMessagePreview?.messageObject?.updated_at 
      if(!updatedAt) return <></>

      let diffTime = calculateTime(moment(updatedAt))
      return <Text style={{fontSize: 12, marginLeft: 4}}>{diffTime}</Text>
    }
    return (
      <View style={{ paddingRight: 12, display:'flex', flexDirection:'row'}}>
        {/* <ChannelPreviewStatus latestMessagePreview={newLatestMessagePreview} /> */}
        { renderCheckMark() }
        { renderDate() }
      </View>
    );
  };

  const customPreviewTitle = (props) => {
    let { name } = props.channel?.data;

    return (
      <View style={{ paddingRight: 12 }}>
        <ChannelPreviewTitle
          displayName={getChatName(name, profile.myProfile.username)}
        />
      </View>
    );
  };

  const CustomPreviewMessage = (props) => {
    console.log('props');
    console.log(props);
    return (
      <ChannelPreviewMessage
        latestMessagePreview={{ ...props.latestMessagePreview }}
      />
    );
  };

  const CustomPreview = (props) => {
    return (
      <View style={{ paddingHorizontal: 15 }}>
        <ChannelPreviewMessenger
          channel={props.channel}
          PreviewStatus={customPreviewStatus}
          PreviewAvatar={CustomPreviewAvatar}
          PreviewTitle={customPreviewTitle}
          PreviewMessage={CustomPreviewMessage}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <StatusBar backgroundColor="transparent" />
      <View style={{ height: '100%' }}>
        <View style={{ height: 52 }}>
          <Search
            animatedValue={0}
            onPress={() => navigation.navigate('ContactScreen')}
          />
        </View>
        <View style={{ paddingHorizontal: 0, flex: 1 }}>
          {client.client ? (
            <Chat client={client.client} i18nInstance={streami18n}>
              <ChannelList
                PreviewAvatar={CustomPreviewAvatar}
                filters={memoizedFilters}
                // Preview={CustomPreview}
                PreviewStatus={customPreviewStatus}
                PreviewTitle={customPreviewTitle}
                onSelect={(channel) => {
                  if (channel.data.channel_type === CHANNEL_TYPE_TOPIC) {
                    // toDo reset main feeds
                    setMainFeeds(null, dispatchFeed)
                    navigation.navigate('TopicPageScreen', { id: channel.data.id });
                  } else {
                    setChannel(channel, dispatch);
                    // ChannelScreen | ChatDetailPage
                    navigation.navigate('ChatDetailPage');
                  }
                }}
                sort={sort}
                options={options}
                maxUnreadCount={99}
                additionalFlatListProps={{
                  onEndReached: () => null,
                  refreshControl: null,
                }}
              />
            </Chat>
          ) : (
            <View style={styles.content}>
              <ActivityIndicator size="small" color={COLORS.holyTosca} />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'transparent',
  },
})

export default ChannelListScreen;
