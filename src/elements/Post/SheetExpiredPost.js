import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import FlatListItem from '../../components/FlatListItem';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
const SheetExpiredPost = ({refExpired, data, select, onSelect}) => {
  return (
    <RBSheet
      ref={refExpired}
      closeOnDragDown={true}
      closeOnPressMask={false}
      customStyles={{
        container: {
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          height: 'auto',
        },
        draggableIcon: {
          backgroundColor: colors.alto,
        },
      }}>
      <View style={styles.container}>
        <Text style={styles.header}>Post expiration after</Text>
        {data.map((value, index) => (
          <FlatListItem
            key={index}
            value={value.label}
            index={index}
            select={select}
            onSelect={onSelect}
          />
        ))}
      </View>
    </RBSheet>
  );
};

{
}
export default SheetExpiredPost;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 38,
  },
  header: {
    color: colors.black,
    fontFamily: fonts.inter[600],
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
});
