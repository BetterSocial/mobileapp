import * as React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import StringConstant from '../../utils/string/StringConstant';
import {colors} from '../../utils/colors';
import Comment from './Comment';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ConnectorWrapper from './ConnectorWrapper';

const ContainerComment = ({comments}) => {
  const navigation = useNavigation();
  let isLast = (index, item) => {
    return (
      index === comments.length - 1 && (item.children_counts.comment || 0) === 0
    );
  };

  let hideLeftConnector = (index, item) => {
    // console.log(index === comments.length - 1 && item.children_counts.comment > 0);
    return index === comments.length - 1;
  };

  return (
    <View style={styles.container}>
      {comments.map((item, index) => {
        return (
          <View>
            <View key={'p' + index}>
              <Comment
                key={'p' + index}
                comment={item.data.text}
                username={item.user.data.username}
                level={0}
                time={item.created_at}
                photo={item.user.data.profile_pic_url}
                isLast={isLast(index, item)}
                onPress={() => {
                  navigation.navigate('ReplyComment', {item: item});
                }}
              />
            </View>
            {item.children_counts.comment > 0 && (
              <ReplyComment
                hideLeftConnector={hideLeftConnector(index, item)}
                data={item.latest_children.comment}
                countComment={item.children_counts.comment}
                navigation={navigation}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};
const ReplyComment = ({data, countComment, navigation, hideLeftConnector}) => {
  const [isChildShown, setIsChildShown] = React.useState(false);
  const onShowReplyClicked = () => setIsChildShown(!isChildShown);

  let isLast = (item, index) => {
    return (
      index === countComment - 1 && (item.children_counts.comment || 0) === 0
    );
  };

  return (
    <ContainerReply hideLeftConnector={hideLeftConnector}>
      {data.map((item, index) => {
        return (
          <ConnectorWrapper index={index}>
            <View key={'c' + index} style={styles.levelOneCommentWrapper}>
              <Comment
                key={'c' + index}
                comment={item.data.text}
                username={item.user.data.username}
                level={1}
                photo={item.user.data.profile_pic_url}
                time={item.created_at}
                onPress={() =>
                  navigation.navigate('ReplyComment', {item: item})
                }
                isLast={isLast(item, index)}
              />
              {item.children_counts.comment > 0 && (
                <>
                  {isChildShown && (
                    <ReplyCommentChild
                      data={item.latest_children.comment}
                      countComment={item.children_counts.comment}
                      navigation={navigation}
                      parent={item}
                    />
                  )}
                  <>
                    {!isChildShown && (
                      <View style={styles.seeRepliesContainer}>
                        <View style={styles.connector} />
                        <TouchableOpacity onPress={onShowReplyClicked}>
                          <Text style={styles.seeRepliesText}>
                            {StringConstant.postDetailPageSeeReplies(
                              item.children_counts.comment || 0,
                            )}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                </>
              )}
            </View>
          </ConnectorWrapper>
        );
      })}
    </ContainerReply>
  );
};

const ReplyCommentChild = ({
  data,
  countComment,
  navigation,
  isLast,
  parent,
}) => {
  return (
    <ContainerReply isGrandchild={countComment === 1}>
      {data.map((item, index) => {
        return (
          <ConnectorWrapper index={index}>
            <Comment
              key={'c' + index}
              photo={item.user.data.profile_pic_url}
              comment={item.data.text}
              time={item.created_at}
              level={2}
              username={item.user.data.username}
              onPress={() => {
                console.log(parent);
                console.log('======');
                navigation.navigate('ReplyComment', {
                  item: item,
                  parent: parent,
                });
              }}
              isLast={index === countComment - 1}
            />
          </ConnectorWrapper>
        );
      })}
    </ContainerReply>
  );
};

const ContainerReply = ({children, isGrandchild, hideLeftConnector}) => {
  console.log(hideLeftConnector);
  return (
    <View
      style={[
        styles.containerReply(hideLeftConnector),
        {borderColor: isGrandchild ? '#fff' : colors.gray1},
      ]}>
      {children}
    </View>
  );
};
export default ContainerComment;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
  },
  containerReply: (hideLeftConnector) => ({
    borderLeftWidth: hideLeftConnector ? 0 : 1,
  }),
  seeRepliesContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 14,
  },
  seeRepliesText: {
    color: colors.blue,
  },
  connector: {
    width: 15,
    height: 10,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 21,
    borderLeftColor: colors.gray1,
    borderBottomColor: colors.gray1,
    marginRight: 4,
  },
  levelOneCommentWrapper: {
    flex: 1,
  },
});
