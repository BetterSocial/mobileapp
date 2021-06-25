import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Toast from 'react-native-simple-toast';
import {useNavigation} from '@react-navigation/native';

import Comment from '../../elements/PostDetail/Comment';
import WriteComment from '../../elements/PostDetail/WriteComment';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import {fonts} from '../../utils/fonts';
import {colors} from '../../utils/colors';
import {createChildComment} from '../../service/comment';

const ReplyComment = (props) => {
  const navigation = useNavigation();
  const [item, setItem] = React.useState(props.route.params.item);
  const [parent, setParent] = React.useState(props.route.params.parent);
  const [textComment, setTextComment] = React.useState('');
  const [isReaction, setReaction] = React.useState(false);

  React.useEffect(() => {
    const init = () => {
      if (JSON.stringify(item.children_counts) !== {}) {
        setReaction(true);
      }
    };
    init();
  }, [item]);

  const createComment = async () => {
    try {
      if (textComment.trim() !== '') {
        let data = await createChildComment(textComment, item.id);
        console.log(data);
        if (data.code === 200) {
          setTextComment('');
          Toast.show('Comment successful', Toast.LONG);
          navigation.goBack();
        } else {
          Toast.show('Failed Comment', Toast.LONG);
        }
      } else {
        Toast.show('Comments are not empty', Toast.LONG);
      }
    } catch (error) {
      Toast.show('Failed Comment', Toast.LONG);
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      {/* <ScrollView> */}
      <View style={styles.header}>
        <TouchableOpacity>
          <ArrowLeftIcon width={20} height={12} fill="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          Reply to{' '}
          {/* {item.anonimiti === true ? Anonymous : item.actor.data.username} */}
          {item.user.data.username}
        </Text>
        <View style={styles.btn} />
      </View>
      <View style={styles.containerComment}>
        <Comment
          username={item.user.data.username}
          comment={item.data.text}
          onPress={() => {}}
        />
        {item.children_counts.comment > 0 &&
          item.latest_children.comment.map((itemReply, index) => {
            return (
              <ContainerReply>
                <Comment
                  key={'r' + index}
                  username={itemReply.user.data.username}
                  comment={itemReply.data.text}
                  onPress={() => {}}
                />
                {itemReply.children_counts.comment > 0 &&
                  itemReply.latest_children.comment.map(
                    (itemReplyChild, ind) => {
                      return (
                        <ContainerReply>
                          <Comment
                            key={'rc' + ind}
                            username={itemReplyChild.user.data.username}
                            comment={itemReplyChild.data.text}
                            onPress={() => {}}
                          />
                          {}
                        </ContainerReply>
                      );
                    },
                  )}
              </ContainerReply>
            );
          })}
      </View>
      {/* <Text style={styles.post}>text commentParent</Text> */}
      {/* {isReaction && <ContainerComment comments={item.latest_children} />} */}
      {/* <View style={styles.comment}>
        <Image
          source={require('../.../../../assets/images/ProfileDefault.png')}
          style={styles.image}
        />
        <TextInput
          style={styles.input}
          placeholder="Your comment"
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          onChangeText={(v) => setTextComment(v)}
          value={textComment}
        />
      </View> */}
      <WriteComment
        username={item.user.data.username}
        onChangeText={(v) => setTextComment(v)}
        onPress={() => createComment()}
        value={textComment}
      />
      {/* </ScrollView> */}
    </View>
  );
};
const ContainerReply = ({children, isGrandchild}) => {
  return <View style={styles.containerReply(isGrandchild)}>{children}</View>;
};
export default ReplyComment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerComment: {
    paddingHorizontal: 22,
    marginTop: 24.5,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  containerReply: (isGrandchild) => ({
    borderLeftWidth: 1,
    paddingLeft: 30,
    borderColor: isGrandchild ? '#fff' : colors.gray1,
  }),
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  btnText: {
    color: '#fff',
  },
  headerText: {
    fontFamily: fonts.inter[600],
    fontSize: 14,
    color: '#000',
  },
  image: {
    width: 48,
    height: 48,
  },
  input: {
    backgroundColor: '#F2F2F2',
    flex: 1,
    color: '#000',
    padding: 10,
    marginLeft: 20,
    borderRadius: 8,
  },
  comment: {
    flexDirection: 'row',
    paddingRight: 20,
    position: 'absolute',
    bottom: 0,
  },
  post: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    color: '#333333',
    marginLeft: 28,
  },
});
