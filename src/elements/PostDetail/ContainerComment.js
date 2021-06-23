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
  return (
    <View style={styles.container}>
      {comments.map((item, index) => {
        return (
          <View key={'p' + index}>
            <Comment
              key={'p' + index}
              comment={item.data.text}
              username={item.user.data.username}
              level={0}
              isLast={
                index === comments.length - 1 ||
                item.children_counts.comment === 0
              }
              onPress={() => {
                navigation.navigate('ReplyComment', {item: item});
              }}
            />
            {item.children_counts.comment > 0 && (
              <ReplyComment
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
const ReplyComment = ({data, countComment, navigation}) => {
  const [isChildShown, setIsChildShown] = React.useState(false);
  const onShowReplyClicked = () => setIsChildShown(!isChildShown);

  return (
    <ContainerReply>
      {data.map((item, index) => {
        return (
          <ConnectorWrapper index={index}>
            <View key={'c' + index}>
              <Comment
                key={'c' + index}
                comment={item.data.text}
                username={item.user.data.username}
                level={1}
                onPress={() =>
                  navigation.navigate('ReplyComment', {item: item})
                }
                isLast={
                  index === countComment - 1 && item.children_counts.comment === 0
                }
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
              comment={item.data.text}
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

const ContainerReply = ({children, isGrandchild}) => {
  return (
    <View
      style={[
        styles.containerReply,
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
  containerReply: {
    borderLeftWidth: 1,
  },
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
});
