import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const Header = ({title, onPress, titleStyle = {}, containerStyle = {}, isCenter}) => {
  const renderHeader = () => (
    <View style={styles.buttonBackContainerIos}>
      <View style={styles.content}>
        {onPress ? (
          <TouchableOpacity testID="backButton" style={styles.backPadding} onPress={onPress}>
            <ArrowLeftIcon />
          </TouchableOpacity>
        ) : (
          <View style={styles.backPadding}>
            <View style={styles.nullBackIcon} />
          </View>
        )}
        <View style={styles.flex}>
          <Text
            numberOfLines={1}
            style={{
              ...styles.textIos,
              ...titleStyle,
              fontSize: 20,
              textAlign: isCenter ? 'center' : 'left'
            }}>
            {title}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{...styles.container, ...containerStyle}}>
      {renderHeader()}
      <View style={styles.gap} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white'
    // padding: 10
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  text: {
    color: colors.black,
    fontFamily: fonts.poppins[600],
    fontSize: 14,
    fontWeight: 'bold'
  },
  textIos: {
    color: colors.black,
    fontFamily: fonts.poppins[600],
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 15
  },
  gap: {width: 20, height: 12},
  buttonBackContainer: {
    width: '100%'
  },
  buttonBackContainerIos: {
    paddingVertical: 16,
    width: '100%'
  },
  backPadding: {
    paddingVertical: 10,
    paddingRight: 15,
    paddingLeft: 10
  },
  flex: {
    flex: 1
  },
  nullBackIcon: {
    width: 20,
    height: 12
  }
});
