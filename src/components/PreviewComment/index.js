import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import SeeMore from 'react-native-see-more-inline';

import {calculateTime} from '../../utils/time';
import MemoIc_arrow_upvote_off from '../../assets/arrow/Ic_arrow_upvote_off';
import MemoIc_arrow_down_vote_off from '../../assets/arrow/Ic_arrow_down_vote_off';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {COLORS, FONTS, SIZES} from '../../utils/theme';
import {Dot, Gap} from '../../components';

const PreviewComment = ({
  username,
  comment,
  time,
  image,
  totalComment,
  onPress,
}) => {
  return (
    <View>
      <View style={[styles.container]}>
        <View style={styles.profile}>
          <Image
            source={
              image
                ? {uri: image}
                : require('../../assets/images/ProfileDefault.png')
            }
            style={styles.image}
          />
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <Text style={styles.username}>{username}</Text>
            <Gap width={4} />
            <Dot size={4} color={'#828282'} />
            <Gap width={4} />
            <Text style={{color: COLORS.gray, ...FONTS.body4}}>
              {calculateTime(time)}
            </Text>
          </View>
        </View>
        <View style={styles.text}>
          <SeeMore seeMoreText={'More'} seeLessText={'Less'} numberOfLines={2}>
            {comment}
          </SeeMore>
        </View>
        <Gap height={SIZES.base} />
      </View>
      {totalComment >= 1 && (
        <TouchableOpacity style={{marginStart: 8}} onPress={onPress}>
          <Text
            style={{
              color: '#2F80ED',
              ...FONTS.body4,
            }}>{`${totalComment} More replies`}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PreviewComment;

const styles = StyleSheet.create({
  text: {
    marginStart: 20,
  },
  image: {
    width: 24,
    height: 24,
  },
  container: {
    borderLeftWidth: 1,
    marginHorizontal: 16,
    borderLeftColor: '#C4C4C4',
  },
  username: {
    fontFamily: fonts.inter[600],
    fontSize: 12,
    color: '#828282',
    marginLeft: SIZES.base,
  },
  // post: {
  //   fontFamily: fonts.inter[400],
  //   fontSize: 16,
  //   color: '#333333',
  //   marginLeft: 28,
  // },
  profile: {
    flexDirection: 'row',
    marginLeft: -12,
  },
  // constainerFooter: {
  //   flexDirection: 'row',
  //   justifyContent: 'flex-end',
  //   marginTop: 11.13,
  // },
  // btnReply: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // btnReplyText: {
  //   fontFamily: fonts.inter[400],
  //   fontSize: 13,
  //   color: '#C4C4C4',
  //   marginLeft: 8.98,
  // },
  // btnBlock: {
  //   marginLeft: 28.61,
  //   marginRight: 28.51,
  // },
  // arrowup: {
  //   marginRight: 33.04,
  // },
});
