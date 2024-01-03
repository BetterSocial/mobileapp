import * as React from 'react';
import IconEn from 'react-native-vector-icons/Entypo';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import BlockComponent from '../BlockComponent';
import MemoCommentReply from '../../assets/icon/CommentReply';
import MemoIc_arrow_down_vote_off from '../../assets/arrow/Ic_downvote_off';
import MemoIc_arrow_upvote_off from '../../assets/arrow/Ic_upvote_off';
import {calculateTime} from '../../utils/time';
import {fonts} from '../../utils/fonts';
import {getUserId} from '../../utils/users';
import {COLORS} from '../../utils/theme';

const DetailDomainScreenCommentItem = ({
  user,
  comment,
  onPress,
  isLast = false,
  isLastInParent = false,
  time,
  style,
  photo,
  level,
  showLeftConnector = true,
  disableOnTextPress = false,
  onVoteUp,
  onVoteDown
}) => {
  const navigation = useNavigation();
  const refBlockComponent = React.useRef();
  const [yourselfId, setYourselfId] = React.useState('');

  const onTextPress = () => {
    if (level >= 2 || disableOnTextPress) {
      return;
    }
    if (onPress) {
      onPress();
    }
  };

  const openProfile = async () => {
    const selfUserId = await getUserId();
    if (selfUserId === user.id) {
      return navigation.navigate('ProfileScreen', {
        isNotFromHomeTab: true
      });
    }
    return navigation.navigate('OtherProfile', {
      data: {
        user_id: selfUserId,
        other_id: user.id,
        username: user.data.username
      }
    });
  };

  const onBlock = (comment) => {
    refBlockComponent.current.openBlockComponent({
      anonimity: false,
      actor: comment.user,
      id: comment.id
    });
  };

  React.useEffect(() => {
    const parseToken = async () => {
      const id = await getUserId();
      if (id) {
        setYourselfId(id);
      }
    };
    parseToken();
  }, []);

  return (
    <View
      style={styles.container({
        isLast,
        style,
        level,
        isLastInParent,
        showLeftConnector
      })}>
      <TouchableOpacity onPress={openProfile}>
        <View style={styles.profile}>
          <Image
            source={photo ? {uri: photo} : require('../../assets/images/ProfileDefault.png')}
            style={styles.image}
          />
          <View style={styles.containerUsername}>
            <Text style={styles.username}>{user.data.username} •</Text>
            <Text style={styles.time}> {calculateTime(time)}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onTextPress}>
        <Text style={styles.post}>{comment.data.text}</Text>
      </TouchableOpacity>
      <View style={styles.constainerFooter}>
        {isLast && level >= 2 ? (
          <View style={styles.gap} />
        ) : (
          <TouchableOpacity style={styles.btnReply} onPress={onPress}>
            <MemoCommentReply />
            <Text style={styles.btnReplyText}>Reply</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.btnBlock(comment.user.id === yourselfId), styles.btn]}
          onPress={() => onBlock(comment)}>
          <IconEn name="block" size={15.02} color={COLORS.lightgrey} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onVoteDown} style={[styles.arrowup, styles.btn]}>
          <MemoIc_arrow_down_vote_off width={18} height={18} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onVoteUp} style={[styles.arrowdown, styles.btn]}>
          <MemoIc_arrow_upvote_off width={18} height={18} />
        </TouchableOpacity>
      </View>

      <BlockComponent
        ref={refBlockComponent}
        refresh={() => {}}
        screen="detail_domain_comment_item"
      />
    </View>
  );
};

export default DetailDomainScreenCommentItem;

const styles = StyleSheet.create({
  btn: {
    // width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 24,
    height: 24,
    borderRadius: 12
  },
  container: ({isLast, style, level, isLastInParent}) => ({
    width: '100%',
    borderLeftWidth: isLastInParent ? 0 : 1,
    borderLeftColor: isLast ? (level === 0 ? COLORS.lightgrey : 'transparent') : COLORS.lightgrey,
    ...style
  }),
  username: {
    fontFamily: fonts.inter[700],
    fontSize: 12,
    color: COLORS.blackgrey,
    lineHeight: 14,
    marginLeft: 16
  },
  post: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    color: COLORS.mine_shaft,
    marginLeft: 28
  },
  profile: {
    flexDirection: 'row',
    marginLeft: -13
  },
  constainerFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 11.13,
    marginBottom: 12,
    marginLeft: 30
  },
  btnReply: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1
  },
  btnReplyText: {
    fontFamily: fonts.inter[400],
    fontSize: 13,
    color: COLORS.lightgrey,
    marginLeft: 8.98,
    marginRight: 14
  },
  btnBlock: (isMySelf) => ({
    paddingHorizontal: 14,
    display: isMySelf ? 'none' : 'flex'
  }),
  arrowup: {
    paddingHorizontal: 14
  },
  arrowdown: {
    paddingHorizontal: 14
  },
  gap: {marginBottom: 8},
  time: {
    fontFamily: fonts.inter[400],
    fontSize: 10,
    color: COLORS.blackgrey,
    lineHeight: 12
  },
  containerUsername: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
