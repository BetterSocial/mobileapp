import * as React from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';

import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {calculateTime} from '../../utils/time';
import Dot from '../Dot';
import ActionChat from './ActionChat';
import ProfileMessage from './ProfileMessage';

const MessageText = ({image, name, time, message, read, isMe, all}) => {
  const [onAction, setOnAction] = React.useState(false);

  return (
    <ActionChat isMe={isMe} active={onAction}>
      <View style={styles.container}>
        <View style={styles.containerImage}>
          <ProfileMessage image={image} />
        </View>
        <TouchableWithoutFeedback
          onLongPress={() => setOnAction(true)}
          onPress={() => setOnAction(false)}>
          <View style={styles.containerChat(isMe)}>
            <View style={styles.user}>
              <View style={styles.userDetail}>
                <Text style={styles.name}>{name}</Text>
                <Dot color="#000" />
                <Text style={styles.time}>{calculateTime(time)}</Text>
              </View>
            </View>
            <Text style={styles.message}>{message}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </ActionChat>
  );
};

export default MessageText;

const styles = StyleSheet.create({
  name: {
    fontSize: 12,
    fontFamily: fonts.inter[600],
    lineHeight: 14.53,
    color: '#000',
    marginRight: 5.7,
  },
  containerImage: {
    paddingTop: 5,
  },
  time: {
    fontSize: 10,
    fontFamily: fonts.inter[600],
    lineHeight: 12,
    color: '#000',
    marginLeft: 5,
  },
  message: {
    color: '#000',
    marginTop: 4,
    fontSize: 16,
    fontFamily: fonts.inter[400],
    lineHeight: 19.36,
  },
  container: {
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 4,
  },
  containerChat: (isMe) => ({
    backgroundColor: isMe ? colors.halfBaked : colors.lightgrey,
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 9.35,
    flex: 1,
    borderRadius: 8,
    marginLeft: 8,
  }),
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userDetail: {flexDirection: 'row', alignItems: 'center'},
});
