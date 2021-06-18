import * as React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import IconEn from 'react-native-vector-icons/Entypo';
import IconAnt from 'react-native-vector-icons/AntDesign';

import MemoIc_arrow_upvote_off from '../../assets/arrow/Ic_arrow_upvote_off';
import MemoIc_arrow_down_vote_off from '../../assets/arrow/Ic_arrow_down_vote_off';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const Comment = ({username, comment, onPress, isLast = false}) => {
  return (
    <View
      style={[
        styles.container,
        {borderLeftColor: isLast ? '#fFF' : colors.gray1},
      ]}>
      <View style={styles.profile}>
        <Image
          source={require('../../assets/images/ProfileDefault.png')}
          style={styles.image}
        />
        <Text style={styles.username}>{username}</Text>
      </View>
      <Text style={styles.post}>{comment}</Text>
      <View style={styles.constainerFooter}>
        {isLast === true ? (
          <View style={{marginBottom: 8}} />
        ) : (
          <TouchableOpacity style={styles.btnReply} onPress={onPress}>
            <IconAnt name="back" size={15.77} color={colors.gray1} />
            <Text style={styles.btnReplyText}>Reply</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.btnBlock}>
          <IconEn name="block" size={15.02} color={colors.gray1} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.arrowup}>
          <MemoIc_arrow_down_vote_off width={18} height={18} />
        </TouchableOpacity>
        <TouchableOpacity>
          <MemoIc_arrow_upvote_off width={18} height={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Comment;

const styles = StyleSheet.create({
  image: {
    width: 24,
    height: 24,
  },
  container: {
    borderLeftWidth: 1,
  },
  username: {
    fontFamily: fonts.inter[600],
    fontSize: 12,
    color: '#828282',
    marginLeft: 17,
  },
  post: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    color: '#333333',
    marginLeft: 28,
  },
  profile: {
    flexDirection: 'row',
    marginLeft: -12,
  },
  constainerFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 11.13,
  },
  btnReply: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnReplyText: {
    fontFamily: fonts.inter[400],
    fontSize: 13,
    color: '#C4C4C4',
    marginLeft: 8.98,
  },
  btnBlock: {
    marginLeft: 28.61,
    marginRight: 28.51,
  },
  arrowup: {
    marginRight: 33.04,
  },
});
