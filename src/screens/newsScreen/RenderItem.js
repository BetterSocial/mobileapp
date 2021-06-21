import * as React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

import Header from './Header';
import Content from './Content';
import {Footer} from '../../components';
import {COLORS, SIZES} from '../../utils/theme';
import Gap from '../../components/Gap';

const RenderItem = ({item}) => {
  return (
    <View>
      <View style={styles.container}>
        <Header
          image={item.domain.image}
          domain={item.domain.name}
          time={item.content.created_at}
        />
        <Content
          title={item.content.title}
          image={item.content.image}
          description={item.content.description}
          url={item.content.url}
        />
      </View>
      <View style={styles.wrapperFooter}>
        <Footer item={item} totalComment={0} totalVote={0} />
      </View>
      <Gap height={8} />
      <View style={{height: 1, width: '100%', backgroundColor: '#C4C4C4'}} />
      <Gap height={16} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.base,
    borderRadius: SIZES.radius,
    borderWidth: 0.3,
    borderColor: COLORS.gray,
    paddingVertical: SIZES.base,
    marginHorizontal: SIZES.base,
  },
  wrapperFooter: {
    marginHorizontal: SIZES.base,
  },
});

export default RenderItem;
