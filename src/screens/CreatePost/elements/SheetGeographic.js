import * as React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {StyleSheet, Text, View} from 'react-native';

import FlatListItem from '../../../components/FlatListItem';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

const SheetGeographic = ({geoRef, data, select, onSelect}) => {
  const renderLocationString = (value) => {
    if (value?.location_level?.toLowerCase() === 'neighborhood') return value?.neighborhood;
    if (value?.location_level?.toLowerCase() === 'city') return value?.city;
    if (value?.location_level?.toLowerCase() === 'state') return value?.state;
    if (value?.location_level?.toLowerCase() === 'country') return value?.country;
    return value?.location_level;
  };

  return (
    <RBSheet
      ref={geoRef}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        wrapper: {
          backgroundColor: COLORS.black80
        },
        container: styles.containerSheet,
        draggableIcon: styles.draggableIcon
      }}>
      <View style={styles.container}>
        <Text style={styles.header}>Where is this post relevant</Text>
        {data.map((value, index) => (
          <FlatListItem
            key={index}
            value={renderLocationString(value)}
            index={index}
            select={select}
            onSelect={onSelect}
          />
        ))}
      </View>
    </RBSheet>
  );
};

export default SheetGeographic;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 38
  },
  header: {
    color: COLORS.black,
    fontFamily: fonts.inter[600],
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20
  },
  containerSheet: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
  },
  draggableIcon: {
    backgroundColor: COLORS.gray110
  }
});
