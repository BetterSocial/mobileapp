import * as React from 'react';
import {TextInput, ScrollView, StyleSheet, Text, View} from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';
import KeyEvent from 'react-native-keyevent';

import TopicItem from '../../../components/TopicItem';
import {Button} from '../../../components/Button';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';
import AutoFocusTextArea from '../../../components/TextArea/AutoFocusTextArea';

const SheetAddTopic = ({refTopic, onAdd, topics, onClose, saveOnClose}) => {
  const [dataTopic, setTopic] = React.useState('');
  const [listTopics, setlistTopics] = React.useState([]);
  const [trigger, setTrigger] = React.useState(-1);
  let inputRef = React.useRef();

  React.useEffect(() => {
    KeyEvent.onKeyUpListener((keyEvent) => {
      // console.log(`key ${keyEvent.keyCode}`);
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

  const add = () => {
    let data = dataTopic.replace(/\s/g, '').toLowerCase();
    if (data !== '' && !listTopics.includes(data)) {
      setlistTopics((val) => [...val, data]);
      setTopic('');
    }
    setTopic('');
  };
  const removeTopic = (v) => {
    let newArr = listTopics.filter((e) => e !== v);
    setlistTopics(newArr);
  };
  const merge = () => {
    setlistTopics(topics);
  };
  const save = () => {
    console.log('save');
    let data = dataTopic.replace(/\s/g, '').toLowerCase();
    if (data === '') {
      onAdd(listTopics);
    } else {
      if (!listTopics.includes(data)) {
        let newArr = [...listTopics, data];
        onAdd(newArr);
      }
    }
    add();
    onClose();
  };
  const onSwepDown = () => {
    let data = dataTopic.replace(/\s/g, '').toLowerCase();
    if (data === '') {
      saveOnClose(listTopics);
    } else {
      if (!listTopics.includes(data)) {
        let newArr = [...listTopics, data];
        saveOnClose(newArr);
      }
    }
    add();
  };
  return (
    <RBSheet
      height={330}
      onOpen={merge}
      onClose={onSwepDown}
      ref={refTopic}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        container: styles.containerSheet,
        draggableIcon: styles.draggableIcon,
      }}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always">
          <Text style={styles.title}>Add topics</Text>
          <View style={styles.content}>
            <View style={styles.listItem}>
              {listTopics.map((value, index) => {
                return (
                  <TopicItem
                    key={index}
                    label={value}
                    removeTopic={removeTopic}
                    style={styles.topicItem}
                  />
                );
              })}
            </View>
            {listTopics.length < 5 && (
              <View style={styles.containerInput}>
                <Text style={styles.hashtag}>#</Text>
                <AutoFocusTextArea
                  ref={inputRef}
                  style={styles.input}
                  onSubmitEditing={() => add()}
                  value={dataTopic}
                  onChangeText={(v) => {
                    if (v.match(/\s+$/gm)) {
                      return add();
                    }
                    setTopic(v);
                  }}
                  autoCapitalize="none"
                  blurOnSubmit={false}
                />
              </View>
            )}
          </View>
          <Text style={styles.textDesc}>
            Hit space to start a new topic. Add up to 5 topics.
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
    paddingBottom: 38,
  },
  content: {
    backgroundColor: colors.lightgrey,
    paddingHorizontal: 16,
    paddingTop: 17,
    minHeight: 150,
    marginTop: 12,
    borderRadius: 8,
  },
  title: {
    color: colors.black,
    fontFamily: fonts.inter[600],
    fontSize: 18,
    fontWeight: 'bold',
  },
  containerTag: {
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 7.33,
    width: 122,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 12,
  },
  tag: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hashtag: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: fonts.inter[400],
    marginTop: -8,
  },
  textDesc: {
    fontSize: 10,
    fontFamily: fonts.inter[400],
    color: colors.gray,
    marginTop: 5,
    marginBottom: 21,
  },
  containerSheet: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  draggableIcon: {
    backgroundColor: colors.alto,
  },
  topicItem: {
    marginBottom: 12,
  },
  input: {width: '100%', paddingStart: 0},
});
