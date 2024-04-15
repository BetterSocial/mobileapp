import * as React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {StyleSheet, Text, TextInput} from 'react-native';
import {debounce} from 'lodash';

import MentionSuggestions from './elements/MentionSuggestions';
import TopicSuggestions from './elements/TopicSuggestions';
import useHastagMention from '../../screens/CreatePost/elements/useHastagMention';
import {COLORS} from '../../utils/theme';
import {getTopics} from '../../service/topics';
import {getUserForTagging} from '../../service/mention';
import {isEmptyOrSpaces} from '../../utils/Utils';
import {joinTopicIntoTopicList} from '../../utils/array/ChunkArray';
import {fonts} from '../../utils/fonts';
import dimen from '../../utils/dimen';

const CreatePostInput = ({
  allTaggedUser = [],
  message,
  topics = [],
  topicChats = [],
  setAllTaggedUser,
  setPositionKeyboard,
  setTopics,
  setTopicChats,
  setMessage,
  typeUser
}) => {
  const [topicSearch, setTopicSearch] = React.useState([]);
  const [userTaggingSearch, setUserTaggingSearch] = React.useState([]);
  const [hashtagPosition, setHashtagPosition] = React.useState(0);
  const [positionTopicSearch, setPositionTopicSearch] = React.useState(0);
  const [lastTopicInCursor, setLastTopicInCursor] = React.useState('');
  const inputRef = React.useRef();
  const {formattedText, handleStateHashtag, handleStateMention, setHashtags, updateHashtag} =
    useHastagMention('');

  React.useEffect(() => {
    if (new Date().valueOf() > 0) updateHashtag(message, topics, setTopics);
  }, [message]);

  React.useEffect(() => {
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 500);
    }
  }, []);

  const cancelTokenRef = React.useRef(axios.CancelToken.source());

  const searchTopicDebounced = React.useCallback(
    debounce((name) => {
      searchTopic(name);
    }, 500),
    []
  );

  const searchUserDebounced = React.useCallback(
    debounce((name) => {
      searchUsersForTagging(name);
    }, 500),
    []
  );

  const resetTopicSearch = () => setTopicSearch([]);
  const resetListUsersForTagging = () => setUserTaggingSearch([]);

  const searchTopic = async (name) => {
    if (!isEmptyOrSpaces(name)) {
      const cancelToken = cancelTokenRef.current.token;
      getTopics(name, {cancelToken})
        .then((v) => {
          setTopicSearch(v.data);
        })
        .catch((err) => {
          if (__DEV__) {
            console.log('get topics error: ', err);
          }
        });
    } else {
      resetTopicSearch();
    }
  };

  const searchUsersForTagging = async (name) => {
    if (!isEmptyOrSpaces(name)) {
      getUserForTagging(name)
        .then((v) => {
          setUserTaggingSearch(v);
        })
        .catch((err) => {
          if (__DEV__) {
            console.log('get topics error: ', err);
          }
        });
    } else {
      resetListUsersForTagging();
    }
  };

  const cancelAllRequest = () => {
    cancelTokenRef?.current?.cancel();
    cancelTokenRef.current = axios.CancelToken.source();
  };

  const isTopicInDeletedText = (event) => {
    const {nativeEvent} = event;
    const isBackspacePressed = nativeEvent?.key === 'Backspace';
    const deleteHashtagDetected =
      lastTopicInCursor !== '' && lastTopicInCursor.indexOf(' ') === -1 && isBackspacePressed;
    if (!deleteHashtagDetected) return;

    const newTopics = [...topics];

    newTopics.splice(newTopics?.lastIndexOf(lastTopicInCursor), 1);
    setTopics(newTopics);
  };

  const handlePostTextChanged = (v) => {
    setMessage(v);
    // updateHashtag(v, topics, setTopics)
    const positionHashtag = v.lastIndexOf('#');
    const positionMention = v.lastIndexOf('@');
    if (topics.length >= 5 && !v.includes('@')) {
      return;
    }

    const isMentionDetected = v.includes('@') && positionMention > positionHashtag;
    const isHashtagDetected = v.includes('#') && positionHashtag > positionMention;

    if (isHashtagDetected) {
      handleHashtagDetection(v, positionHashtag);
    } else if (isMentionDetected) {
      handleMentionDetection(v, positionMention);
    } else {
      resetTopicSearch();
      resetListUsersForTagging();
      setPositionKeyboard('never');
      cancelAllRequest();
      // handleStateHashtag(v, setTopics)
    }
  };

  const handleHashtagDetection = (v, positionHashtag) => {
    const spaceStatus = v.includes(' ', positionHashtag);
    const detectEnter = v.includes('\n', positionHashtag);
    const textSearch = v.substring(positionHashtag + 1);
    setHashtagPosition(positionHashtag);
    /**
     * cari posisi kursor dimana
     * cek apakah posisi sebelum kursor # atau bukan
     * ambil semua value setelah posisi #
     */
    if (!spaceStatus && !detectEnter) {
      setPositionTopicSearch(positionHashtag);
      searchTopicDebounced(textSearch);
      setPositionKeyboard('always');
      setLastTopicInCursor(textSearch);
    } else {
      resetTopicSearch();
      setPositionKeyboard('never');
      cancelAllRequest();
      const removeCharacterAfterSpace = textSearch.split(' ')[0];
      const newTopics = joinTopicIntoTopicList(removeCharacterAfterSpace, topics);
      setTopics(newTopics);

      setLastTopicInCursor('');
    }
  };

  const handleMentionDetection = (v, positionMention) => {
    const spaceStatus = v.includes(' ', positionMention);
    const detectEnter = v.includes('\n', positionMention);
    const textSearch = v.substring(positionMention + 1);
    setHashtagPosition(positionMention);
    if (!spaceStatus && !detectEnter) {
      setPositionTopicSearch(positionMention);
      searchUserDebounced(textSearch);
      setPositionKeyboard('always');
    } else {
      resetListUsersForTagging();
      setPositionKeyboard('never');
      cancelAllRequest();
    }
  };

  return (
    <>
      <TextInput
        ref={inputRef}
        onKeyPress={isTopicInDeletedText}
        onChangeText={handlePostTextChanged}
        // value={message}
        multiline={true}
        numberOfLines={10}
        style={[
          styles.input,
          typeUser ? {borderBottomRightRadius: 0, borderBottomLeftRadius: 0} : {}
        ]}
        textAlignVertical="top"
        placeholder={
          'What’s on your mind?\nRemember to be respectful.\nDownvotes & Blocks harm all your posts’ visibility.'
        }
        placeholderTextColor={COLORS.gray410}
        autoCapitalize={'sentences'}
        keyboardAppearance="dark">
        <Text>{formattedText}</Text>
      </TextInput>
      <TopicSuggestions
        message={message}
        handleStateHashtag={handleStateHashtag}
        hashtagPosition={hashtagPosition}
        positionTopicSearch={positionTopicSearch}
        // setHashtags={setHashtags}
        setPositionKeyboard={setPositionKeyboard}
        setMessage={setMessage}
        setTopicChats={setTopicChats}
        setTopicSearch={setTopicSearch}
        setTopics={setTopics}
        topicChats={topicChats}
        topics={topics}
        topicSearch={topicSearch}
      />

      <MentionSuggestions
        message={message}
        allTaggedUser={allTaggedUser}
        handleStateMention={handleStateMention}
        hashtagPosition={hashtagPosition}
        positionTopicSearch={positionTopicSearch}
        setHashtags={setHashtags}
        setAllTaggedUser={setAllTaggedUser}
        setMessage={setMessage}
        setPositionKeyboard={setPositionKeyboard}
        setUserForTagging={setUserTaggingSearch}
        userSearch={userTaggingSearch}
      />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.gray110,
    paddingVertical: dimen.normalizeDimen(16),
    paddingHorizontal: dimen.normalizeDimen(12),
    borderRadius: 8,
    minHeight: dimen.normalizeDimen(100),
    maxHeight: dimen.normalizeDimen(200),
    justifyContent: 'flex-start',
    overflow: 'scroll',
    color: COLORS.white,
    fontFamily: fonts.inter[400]
  }
});

CreatePostInput.propTypes = {
  allTaggedUser: PropTypes.array,
  topics: PropTypes.array,
  topicChats: PropTypes.array,
  setAllTaggedUser: PropTypes.func,
  setPositionKeyboard: PropTypes.func,
  setTopics: PropTypes.func,
  setTopicChats: PropTypes.func,
  message: PropTypes.string,
  setMessage: PropTypes.func,
  typeUser: PropTypes.string
};

export default CreatePostInput;
