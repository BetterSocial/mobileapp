import * as React from 'react';
import KeyEvent from 'react-native-keyevent';
import RBSheet from 'react-native-raw-bottom-sheet';
import {ScrollView, StyleSheet, Text, TextInput, TouchableNativeFeedback, View} from 'react-native';

import Card from './Card';
import TopicItem from '../../../components/TopicItem';
import {Button} from '../../../components/Button';
import {convertString} from '../../../utils/string/StringUtils';
import {fonts} from '../../../utils/fonts';
import {getTopics} from '../../../service/topics';
import {isEmptyOrSpaces} from '../../../utils/Utils';
import {COLORS} from '../../../utils/theme';

const SheetAddTopic = ({refTopic, onAdd, topics, onClose, chatTopics}) => {
  const [dataTopic, setTopic] = React.useState('');
  const [listTopics, setlistTopics] = React.useState([]);
  const [chatTopic, setChatTopic] = React.useState([]);
  const [trigger, setTrigger] = React.useState(-1);
  const [topicSuggestion, setTopicSuggestion] = React.useState([]);
  const rbSheetHeight = 330;
  const [, setWidthInput] = React.useState(0);
  const inputRef = React.useRef();

  React.useEffect(() => {
    KeyEvent.onKeyUpListener((keyEvent) => {
      onKeyUp(keyEvent.keyCode);
    });

    return () => {
      KeyEvent.removeKeyUpListener();
    };
  }, []);

  React.useEffect(() => {
    add();
  }, [trigger]);

  const onKeyUp = (keycode) => {
    if (keycode === 62) {
      setTrigger(new Date().valueOf());
    }
  };

  const searchTopic = async (name) => {
    if (!isEmptyOrSpaces(name)) {
      getTopics(name)
        .then((v) => {
          if (v.data.length > 0) {
            if (v.data.length > 5) {
              const newData = v.data.slice(0, 5);
              setTopicSuggestion(newData);
            } else {
              setTopicSuggestion(v.data);
            }
          }
        })
        .catch((err) => {
          if (__DEV__) {
            console.log(err);
          }
        });
    }
  };
  const add = () => {
    const data = dataTopic.replace(/\s/g, '');
    if (data !== '' && !listTopics.includes(data)) {
      setlistTopics((val) => [...val, data]);
      setChatTopic((val) => [...val, `topic_${data}`]);
      setTopic('');
    }
    setTopic('');
    setTopicSuggestion([]);
  };
  const removeTopic = (v) => {
    const newArr = listTopics.filter((e) => e !== v);
    const newChatTopic = chatTopic.filter((chat) => chat !== `topic_${v}`);
    setlistTopics(newArr);
    setChatTopic(newChatTopic);
  };
  const merge = () => {
    setlistTopics(topics);
    setChatTopic(chatTopics);
  };
  const save = () => {
    const data = dataTopic.replace(/\s/g, '').toLowerCase();
    if (data === '') {
      onAdd(listTopics, chatTopic);
    } else if (!listTopics.includes(data)) {
      const newArr = [...listTopics, data];
      const newChatTopic = [...chatTopic, `topic_${data}`];
      onAdd(newArr, newChatTopic);
    }
    add();
    onClose();
  };

  return (
    <RBSheet
      height={rbSheetHeight}
      onOpen={merge}
      // onClose={onSwepDown}
      ref={refTopic}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        container: styles.containerSheet,
        draggableIcon: styles.draggableIcon
      }}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
          <Text style={styles.title}>Add communities</Text>
          <View
            style={styles.content}
            onLayout={(event) => {
              // const headerHeightLayout = event.nativeEvent.layout.height;
              const headerWidthLayout = event.nativeEvent.layout.width;
              setWidthInput(headerWidthLayout);
            }}>
            <View style={styles.listItem}>
              {listTopics.map((value, index) => (
                <TopicItem
                  key={index}
                  label={value}
                  removeTopic={removeTopic}
                  style={styles.topicItem}
                />
              ))}
            </View>
            {listTopics.length < 5 && (
              <View style={styles.containerInput}>
                <Text style={styles.hashtag}>#</Text>
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  onSubmitEditing={() => add()}
                  value={dataTopic}
                  onChangeText={(v) => {
                    if (v.match(/\s+$/gm)) {
                      return add();
                    }
                    setTopic(v);
                    if (v !== '') {
                      searchTopic(v);
                    }

                    return null;
                  }}
                  autoCapitalize="none"
                  blurOnSubmit={false}
                  autoFocus
                />
              </View>
            )}
            {topicSuggestion.length > 0 && (
              <Card>
                {topicSuggestion.map((item, index) => (
                  <TouchableNativeFeedback
                    key={`topicSuggestions-${index}`}
                    onPress={() => {
                      let textTopic = convertString(item.name, ' ', '');
                      textTopic += ' ';
                      setTopic(textTopic.toLowerCase());
                      setTopicSuggestion([]);
                      onKeyUp(62);
                    }}>
                    <View style={{marginBottom: 5}}>
                      <Text
                        style={{
                          color: COLORS.black,
                          fontFamily: fonts.inter[500],
                          fontWeight: '500',
                          fontSize: 12,
                          lineHeight: 18
                        }}>
                        #{convertString(item.name, ' ', '')}
                      </Text>
                      {index !== topicSuggestion.length - 1 && (
                        <View
                          style={{height: 1, marginTop: 5, backgroundColor: COLORS.lightgrey}}
                        />
                      )}
                    </View>
                  </TouchableNativeFeedback>
                ))}
              </Card>
            )}
          </View>

          <Text style={styles.textDesc}>
            Hit space to finish adding a community. Add up to 5 communities.
          </Text>
          <Button onPress={() => save()}>Save</Button>
        </ScrollView>
      </View>
    </RBSheet>
  );
};
export default SheetAddTopic;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 38
  },
  content: {
    backgroundColor: COLORS.lightgrey,
    paddingHorizontal: 16,
    paddingTop: 17,
    minHeight: 150,
    marginTop: 12,
    borderRadius: 8,
    paddingBottom: 16
  },
  title: {
    color: COLORS.black,
    fontFamily: fonts.inter[600],
    fontSize: 18,
    fontWeight: 'bold'
  },
  containerTag: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 7.33,
    width: 122,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 12
  },
  tag: {
    fontFamily: fonts.inter[400],
    fontSize: 12
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  listItem: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  hashtag: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: fonts.inter[400]
    // marginTop: Platform.OS === 'android' ? -8 : 0,
  },
  textDesc: {
    fontSize: 10,
    fontFamily: fonts.inter[400],
    color: COLORS.blackgrey,
    marginTop: 5,
    marginBottom: 21
  },
  containerSheet: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
  },
  draggableIcon: {
    backgroundColor: COLORS.lightgrey
  },
  topicItem: {
    marginBottom: 12
  },
  input: {width: '100%', paddingStart: 0}
});
