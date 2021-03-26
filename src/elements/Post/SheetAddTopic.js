import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Button} from '../../components/Button';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import Icon from 'react-native-vector-icons/Fontisto';
import IconA5 from 'react-native-vector-icons/FontAwesome5';
import {TextInput} from 'react-native-gesture-handler';
import Gap from '../../components/Gap';
import TopicItem from '../../components/TopicItem';

const SheetAddTopic = ({
  refTopic,
  onAdd,
  topic,
  onChangeTextTopic,
  listTopic,
  removeTopic,
}) => {
  return (
    <RBSheet
      ref={refTopic}
      closeOnDragDown={true}
      closeOnPressMask={false}
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
        <Text style={styles.title}>Add topics</Text>
        <View style={styles.content}>
          <View style={styles.listItem}>
            {listTopic.map((value, index) => {
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
          {listTopic.length < 5 && (
            <View style={styles.containerInput}>
              <Text style={styles.hashtag}>#</Text>
              <TextInput
                style={{width: '100%'}}
                onSubmitEditing={onAdd}
                value={topic}
                onChangeText={onChangeTextTopic}
                returnKeyType="done"
              />
            </View>
          )}
          <Gap style={{height: 30}} />
        </View>
        <Button>Save</Button>
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
    // paddingBottom: 130,
    minHeight: 150,
    // height: 150,
    marginTop: 12,
    marginBottom: 44,
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
});
