import React, {useState, useEffect} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import ContainerComment from '../../elements/PostDetail/ContainerComment';
import WriteComment from '../../elements/PostDetail/WriteComment';
import {createChildComment, createCommentParent} from '../../service/comment';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const ReplyComment = (props) => {
  const [item, setItem] = useState(props.route.params.item);
  const [parent, setParent] = useState(props.route.params.parent);
  const [textComment, setTextComment] = useState('');
  const [isReaction, setReaction] = useState(false);

  useEffect(() => {
    const init = () => {
      if (JSON.stringify(item.children_counts) !== {}) {
        setReaction(true);
      }
    };
    init();
  }, [item]);

  const createComment = async () => {
    if (textComment === '') {
      Alert.alert('warning', 'Comment not null');
      return;
    }

    try {
      let data = await createChildComment(textComment, item.id);
      console.log(data);
      if (data.code === 200) {
        setTextComment('');
      }
    } catch (error) {
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
        onChangeText={(v) => setTextComment(v)}
        onPress={() => createComment()}
        value={textComment}
      />
      {/* </ScrollView> */}
    </View>
  );
};

export default ReplyComment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  btn: {
    // backgroundColor: colors.bondi_blue,
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
    // marginTop: 30,
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
