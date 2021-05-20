import React, {useState} from 'react';
import {
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
import {createChildComment, createCommentParent} from '../../service/comment';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const ReplyComment = (props) => {
  const [item, setItem] = useState(props.route.params.item);
  const [textComment, setTextComment] = useState('');
  const createComment = async () => {
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
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity>
            <ArrowLeftIcon width={20} height={12} fill="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>
            Reply to{' '}
            {/* {item.anonimiti === true ? Anonymous : item.actor.data.username} */}
          </Text>
          <TouchableOpacity style={styles.btn} onPress={() => createComment()}>
            <Text style={styles.btnText}>Post</Text>
          </TouchableOpacity>
        </View>
        {/* <ContainerComment comments={} /> */}
        <View style={styles.comment}>
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
        </View>
      </ScrollView>
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
    backgroundColor: colors.bondi_blue,
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
  },
});
