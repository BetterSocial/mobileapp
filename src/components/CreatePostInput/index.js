import * as React from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';

import MentionSuggestions from './elements/MentionSuggestions';
import TopicSuggestions from './elements/TopicSuggestions';
import useHastagMention from '../../screens/CreatePost/elements/useHastagMention';
import { colors } from '../../utils/colors';
import { getTopics } from '../../service/topics';
import { getUserForTagging } from '../../service/mention';
import { isEmptyOrSpaces } from '../../utils/Utils';
import { joinTopicIntoTopicList } from '../../utils/array/ChunkArray';

const CreatePostInput = ({
    allTaggedUser = [],
    message = '',
    topics = [],
    topicChats = [],
    setAllTaggedUser = () => { },
    setMessage = () => { },
    setPositionKeyboard = () => { },
    setTopics = () => { },
    setTopicChats = () => { },
}) => {
    const [positionEndCursor, setPositionEndCursor] = React.useState(0)
    const [topicSearch, setTopicSearch] = React.useState([])
    const [userTaggingSearch, setUserTaggingSearch] = React.useState([])
    const [hashtagPosition, setHashtagPosition] = React.useState(0)
    const [positionTopicSearch, setPositionTopicSearch] = React.useState(0)

    const [textContent, handleStateHashtag, handleStateMention, setHashtags] = useHastagMention('');

    const resetTopicSearch = () => setTopicSearch([])
    const resetListUsersForTagging = () => setUserTaggingSearch([])

    const searchTopic = async (name) => {
        if (!isEmptyOrSpaces(name)) {
            getTopics(name)
                .then(v => {
                    setTopicSearch(v.data);
                })
                .catch(err => console.log(err));
        }
    }

    const searchUsersForTagging = async (name) => {
        console.log('called')
        if (!isEmptyOrSpaces(name)) {
            getUserForTagging(name)
                .then(v => {
                    console.log('search results')
                    console.log(v)
                    setUserTaggingSearch(v);
                })
                .catch(err => console.log(err));
        }
    }


    const handlePostTextChanged = (v) => {
        if (topics.length >= 5) {
            setMessage(v)
            return
        }

        if (v.includes('#')) {
            const position = v.lastIndexOf('#', positionEndCursor);
            const spaceStatus = v.includes(' ', position);
            const detectEnter = v.includes('\n', position);
            const textSeacrh = v.substring(position + 1);
            setHashtagPosition(position);
            /**
             * cari posisi kursor dimana
             * cek apakah posisi sebelum kursor # atau bukan
             * ambil semua value setelah posisi #
             */
            if (!spaceStatus) {
                if (!detectEnter) {
                    setPositionTopicSearch(position);
                    searchTopic(textSeacrh);
                    setPositionKeyboard('always')
                }
                else {
                    resetTopicSearch();
                    setPositionKeyboard('never')
                }
            }
            else {
                resetTopicSearch();
                setPositionKeyboard('never')
                const removeCharacterAfterSpace = textSeacrh.split(' ')[0];
                const newTopics = joinTopicIntoTopicList(removeCharacterAfterSpace, topics)
                setTopics(newTopics)
                setHashtags(newTopics)
            }

            handleStateHashtag(v);
        } else if (v.includes('@')) {
            const position = v.lastIndexOf('@', positionEndCursor);
            const spaceStatus = v.includes(' ', position);
            const detectEnter = v.includes('\n', position);
            const textSeacrh = v.substring(position + 1);
            setHashtagPosition(position);
            console.log(`${spaceStatus} vs ${detectEnter}`)
            if (!spaceStatus) {
                if (!detectEnter) {
                    setPositionTopicSearch(position);
                    searchUsersForTagging(textSeacrh);
                    setPositionKeyboard('always')
                }
                else {
                    resetListUsersForTagging();
                    setPositionKeyboard('never')
                }
            }
            else {
                resetListUsersForTagging();
                setPositionKeyboard('never')
            }
            handleStateMention(v);
        }
        else {
            resetTopicSearch();
            resetListUsersForTagging();
            setPositionKeyboard('never')
        }
        setMessage(v);
    }

    return <>
        <TextInput
            onSelectionChange={(e) => {
                setPositionEndCursor(e.nativeEvent.selection.end);
            }}
            onChangeText={handlePostTextChanged}
            // value={message}
            multiline={true}
            style={styles.input}
            textAlignVertical="top"
            placeholder={
                'What’s on your mind?\nRemember to be respectful .\nDownvotes  & Blocks harm all your posts’ visibility.'
            }
            autoCapitalize={'none'}

        >
            <Text>{textContent}</Text>
        </TextInput>
        <TopicSuggestions message={message}
            handleStateHashtag={handleStateHashtag}
            hashtagPosition={hashtagPosition}
            positionTopicSearch={positionTopicSearch}
            setHashtags={setHashtags}
            setPositionKeyboard={setPositionKeyboard}
            setMessage={setMessage}
            setTopicChats={setTopicChats}
            setTopicSearch={setTopicSearch}
            setTopics={setTopics}
            topicChats={topicChats}
            topics={topics}
            topicSearch={topicSearch} />

        <MentionSuggestions message={message}
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
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: colors.lightgrey,
        paddingVertical: 16,
        paddingHorizontal: 12,
        minHeight: 100,
        justifyContent: 'flex-start',
        overflow: 'scroll',
    },
})

export default CreatePostInput