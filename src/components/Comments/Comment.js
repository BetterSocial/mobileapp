/* eslint-disable global-require */
import * as React from 'react';
import IconEn from 'react-native-vector-icons/Entypo';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import ButtonHightlight from '../ButtonHighlight';
import Image from '../Image';
import MemoCommentReply from '../../assets/icon/CommentReply';
import MemoIc_arrow_down_vote_off from '../../assets/arrow/Ic_downvote_off';
import MemoIc_arrow_upvote_off from '../../assets/arrow/Ic_upvote_off';
import MemoIc_downvote_on from '../../assets/arrow/Ic_downvote_on';
import MemoIc_upvote_on from '../../assets/arrow/Ic_upvote_on';
import useComment from './hooks/useComment';
import {FONTS} from '../../utils/theme';
import {calculateTime} from '../../utils/time';
import {colors} from '../../utils/colors';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {getUserId} from '../../utils/users';
import {removeWhiteSpace} from '../../utils/Utils';
import BlockComponent from '../BlockComponent';
import {getCaptionWithLinkStyle} from '../../utils/string/StringUtils';
import CommentUserName from '../CommentUsername/CommentUsername';

const Comment = ({
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
  onLongPress,
  updateVote
}) => {
  const navigation = useNavigation();
  const refBlockComponent = React.useRef();
  const [yourselfId, setYourselfId] = React.useState('');
  const {totalVote, setTotalVote, statusVote, onUpVote, onDownVote, iVote} = useComment({
    comment,
    level,
    updateVote
  });
  const onTextPress = () => {
    if (level >= 2 || disableOnTextPress) {
      return;
    }
    if (onPress && typeof onPress === 'function') {
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

  const onBlockComponent = (commentParams) => {
    refBlockComponent.current.openBlockComponent({
      anonimity: false,
      actor: commentParams.user,
      id: commentParams.id
    });
  };

  const handleOnLongPress = () => {
    if (onLongPress && typeof onLongPress === 'function') {
      onLongPress(comment, level);
    }
  };

  React.useEffect(() => {
    iVote();
    const parseToken = async () => {
      const id = await getUserId();
      if (id) {
        setYourselfId(id);
      }
    };
    parseToken();
  }, []);

  React.useEffect(() => {
    setTotalVote(comment.data?.count_upvote - comment.data?.count_downvote);
    iVote();
  }, [JSON.stringify(comment.data)]);

  const voteStyle = () => {
    if (totalVote > 0) {
      return '#00ADB5';
    }
    if (totalVote < 0) {
      return '#FF2E63';
    }
    return '#C4C4C4';
  };
  return (
    <View
      style={styles.container({
        isLast,
        style,
        level,
        isLastInParent,
        showLeftConnector
      })}>
      <View testID="openProfile" style={styles.flexStartContainer}>
        <ButtonHightlight
          onLongPress={handleOnLongPress}
          style={styles.flexStartContainer}
          onPress={openProfile}>
          <View style={styles.profile}>
            {comment.data?.anon_user_info_emoji_name || comment.data?.is_anonymous ? (
              <View
                style={[styles.image, {backgroundColor: comment.data?.anon_user_info_color_code}]}>
                <Text>{comment.data?.anon_user_info_emoji_code}</Text>
              </View>
            ) : (
              <Image
                source={
                  photo
                    ? {uri: removeWhiteSpace(photo)}
                    : require('../../assets/images/ProfileDefault.png')
                }
                style={styles.image}
              />
            )}

            <View style={styles.containerUsername}>
              <CommentUserName comment={comment} user={user} />
              <Text style={styles.time}> {calculateTime(time)}</Text>
            </View>
          </View>
        </ButtonHightlight>
      </View>
      <TouchableOpacity testID="textPress" onPress={onTextPress} style={styles.flexStartContainer}>
        <ButtonHightlight
          onLongPress={handleOnLongPress}
          style={styles.flexStartContainer}
          onPress={onTextPress}>
          <Text style={styles.post}>{getCaptionWithLinkStyle(comment.data?.text)}</Text>
        </ButtonHightlight>
      </TouchableOpacity>
      <View style={styles.constainerFooter}>
        {isLast && level >= 2 ? (
          <View testID="level2" style={styles.gap} />
        ) : (
          <TouchableOpacity activeOpacity={1} onPress={onPress} testID="memoComment">
            <ButtonHightlight
              onLongPress={handleOnLongPress}
              style={styles.btnReply}
              onPress={onPress}>
              <MemoCommentReply />
              <Text style={styles.btnReplyText}>Reply</Text>
            </ButtonHightlight>
          </TouchableOpacity>
        )}
        <ButtonHightlight
          onLongPress={handleOnLongPress}
          style={[styles.btnBlock(comment.user.id === yourselfId), styles.btn]}
          onPress={() => onBlockComponent(comment)}>
          <IconEn name="block" size={15.02} color={colors.gray1} />
        </ButtonHightlight>

        <TouchableOpacity activeOpacity={1} onPress={onDownVote} testID="btnDownvote">
          <ButtonHightlight
            onLongPress={handleOnLongPress}
            style={[styles.arrowup, styles.btn]}
            onPress={onDownVote}>
            {statusVote === 'downvote' ? (
              <MemoIc_downvote_on width={20} height={18} />
            ) : (
              <MemoIc_arrow_down_vote_off width={20} height={18} />
            )}
          </ButtonHightlight>
        </TouchableOpacity>

        <Text style={styles.vote(voteStyle())}>{totalVote}</Text>
        <TouchableOpacity activeOpacity={1} testID="upvoteBtn">
          <ButtonHightlight
            onLongPress={handleOnLongPress}
            style={[styles.arrowdown, styles.btn]}
            onPress={onUpVote}>
            {statusVote === 'upvote' ? (
              <MemoIc_upvote_on width={20} height={18} />
            ) : (
              <MemoIc_arrow_upvote_off width={20} height={18} />
            )}
          </ButtonHightlight>
        </TouchableOpacity>
      </View>

      <BlockComponent ref={refBlockComponent} screen={'feed_comment_item'} />
    </View>
  );
};

export const isEqual = (prevProps, nextProps) => prevProps.comment === nextProps.comment;
export default React.memo(Comment);

const styles = StyleSheet.create({
  vote: (colorBasedVote) => ({
    ...FONTS.body3,
    textAlign: 'center',
    width: 26,
    alignSelf: 'center',
    color: colorBasedVote
  }),
  btn: {
    // width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: ({isLast, style, level, showLeftConnector}) => ({
    width: '100%',
    borderLeftWidth: showLeftConnector ? 1 : 0,
    borderLeftColor: isLast ? (level === 0 ? colors.gray1 : 'transparent') : colors.gray1,
    ...style
  }),
  flexStartContainer: {
    alignSelf: 'flex-start'
  },
  username: {
    fontFamily: fonts.inter[700],
    fontSize: normalizeFontSize(12),
    color: '#828282',
    lineHeight: 14,
    marginLeft: 16
  },
  post: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    color: '#333333',
    marginLeft: 28
  },
  profile: {
    flexDirection: 'row',
    marginLeft: -13,
    alignSelf: 'flex-start'
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
    color: '#C4C4C4',
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
    color: '#828282',
    lineHeight: 12
  },
  containerUsername: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
