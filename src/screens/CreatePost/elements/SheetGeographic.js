import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';

import FlatListItem from '../../../components/FlatListItem';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';

const SheetGeographic = ({geoRef, data, select, onSelect}) => (
    <RBSheet
      ref={geoRef}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        container: styles.containerSheet,
        draggableIcon: styles.draggableIcon,
      }}>
      <View style={styles.container}>
        <Text style={styles.header}>Where is this post relevant</Text>
        {data.map((value, index) => (
          <FlatListItem
            key={index}
            value={value.neighborhood}
            index={index}
            select={select}
            onSelect={onSelect}
          />
        ))}
      </View>
    </RBSheet>
  );

export default SheetGeographic;

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
  containerSheet: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  draggableIcon: {
    backgroundColor: colors.alto,
  },
});
