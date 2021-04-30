import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Comment from '../../elements/PostDetail/Comment';
import ContainerComment from '../../elements/PostDetail/ContainerComment';
import Footer from '../../elements/PostDetail/Footer';
import Header from '../../elements/PostDetail/Header';
import Profile from '../../elements/PostDetail/Profile';
import WriteComment from '../../elements/PostDetail/WriteComment';
import {fonts} from '../../utils/fonts';

const PostDetailPage = () => {
  const [more, setMore] = useState(10);
  const [totalLine, setTotalLine] = useState(0);
  const onTextLayout = (e) => {
    setTotalLine(e.nativeEvent.lines.length);
  };
  const onMore = () => {
    if (more < totalLine) {
      setMore(more + 10);
    }
  };
  return (
    <View style={styles.container}>
      <Header />
      <Profile />
      <View style={styles.containerText}>
        <Text
          style={styles.textDesc}
          numberOfLines={more}
          onTextLayout={onTextLayout}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vitae
          diam et tortor rutrum tincidunt vitae non arcu. Pellentesque mattis
          tellus quam, sed porttitor nunc aliquam vitae. Donec id dui lacinia,
          pellentesque ipsum sed, commodo sapien. Praesent tincidunt accumsan
          nibh, id laoreet sapien porta et. Ut aliquet purus sit amet lectus
          fermentum, id consectetur lorem porta. Donec vestibulum lobortis
          ligula, sit amet luctus enim tincidunt non. Nam ultricies lacus ac
          nibh molestie volutpat. Ut aliquet purus sit amet lectus fermentum, id
          consectetur lorem porta. Donec vestibulum lobortis ligula, sit amet
          luctus enim tincidunt non. Nam ultricies lacus ac nibh molestie
          volutpat.
        </Text>
        {more < totalLine && (
          <TouchableOpacity onPress={() => onMore()}>
            <Text style={styles.more}>More</Text>
          </TouchableOpacity>
        )}
      </View>
      <Footer />
      <ContainerComment />
      <WriteComment />
    </View>
  );
};

export default PostDetailPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  containerText: {
    marginTop: 20,
    marginHorizontal: 22,
  },
  textDesc: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    color: '#000',
  },
  more: {
    color: '#0e24b3',
    fontFamily: fonts.inter[400],
    fontSize: 14,
  },
});
