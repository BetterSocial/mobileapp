import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';

import FlatListItem from '../../components/FlatListItem';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const SheetPrivacy = ({privacyRef, data, select, onSelect}) => {
  return (
    <RBSheet
      ref={privacyRef}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        container: {
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        },
        draggableIcon: {
          backgroundColor: colors.alto,
        },
      }}>
      <View style={styles.container}>
        <Text style={styles.header}>Privacy</Text>
        {data.map((value, index) => (
          <FlatListItem
            key={index}
            value={value.label}
            index={index}
            select={select}
            onSelect={onSelect}
            icon={value.icon}
            desc={value.desc}
          />
        ))}
      </View>
    </RBSheet>
  );
};

export default SheetPrivacy;

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
