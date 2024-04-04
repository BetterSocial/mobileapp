/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {AppState, FlatList, View} from 'react-native';

import BaseChatItem from '../../components/AnonymousChat/BaseChatItem';
import ChatDetailHeader from '../../components/AnonymousChat/ChatDetailHeader';
import InputMessageV2 from '../../components/Chat/InputMessageV2';
import {Context} from '../../context';
import {setChannel} from '../../context/actions/setChannel';
import ChannelList from '../../database/schema/ChannelListSchema';
import useChatUtilsHook from '../../hooks/core/chat/useChatUtilsHook';
import useMoveChatTypeHook from '../../hooks/core/chat/useMoveChatTypeHook';
import {SIGNED} from '../../hooks/core/constant';
import useProfileHook from '../../hooks/core/profile/useProfileHook';
import useChatScreenHook from '../../hooks/screen/useChatScreenHook';
import {getOtherProfile} from '../../service/profile';
import Loading from '../Loading';
import {styles} from './AnonymousChatScreen';
import StorageUtils from '../../utils/storage';

const SignedChatScreen = () => {
  const {selectedChannel, chats, goBackFromChatScreen, goToChatInfoScreen, sendChat} =
    useChatScreenHook(SIGNED);
  const {fetchChannelDetail} = useChatUtilsHook('SIGNED');
  const flatlistRef = React.useRef<FlatList>();
  const [loading, setLoading] = React.useState(false);
  const [isAnonimityEnabled, setIsAnonimityEnabled] = React.useState(true);
  const [, dispatchChannel] = (React.useContext(Context) as unknown as any).channel;
  const [profile] = (React.useContext(Context) as unknown as any).profile;
  const {signedProfileId} = useProfileHook();

  const {moveToAnonymousChannel} = useMoveChatTypeHook();

  const exitedGroup =
    selectedChannel?.rawJson?.channel?.better_channel_member?.findIndex(
      (item: any) => item.user_id === signedProfileId
    ) < 0;
  const memberChat = selectedChannel?.rawJson?.channel?.members?.find(
    (item: any) => item.user_id !== signedProfileId
  );

  const renderChatItem = React.useCallback(
    ({item, index}) => {
      return <BaseChatItem type={SIGNED} item={item} index={index} />;
    },
    [chats]
  );

  const goToChatInfoPage = () => {
    goToChatInfoScreen({from: SIGNED});
  };

  const scrollToEnd = () => {
    flatlistRef.current?.scrollToEnd();
  };

  const moveChatToAnon = async () => {
    try {
      setLoading(true);
      await moveToAnonymousChannel({
        oldChannelId: selectedChannel?.id,
        targetUserId: memberChat.user_id,
        source: 'userId'
      });
    } catch (e) {
      console.log('error moving chat to signed channel', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherProfile = async () => {
    try {
      const result = await getOtherProfile(memberChat?.user?.username);
      if (result.code === 200) {
        setIsAnonimityEnabled(result.data.isAnonMessageEnabled);
      }
    } catch (e) {
      // nothing
    }
  };

  React.useEffect(() => {
    if (selectedChannel) {
      setChannel(selectedChannel, dispatchChannel);
      fetchOtherProfile();
      fetchChannelDetail(selectedChannel as ChannelList);
      const serializeData = JSON.stringify({
        id: selectedChannel.id,
        channelType: selectedChannel.channelType
      });
      StorageUtils.openedChannel.set(serializeData);
    }
  }, [selectedChannel]);

  const appState = React.useRef(AppState.currentState);
  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        const channelData = StorageUtils.openedChannel.get();
        const parsedData = JSON.parse(channelData || '');
        fetchChannelDetail({id: parsedData.id, channelType: parsedData.channelType} as ChannelList);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <View style={styles.keyboardAvoidingView}>
      {selectedChannel ? (
        <ChatDetailHeader
          channel={selectedChannel}
          onAvatarPress={exitedGroup ? null : () => goToChatInfoPage()}
          onBackPress={goBackFromChatScreen}
          onThreeDotPress={exitedGroup ? null : () => goToChatInfoPage()}
          avatar={selectedChannel?.channelPicture}
          type={SIGNED}
          user={selectedChannel?.name}
          anon_user_info_emoji_code={selectedChannel?.anon_user_info_emoji_code}
          anon_user_info_color_code={selectedChannel?.anon_user_info_color_code}
        />
      ) : null}

      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        style={styles.chatContainer}
        data={chats}
        inverted={true}
        windowSize={10}
        maxToRenderPerBatch={5}
        initialNumToRender={20}
        alwaysBounceVertical={false}
        bounces={false}
        onLayout={scrollToEnd}
        keyExtractor={(item, index) => item?.id || index.toString()}
        renderItem={renderChatItem}
      />
      {!exitedGroup && (
        <View style={styles.inputContainer}>
          <InputMessageV2
            onSendButtonClicked={sendChat}
            type={SIGNED}
            username={selectedChannel?.name}
            profileImage={profile?.myProfile?.profile_pic_path}
            onToggleConfirm={moveChatToAnon}
            messageDisable={
              selectedChannel?.channelType === 'GROUP'
                ? 'Coming soon: Anonymous messages are not enabled yet within group chats'
                : null
            }
            isAnonimityEnabled={isAnonimityEnabled}
          />
        </View>
      )}
      <Loading visible={loading} />
    </View>
  );
};

export default SignedChatScreen;
