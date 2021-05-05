import React, {useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Button} from '../../components/Button';
import TopicItem from '../../components/TopicItem';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const SheetAddTopic = ({refTopic, onAdd, topics, onClose, saveOnClose}) => {
  const [dataTopic, setTopic] = useState('');
  const [listTopics, setlistTopics] = useState([]);
  let inputRef = useRef();

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
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);
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
      onOpen={() => merge()}
      onClose={() => {
        onSwepDown();
      }}
      ref={refTopic}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        container: {
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          height: 'auto',
        },
        draggableIcon: {
          backgroundColor: colors.alto,
        },
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
                    style={{marginBottom: 12}}
                  />
                );
              })}
            </View>
            {listTopics.length < 5 && (
              <View style={styles.containerInput}>
                <Text style={styles.hashtag}>#</Text>
                <TextInput
                  ref={inputRef}
                  style={{width: '100%', paddingStart: 0}}
                  onSubmitEditing={() => add()}
                  value={dataTopic}
                  onChangeText={(v) => setTopic(v)}
                  autoCapitalize="none"
                  onKeyPress={({nativeEvent}) => {
                    if (nativeEvent.key.trim().length === 0) {
                      add();
                    }
                  }}
                  blurOnSubmit={false}
                />
              </View>
            )}
          </View>
          {/* <Gap style={{height: 30}} /> */}
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
    // paddingBottom: 100,
    paddingBottom: 38,
  },
  content: {
    backgroundColor: colors.lightgrey,
    paddingHorizontal: 16,
    paddingTop: 17,
    // paddingBottom: 130,
    minHeight: 150,
    // height: 150,
    marginTop: 12,
    // marginBottom: 44,
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
  },
  textDesc: {
    fontSize: 10,
    fontFamily: fonts.inter[400],
    color: colors.gray,
    marginTop: 5,
    marginBottom: 21,
  },
});
